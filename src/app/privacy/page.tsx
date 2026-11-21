export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-wider text-purple">Legal</p>
      <h1 className="mt-3 text-4xl font-extrabold text-navy">Privacy Policy</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-muted">
        <p>
          Grow My Influence collects only the information needed to create accounts,
          verify profiles, manage campaigns, and provide support.
        </p>
        <p>
          We use account, profile, social-link, and campaign information to operate
          the platform. We do not sell personal information. Access is limited to
          people and systems that need it to provide the service or meet legal obligations.
        </p>
        <p>
          You may request an account or data review by contacting
          {" "}<a className="font-semibold text-purple" href="mailto:hello@growmyinfluence.com">hello@growmyinfluence.com</a>.
        </p>
        <p className="text-sm">Last updated: November 21, 2026</p>
      </div>
    </main>
  );
}
