export default function FAQPage() {
  const faqs = [
    {
      question: "How do creator profiles get verified?",
      answer:
        "We review profile details and linked social accounts to check identity, follower authenticity, and claimed past work. Verification is based on the information available at review time and may be withdrawn if it becomes inaccurate.",
    },
    {
      question: "How are campaign prices set?",
      answer:
        "Businesses and creators agree on scope, deliverables, timeline, and fees before work begins. Pricing is shown clearly during campaign setup; there are no hidden platform fees added after confirmation.",
    },
    {
      question: "How does payment protection work?",
      answer:
        "Campaign value is held or released according to the agreed milestone and approval workflow. Payment status and deliverable requirements remain visible to both parties throughout the campaign.",
    },
    {
      question: "Are there fees for creators or businesses?",
      answer:
        "No creator-commission or platform fee is hidden in your agreement. Any applicable platform or payment-processing charge is disclosed before you confirm a booking.",
    },
  ];

  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-wider text-purple">Support</p>
      <h1 className="mt-3 text-4xl font-extrabold text-navy">Frequently asked questions</h1>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {faqs.map((faq) => (
          <section key={faq.question} className="py-6">
            <h2 className="text-lg font-bold text-navy">{faq.question}</h2>
            <p className="mt-2 leading-relaxed text-muted">{faq.answer}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
