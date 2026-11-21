export default function TermsPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-wider text-purple">Legal</p>
      <h1 className="mt-3 text-4xl font-extrabold text-navy">Terms of Service</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-muted">
        <p>
          By using Grow My Influence, creators and businesses agree to provide accurate
          information, communicate respectfully, and honour confirmed campaign terms.
        </p>
        <p>
          Campaign scope, fees, deliverables, deadlines, and payment milestones must be
          confirmed before work begins. Users are responsible for making sure promotions,
          claims, disclosures, and content comply with applicable rules.
        </p>
        <p>
          Grow My Influence may review or suspend profiles and campaigns involved in
          misleading information, unsafe conduct, fraud, or repeated breaches of agreements.
        </p>
        <p>
          Questions can be sent to{" "}<a className="font-semibold text-purple" href="mailto:hello@growmyinfluence.com">hello@growmyinfluence.com</a>.
        </p>
        <p className="text-sm">Last updated: November 21, 2026</p>
      </div>
    </main>
  );
}
