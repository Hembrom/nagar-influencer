import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-muted">
      <div className="mx-auto max-w-6xl px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid gap-8 md:grid-cols-5 mb-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple text-xs font-bold text-white">
                NI
              </div>
              <span className="font-bold text-foreground">NagarInfluence</span>
            </div>
            <p className="text-sm text-muted">
              Connect verified brands with creators for authentic campaigns.
            </p>
          </div>

          {/* For Brands */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Brands</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/influencers" className="hover:text-foreground transition">
                  Browse creators
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Success stories
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Creators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/influencers" className="hover:text-foreground transition">
                  Creator guidelines
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Payment terms
                </Link>
              </li>
              <li>
                <Link href="/influencers" className="hover:text-foreground transition">
                  Apply as creator
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:hello@nagarinfluence.com" className="hover:text-foreground transition">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted text-center">
            © 2026 NagarInfluence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
