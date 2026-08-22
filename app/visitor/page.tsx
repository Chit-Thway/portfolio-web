/* eslint-disable @next/next/no-html-link-for-pages -- standard navigation avoids the static-hosting prefetch runtime */
import type { Metadata } from "next";
import { VisitorDashboard } from "@/app/components/VisitorDashboard";

export const metadata: Metadata = {
  title: "Visitor Department | CHIT THWAY",
  description: "An unlisted weekly visitor counter for the CHIT THWAY portfolio.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
};

export default function VisitorPage() {
  return (
    <main className="visitor-page">
      <div className="visitor-shell">
        <header className="visitor-header">
          <a href="/" className="visitor-return">
            <span aria-hidden="true">←</span> Return to portfolio
          </a>
          <span>UNLISTED / 07</span>
        </header>

        <section className="visitor-introduction">
          <p className="eyebrow">Secret department located</p>
          <h1>You found the visitor department.</h1>
          <p>
            Thanks for visiting the site—and for being curious enough to look behind an
            unmarked door.
          </p>
        </section>

        <VisitorDashboard />

        <aside className="visitor-privacy-note">
          <span aria-hidden="true">◎</span>
          <div>
            <strong>Small counter, small footprint.</strong>
            <p>
              No names, accounts or raw IP addresses are stored. This page only receives
              aggregate weekly totals.
            </p>
          </div>
        </aside>

        <footer className="visitor-footer">
          <span>CHIT THWAY / PORTFOLIO</span>
          <span>PERTH, WESTERN AUSTRALIA</span>
        </footer>
      </div>
    </main>
  );
}
