import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useNgekostAuth } from "@/lib/NgekostAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, CalendarCheck, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useNgekostAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLink = "text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 font-medium";
  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-white border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center shadow-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3" />
              </svg>
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">
              Ngekost<span className="text-teal">.id</span>
            </span>
          </Link>

          {/* Desktop Right (Nav + Auth) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Desktop Nav */}
            <nav className="flex items-center gap-6">
              <Link
                to="/kost"
                className={`text-sm font-medium transition-colors ${isActive("/kost") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Cari Kost
              </Link>
              {isAuthenticated && (
                <Link
                  to="/bookings"
                  className={`text-sm font-medium transition-colors ${isActive("/bookings") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Pesanan
                </Link>
              )}
            </nav>

            <div className="w-px h-4 bg-border"></div>

            {/* Desktop Auth */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full pl-2 pr-3 py-1.5 border border-transparent hover:bg-secondary">
                      <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-foreground shadow-sm">
                        {(user?.first_name || user?.username || "U")[0].toUpperCase()}
                      </div>
                      <span className="max-w-[120px] truncate">{user?.first_name || user?.username}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-1">
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer rounded-sm">
                      <User className="w-4 h-4 mr-2" /> Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/bookings")} className="cursor-pointer rounded-sm">
                      <CalendarCheck className="w-4 h-4 mr-2" /> Pesanan Saya
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer rounded-sm">
                      <LogOut className="w-4 h-4 mr-2" /> Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg shadow-sm hover:bg-foreground/90 transition-colors"
                  >
                    Daftar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-5 py-4 space-y-1">
          <Link to="/kost" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-foreground">
            Cari Kost
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/bookings" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Pesanan Saya
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Profil
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="block w-full text-left py-2 text-sm font-medium text-destructive"
              >
                Keluar
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { navigate("/login"); setMobileOpen(false); }}
                className="flex-1 text-sm font-medium text-foreground border border-border py-2 rounded-md hover:bg-secondary transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => { navigate("/register"); setMobileOpen(false); }}
                className="flex-1 text-sm font-medium bg-foreground text-background py-2 rounded-md hover:bg-foreground/90 transition-colors"
              >
                Daftar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
