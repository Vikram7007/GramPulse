import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { notifySuccess } from './NotificationToast';

function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    notifySuccess('यशस्वीरित्या लॉगआऊट झाला! 👋');
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white p-4 shadow-xl fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left - App Name */}
        <h1 className="text-3xl font-bold tracking-wide">
          {t('appName')}
        </h1>

        {/* Right - Icons & Controls */}
        <div className="flex items-center gap-6 text-lg">

          {/* Language Switcher */}
          <div className="flex bg-white/20 backdrop-blur-sm rounded-full overflow-hidden border border-white/30">
            <button
              onClick={() => changeLanguage('mr')}
              className="px-4 py-2 hover:bg-white/30 transition font-medium"
            >
              मराठी
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              className="px-4 py-2 hover:bg-white/30 transition font-medium"
            >
              हिंदी
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className="px-4 py-2 hover:bg-white/30 transition font-medium"
            >
              EN
            </button>
          </div>

          {/* Notification Bell */}
          <button className="relative hover:scale-110 transition">
            🔔
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="hover:scale-110 transition text-2xl"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Profile & Logout */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm opacity-90">{t('welcome')}</p>
                <p className="font-semibold text-lg">{user.name}</p>
              </div>
              <div className="bg-white text-primary rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition shadow-md"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="bg-white text-primary px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              लॉगिन
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;