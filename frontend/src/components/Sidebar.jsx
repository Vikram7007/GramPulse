import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed left-4 top-20 z-50 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-3 rounded-xl shadow-2xl hover:shadow-green-400/50 transition-all duration-300 hover:scale-110 active:scale-95 border border-white/30 backdrop-blur-sm"
        aria-label="Toggle Sidebar"
      >
        <span className="text-xl font-bold">☰</span>
      </button>

      <div
        className={`bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white w-56 min-h-screen fixed left-0 top-16 z-40 transform transition-all duration-500 ease-in-out shadow-2xl
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] pointer-events-none"></div>
        
        <div className="relative p-5 space-y-2">
          <div className="mb-6 pb-4 border-b border-white/20">
            <h2 className="text-xl font-black text-white tracking-wider drop-shadow-lg animate-fade-in">मेनू</h2>
            <div className="mt-2 h-0.5 w-12 bg-gradient-to-r from-white via-white/60 to-transparent rounded-full animate-slide-in"></div>
          </div>

          <ul className="space-y-2">
            <li className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <Link
                to="/dashboard"
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isActive("/dashboard")
                    ? "bg-white/95 text-green-700 shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 hover:scale-[1.02] hover:translate-x-1"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive("/dashboard") ? "opacity-100" : ""}`}></div>
                <span className="text-2xl relative z-10 transform group-hover:rotate-12 transition-transform duration-300">🏠</span>
                <span className="text-sm font-bold relative z-10 tracking-wide">{t("dashboard")}</span>
                {isActive("/dashboard") && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            </li>

            <li className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/submit"
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isActive("/submit")
                    ? "bg-white/95 text-green-700 shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 hover:scale-[1.02] hover:translate-x-1"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive("/submit") ? "opacity-100" : ""}`}></div>
                <span className="text-2xl relative z-10 transform group-hover:rotate-90 transition-transform duration-300">➕</span>
                <span className="text-sm font-bold relative z-10 tracking-wide">{t("newIssue")}</span>
                {isActive("/submit") && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            </li>

            <li className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/admin"
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isActive("/admin")
                    ? "bg-white/95 text-green-700 shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 hover:scale-[1.02] hover:translate-x-1"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive("/admin") ? "opacity-100" : ""}`}></div>
                <span className="text-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">👨‍💼</span>
                <span className="text-sm font-bold relative z-10 tracking-wide">{t("adminDashboard")}</span>
                {isActive("/admin") && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            </li>

            <li className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/public"
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isActive("/public")
                    ? "bg-white/95 text-green-700 shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 hover:scale-[1.02] hover:translate-x-1"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive("/public") ? "opacity-100" : ""}`}></div>
                <span className="text-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">📊</span>
                <span className="text-sm font-bold relative z-10 tracking-wide">{t("publicDashboard")}</span>
                {isActive("/public") && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            </li>

            <li className="animate-slide-in" style={{ animationDelay: '0.5s' }}>
              <Link
                to="/VillageAdminDashboard"
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isActive("/VillageAdminDashboard")
                    ? "bg-white/95 text-green-700 shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 hover:scale-[1.02] hover:translate-x-1"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive("/VillageAdminDashboard") ? "opacity-100" : ""}`}></div>
                <span className="text-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">🏛️</span>
                <span className="text-sm font-bold relative z-10 tracking-wide">{t("VillageAdminDashboard")}</span>
                {isActive("/VillageAdminDashboard") && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            </li>
          </ul>

          <div className="absolute bottom-6 left-5 right-5">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out backwards;
        }
      `}</style>
    </>
  );
}

export default Sidebar;