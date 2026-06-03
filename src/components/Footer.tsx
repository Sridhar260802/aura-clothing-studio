import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 overflow-hidden rounded-full">
                <Image src="/logo.jpeg" alt="Aura" fill className="object-cover" />
              </div>
              <span className="font-display text-2xl tracking-wider">AURA</span>
            </div>
            <p className="font-body text-sm text-white/60 leading-relaxed">
              Premium clothing crafted with passion. Elevating your wardrobe with timeless elegance
              and modern sophistication.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm tracking-widest uppercase mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/products", label: "Shop All" },
                { href: "/products?category=Blazers", label: "Blazers" },
                { href: "/products?category=Shirts", label: "Shirts" },
                { href: "/products?category=Ethnic+Wear", label: "Ethnic Wear" },
                { href: "/track-order", label: "Track Order" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-aura-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm tracking-widest uppercase mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-body text-sm text-white/60">
                <Phone size={14} className="text-aura-400" />
                +91 6374661885
              </li>
              <li className="flex items-center gap-2 font-body text-sm text-white/60">
                <Mail size={14} className="text-aura-400" />
                auratheclothingstudio@gmail.com
              </li>
              <li className="flex items-start gap-2 font-body text-sm text-white/60">
                <MapPin size={14} className="text-aura-400 mt-0.5" />
                India
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-sm tracking-widest uppercase mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/aura_theclothingstudio?igsh=cWNqbnJrYmVwM3Zz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-aura-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
            <p className="font-body text-xs text-white/40 mt-6">
              Free delivery across India
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="font-body text-xs text-white/40">
            &copy; {new Date().getFullYear()} Aura Clothing Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
