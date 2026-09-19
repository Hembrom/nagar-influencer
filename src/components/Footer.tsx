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
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
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
              <li className="pt-2 border-t border-border">
                <div className="flex gap-3">
                  <a href="#" className="hover:text-purple transition">
                    Twitter
                  </a>
                  <a href="#" className="hover:text-purple transition">
                    Instagram
                  </a>
                  <a href="#" className="hover:text-purple transition">
                    LinkedIn
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted">
            © 2026 NagarInfluence. All rights reserved.
          </p>
          <p className="text-sm text-muted mt-4 sm:mt-0">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
