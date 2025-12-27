import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Home, 
  PlusCircle, 
  Shield, 
  BarChart3, 
  Building2, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Users,
  Bell,
  Settings,
  HelpCircle,
  Star
} from "lucide-react";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: t("dashboard"),
      color: "from-blue-500 to-cyan-500",
      hoverColor: "hover:from-blue-600 hover:to-cyan-600",
      emoji: "🏠"
    },
    {
      path: "/submit",
      icon: PlusCircle,
      label: t("newIssue"),
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
      emoji: "➕"
    },
    {
      path: "/admin",
      icon: Shield,
      label: t("adminDashboard"),
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
      emoji: "👨‍💼"
    },
    {
      path: "/public",
      icon: BarChart3,
      label: t("publicDashboard"),
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600",
      emoji: "📊"
    },
    {
      path: "/VillageAdminDashboard",
      icon: Building2,
      label: t("VillageAdminDashboard"),
      color: "from-teal-500 to-green-500",
      hoverColor: "hover:from-teal-600 hover:to-green-600",
      emoji: "🏛️"
    }
  ];

  const quickActions = [
    { icon: Bell, label: "सूचना", count: 5 },
    { icon: Settings, label: "सेटिंग्ज" },
    { icon: HelpCircle, label: "मदत" }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed left-4 top-20 z-[60] group" /* navbar z-50 पेक्षा वर ठेवला */
        aria-label="Toggle Sidebar"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Button */}
          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-2xl border-2 border-white/30 backdrop-blur-sm transform group-hover:scale-110 group-active:scale-95 transition-all duration-300">
            {open ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </div>
        </div>
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] top-16 animate-fadeIn" /* navbar खाली */
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white w-72 min-h-screen fixed left-0 top-16 z-[40] transform transition-all duration-500 ease-in-out shadow-2xl border-r-4 border-white/20
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`} /* z-index कमी केला: z-[40] → navbar (z-50) च्या खाली */
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] animate-shimmer pointer-events-none"></div>

        <div className="relative p-6 space-y-6 h-full flex flex-col">
          {/* Header Section */}
          <div className="mb-4 animate-fadeInDown">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide drop-shadow-lg">
                मेनू
              </h2>
            </div>
            <div className="h-1 bg-gradient-to-r from-white via-white/60 to-transparent rounded-full shadow-lg animate-expandWidth"></div>
            <p className="text-xs text-green-100 mt-2 font-medium">आपले डॅशबोर्ड निवडा</p>
          </div>

          {/* Main Menu Items */}
          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <div
                  key={item.path}
                  className="animate-slideInLeft"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link
                    to={item.path}
                    className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden ${
                      active
                        ? "bg-white/95 text-green-700 shadow-2xl scale-[1.02]"
                        : "hover:bg-white/10 hover:scale-[1.02] hover:translate-x-1"
                    }`}
                  >
                    {/* Gradient background for active state */}
                    {active && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10`}></div>
                    )}
                    
                    {/* Hover gradient effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Icon Container */}
                    <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
                      active 
                        ? `bg-gradient-to-br ${item.color} shadow-lg` 
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-white group-hover:scale-110'} transition-transform duration-300`} />
                    </div>
                    
                    {/* Label */}
                    <span className={`text-sm font-bold relative z-10 tracking-wide flex-1 ${
                      active ? 'text-green-700' : 'text-white'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Arrow indicator for active */}
                    {active && (
                      <ChevronRight className="w-5 h-5 text-green-600 animate-bounceX" />
                    )}
                    
                    {/* Pulse dot for active */}
                    {active && (
                      <div className="absolute right-2 top-2">
                        <div className="relative">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Emoji overlay on hover */}
                    <div className="absolute right-4 text-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                      {item.emoji}
                    </div>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Quick Actions Section */}
          <div className="space-y-3 pt-4 border-t border-white/20 animate-fadeInUp">
            <p className="text-xs font-bold text-green-100 uppercase tracking-wider px-2">द्रुत क्रिया</p>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={index}
                    className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20 hover:border-white/40"
                  >
                    {action.count && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                        {action.count}
                      </span>
                    )}
                    <ActionIcon className="w-5 h-5 text-white mx-auto mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-[10px] font-medium text-white text-center">{action.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Stats Card */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl animate-fadeInUp">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50"></div>
                <Star className="relative w-6 h-6 text-yellow-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-100 font-medium">तुमचे योगदान</p>
                <p className="text-lg font-black text-white">156 पॉइंट्स</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-expandWidth" style={{ width: '65%' }}></div>
              </div>
              <span className="text-xs font-bold text-green-100">65%</span>
            </div>
          </div>

          {/* Footer Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 via-black/20 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-200%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes bounceX {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out backwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-expandWidth {
          animation: expandWidth 1s ease-out;
        }

        .animate-bounceX {
          animation: bounceX 1s infinite;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
}

export default Sidebar;