import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 md:py-14">

        {/* Main Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3" />
                </svg>
              </div>
              <span className="text-sm font-bold text-foreground tracking-tight">
                Ngekost<span className="text-teal">.id</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Marketplace kost terpercaya di Banyumas dan sekitarnya. Temukan hunian terbaik untuk kenyamanan Anda.
            </p>
          </div>

          {/* Nav Columns */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-8 text-sm">
            <div>
              <p className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-3">Navigasi</p>
              <ul className="space-y-2.5">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Beranda</Link></li>
                <li><Link to="/kost" className="text-muted-foreground hover:text-foreground transition-colors">Cari</Link></li>
                <li><Link to="/bookings" className="text-muted-foreground hover:text-foreground transition-colors">Pesanan</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-3">Akun</p>
              <ul className="space-y-2.5">
                <li><Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">Registrasi</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Ngekost.id. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Banyumas, Jawa Tengah</span>
            <span className="w-1 h-1 rounded-full bg-border inline-block" />
            <a href="mailto:info@ngekost.my.id" className="hover:text-foreground transition-colors">
              info@ngekost.my.id
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
