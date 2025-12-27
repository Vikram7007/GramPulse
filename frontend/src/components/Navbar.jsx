import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { notifySuccess } from './NotificationToast';
import { 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Globe, 
  Menu, 
  X, 
  ChevronDown,
  Settings,
  Home,
  MessageSquare,
  Shield,
  Sparkles
} from 'lucide-react';

function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const changeLanguage = (lng, label) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
    notifySuccess(`भाषा बदलली: ${label}`);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    notifySuccess('यशस्वीरित्या लॉगआऊट झाला! 👋');
    navigate('/');
  };

  const languages = [
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-20">
            
            {/* Left - App Name & Logo */}
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-xl p-3 rounded-2xl border-2 border-white/30 group-hover:border-white/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Home className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                  <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                    {t('appName')}
                  </span>
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </h1>
                <p className="text-green-100 text-xs font-medium tracking-wide">आपल्या गावाची आवाज</p>
              </div>
            </div>

            {/* Right - Desktop Controls */}
            <div className="hidden md:flex items-center gap-4">

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-xl rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Globe className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-semibold text-sm">{currentLang.flag} {currentLang.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown Menu */}
                {showLangMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-green-200 overflow-hidden animate-slideDown">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code, lang.label)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-all duration-200 ${
                          i18n.language === lang.code ? 'bg-green-100 font-bold' : ''
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="text-green-900 font-medium">{lang.label}</span>
                        {i18n.language === lang.code && <Sparkles className="w-4 h-4 text-green-600 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <button className="relative group p-3 bg-white/10 backdrop-blur-xl rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <Bell className="w-6 h-6 text-white group-hover:animate-wiggle" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                  3
                </span>
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="relative group p-3 bg-white/10 backdrop-blur-xl rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 hover:scale-110 overflow-hidden"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                <div className="relative z-10">
                  {darkMode ? (
                    <Sun className="w-6 h-6 text-yellow-300 group-hover:rotate-180 transition-transform duration-500" />
                  ) : (
                    <Moon className="w-6 h-6 text-white group-hover:-rotate-12 transition-transform duration-500" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* User Profile Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="group flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-xl rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-white to-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center text-lg font-black shadow-lg border-2 border-white/50 group-hover:scale-110 transition-transform duration-300">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs text-green-100 font-medium">स्वागत आहे</p>
                      <p className="font-bold text-sm text-white">{user.name}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-green-200 overflow-hidden animate-slideDown">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 backdrop-blur-xl rounded-full w-12 h-12 flex items-center justify-center text-2xl font-black border-2 border-white/50">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{user.name}</p>
                            <p className="text-xs text-green-100">{user.email || 'user@example.com'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/profile');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 text-green-900"
                        >
                          <User className="w-5 h-5 text-green-600" />
                          <span className="font-medium">माझे प्रोफाईल</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/settings');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 text-green-900"
                        >
                          <Settings className="w-5 h-5 text-green-600" />
                          <span className="font-medium">सेटिंग्ज</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/my-complaints');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 text-green-900"
                        >
                          <MessageSquare className="w-5 h-5 text-green-600" />
                          <span className="font-medium">माझ्या तक्रारी</span>
                        </button>
                        
                        <div className="h-px bg-green-200 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 text-red-600 font-bold"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>लॉगआऊट</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="group relative px-6 py-3 bg-white text-green-700 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    लॉगिन करा
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-white/10 backdrop-blur-xl rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white rounded-b-3xl shadow-2xl p-6 animate-slideDown" onClick={(e) => e.stopPropagation()}>
            {user && (
              <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-black shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">स्वागत आहे</p>
                  <p className="font-bold text-lg text-green-900">{user.name}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code, lang.label);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    i18n.language === lang.code ? 'bg-green-100 font-bold' : 'hover:bg-green-50'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-green-900 font-medium">{lang.label}</span>
                </button>
              ))}
            </div>

            <div className="h-px bg-green-200 my-4"></div>

            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 text-green-900 mb-2"
                >
                  <User className="w-5 h-5 text-green-600" />
                  <span className="font-medium">माझे प्रोफाईल</span>
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 text-red-600 font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>लॉगआऊट</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg"
              >
                <Shield className="w-5 h-5" />
                लॉगिन करा
              </button>
            )}
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
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

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-wiggle:hover {
          animation: wiggle 0.5s ease-in-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}

export default Navbar;