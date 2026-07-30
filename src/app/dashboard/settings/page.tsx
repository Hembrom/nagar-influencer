"use client";

import { PageFrame } from "@/components/dashboard/PageFrame";

export default function SettingsPage() {
  return (
    <PageFrame
      title="Settings"
      subtitle="Brand profile, notifications, and billing preferences"
    >
      <div className="mx-auto grid max-w-3xl gap-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold tracking-wide text-muted-light uppercase">
            Brand profile
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-navy">
                Company name
              </span>
              <input
                defaultValue="Acme Tech"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-purple"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-navy">
                Website
              </span>
              <input
                defaultValue="https://acme.example"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-purple"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-semibold text-navy">
                Primary contact phone
              </span>
              <input
                defaultValue="+91 98765 43210"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-purple"
              />
            </label>
          </div>
          <button
            type="button"
            className="mt-5 rounded-xl bg-purple-deep px-4 py-2.5 text-sm font-bold text-white"
          >
            Save changes
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold tracking-wide text-muted-light uppercase">
            Notifications
          </h2>
          <div className="mt-4 space-y-3">
            {[
              "Email me when a strategist is assigned",
              "Email me on campaign status changes",
              "Weekly summary of active campaigns",
            ].map((label) => (
              <label
                key={label}
                className="flex items-center gap-3 text-sm text-navy"
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border accent-purple"
                />
                {label}
              </label>
            ))}
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
