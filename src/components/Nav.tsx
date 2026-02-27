"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/platform", label: "PLATFORM" },
    { href: "/world-cup-2026", label: "FIFA 2026" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-light tracking-widest text-white">
            KAI
          </Link>
          <div className="flex items-center gap-8">
            {links.map(({ href, label }) => {
              const isContact = href === "/contact";
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    isContact
                      ? "text-sm font-light tracking-wide border border-white px-6 py-2 text-white hover:bg-white hover:text-black transition"
                      : `text-sm font-light tracking-wide transition ${
                          isActive ? "text-white border-b border-[#FF6B35] pb-0.5" : "text-white/60 hover:text-white"
                        }`
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
