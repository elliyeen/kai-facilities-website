"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/platform", label: "Platform" },
  { href: "/world-cup-2026", label: "FIFA 2026" },
  { href: "/#about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-base font-medium tracking-[0.3em]"
              onClick={() => setOpen(false)}
            >
              KAI
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-[13px] transition-colors duration-200 ${
                    pathname === href
                      ? "text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden md:inline-flex text-[13px] border border-white/20 px-5 py-2 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
              >
                Contact
              </Link>
              <button
                className="md:hidden p-1 text-white/70 hover:text-white transition-colors"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col pt-16">
          <div className="flex-1 flex flex-col px-6 pt-8">
            {[...links, { href: "/contact", label: "Contact" }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`text-3xl font-thin py-5 border-b border-white/[0.08] transition-colors ${
                  pathname === href ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
