import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Github } from "lucide-react";
import { BASE } from "@/lib/bridge-course";
import { COURSE_PRODUCT, REPO_COPY_URL, REPO_URL } from "@/lib/course-product";
import { getStripe, stripeConfigured, stripeIsTestMode } from "@/lib/stripe";

export const metadata: Metadata = { title: "You're in — Build a bridge agent", robots: { index: false } };
export const dynamic = "force-dynamic";

/** The GitHub account the buyer named at checkout, read back from Stripe so the
 *  page can say where the invitation went rather than guess. */
async function namedAccount(sessionId: string | undefined): Promise<string | null> {
  if (!sessionId || !stripeConfigured()) return null;
  try {
    const s = await getStripe().checkout.sessions.retrieve(sessionId);
    for (const f of s.custom_fields ?? []) if (f.key === "github_username") return f.text?.value ?? null;
  } catch {
    // A missing or foreign session id must not break the page — the buyer has
    // already paid, and their next step does not depend on this line.
  }
  return null;
}

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const account = await namedAccount((await searchParams).session_id);

  return (
    <div>
      <section className="grid-paper border-b-2 border-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
          <div className="label text-accent mb-3">/ Courses — Bridge agent — access</div>
          <h1 className="display text-[clamp(2.2rem,7vw,5rem)] uppercase max-w-4xl">You&apos;re in</h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-ink-soft">
            {account ? (
              <>
                An invitation to <code>{COURSE_PRODUCT.repo.owner}/{COURSE_PRODUCT.repo.name}</code> is on its
                way to <strong>{account}</strong>. GitHub emails it, and it also waits for you at{" "}
                <a className="text-accent underline underline-offset-2" href="https://github.com/notifications">
                  github.com/notifications
                </a>
                .
              </>
            ) : (
              <>
                An invitation to <code>{COURSE_PRODUCT.repo.owner}/{COURSE_PRODUCT.repo.name}</code> is on its
                way to the GitHub account you named at checkout.
              </>
            )}
          </p>
          {stripeIsTestMode() && (
            <p className="mt-4 inline-block bg-lime text-ink label px-3 py-1.5 border-2 border-ink">
              test mode — no money moved
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-paper hard-border p-7 sm:p-9">
            <div className="label text-ink/40 mb-4">Once you accept</div>
            <ol className="space-y-4 text-sm text-ink-soft">
              <li className="flex gap-3">
                <span className="label text-accent shrink-0">01</span>
                <span>
                  <strong className="text-ink">Take your own copy.</strong> The repository is a template, so
                  one click gives you a repository of your own rather than a fork tied to mine.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="label text-accent shrink-0">02</span>
                <span>
                  <strong className="text-ink">Or clone it</strong> — <code>git clone {REPO_URL}.git</code> —
                  if you would rather read it before you build on it.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="label text-accent shrink-0">03</span>
                <span>
                  <strong className="text-ink">Start with the sandbox.</strong>{" "}
                  <code>course/01-capture.md</code> builds a synthetic screen and writes down its own
                  answers, so nothing you measure later is an impression.
                </span>
              </li>
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={REPO_COPY_URL}
                className="group inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 font-bold hard-shadow-sm hover:bg-accent transition-colors"
              >
                <Github className="w-5 h-5" />
                Copy the repository
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <Link
                href={`${BASE}/start`}
                className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 font-bold hard-border hover-shadow transition-all"
              >
                Read the course
              </Link>
            </div>
          </div>

          <div className="bg-paper-alt hard-border p-7 sm:p-9">
            <div className="label text-ink/40 mb-4">If the invitation does not arrive</div>
            <p className="text-sm text-ink-soft leading-relaxed">
              It happens: a username typed with a typo goes to an account that is not yours, and GitHub
              will not say so. Email <strong>3tdream@gmail.com</strong> with the address you paid from and
              the username you meant, and I will move it by hand.
            </p>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              Your receipt comes from Stripe. Access is one payment and stays yours, including every later
              fix pushed to that repository.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
