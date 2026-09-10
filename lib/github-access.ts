/**
 * Granting a buyer access to the repository they bought.
 *
 * One call, no database: Stripe holds the record of the purchase, GitHub holds
 * the record of who has access, and neither needs a copy here.
 */
const API = "https://api.github.com";

export type GrantResult =
  | { ok: true; state: "invited" | "already" | "dry-run" }
  | { ok: false; reason: string };

/** GitHub usernames: letters, digits and hyphens, up to 39. Checked because
 *  this string arrives from a checkout form and goes into a URL path. */
export function validGitHubUsername(name: string): boolean {
  return /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/.test(name);
}

export async function grantRepoAccess(
  username: string,
  repo: { owner: string; name: string },
): Promise<GrantResult> {
  const clean = username.trim().replace(/^@/, "");
  if (!validGitHubUsername(clean)) return { ok: false, reason: `not a GitHub username: ${JSON.stringify(username)}` };

  // Dry run is checked FIRST, deliberately. Behind the token check it could
  // only ever run on a deployment that already had a token, which is not what
  // a dry run is for: it exists so the path can be exercised where granting
  // real access would be wrong.
  if (process.env.GITHUB_GRANT_DRY_RUN === "1") {
    console.log(`[github] DRY RUN — would invite ${clean} to ${repo.owner}/${repo.name} as pull`);
    return { ok: true, state: "dry-run" };
  }

  // A deployment without the token must fail loudly — silently not granting
  // access is a paid customer waiting for something that will never arrive.
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, reason: "GITHUB_TOKEN is not set on this deployment" };

  const res = await fetch(`${API}/repos/${repo.owner}/${repo.name}/collaborators/${clean}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ permission: "pull" }),
  });

  // 201 with an invitation, or 204 when they already had access — both mean
  // the buyer can reach the repository, which is the only thing that matters.
  if (res.status === 201) return { ok: true, state: "invited" };
  if (res.status === 204) return { ok: true, state: "already" };

  const detail = await res.text();
  return { ok: false, reason: `github ${res.status}: ${detail.slice(0, 200)}` };
}
