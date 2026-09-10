/**
 * What is sold, in one place.
 *
 * The price lives here and nowhere else — the page reads it, the Checkout
 * session is built from it, and a browser can never propose one. A price that
 * arrives in a request is a price the buyer chose.
 */
export const COURSE_PRODUCT = {
  /** Cents. Stripe counts in the currency's smallest unit. */
  amount: 14_900,
  currency: "usd",
  name: "Build a Bridge Agent — the repository",
  description:
    "Private access to the working system the course is written from: the Windows agent kit, the receiver, the sandbox with its ground truth, the tests, and the source and target specs.",
  /** Where access is granted. */
  repo: { owner: "3tdream", name: "bridge-agent" },
} as const;

export const REPO_URL = `https://github.com/${COURSE_PRODUCT.repo.owner}/${COURSE_PRODUCT.repo.name}`;
/** GitHub's "copy this repository" link — works once the buyer has access. */
export const REPO_COPY_URL = `${REPO_URL}/generate`;

/** The free rig: the synthetic screen and the scorer, MIT, no account. It is
 *  what makes the course's central claim checkable before anyone pays. */
export const SANDBOX_URL = "https://github.com/3tdream/bridge-agent-sandbox";

/** "$149" — for display, from the same number Stripe charges. */
export function priceLabel(): string {
  const whole = COURSE_PRODUCT.amount / 100;
  return `$${Number.isInteger(whole) ? whole : whole.toFixed(2)}`;
}

/**
 * The buyer's GitHub username is collected at checkout, because access is
 * granted to a GitHub account and an email address does not name one.
 */
export const GITHUB_FIELD = "github_username";
