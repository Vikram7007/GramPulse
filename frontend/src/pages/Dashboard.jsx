import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifyError } from '../components/NotificationToast';
import SubmitIssue from './SubmitIssue';





function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]); // सगळे issues save ठेव
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('current');

  // Generate week options (last 8 weeks)
  const getWeekOptions = () => {
    const options = [{ value: 'current', label: 'सध्याचा आठवडा' }];
    const today = new Date();
    for (let i = 1; i <= 8; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const label = `आठवडा ${i} (${weekStart.toLocaleDateString('mr-IN')} - ${weekEnd.toLocaleDateString('mr-IN')})`;
      options.push({ value: i, label });
    }
    return options;
  };

  const weekOptions = getWeekOptions();

  // Fetch all issues once
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const res = await api.get('/issues');
        const fetchedIssues = res.data.issues || [];
        setAllIssues(fetchedIssues);
        setIssues(fetchedIssues); // initial all
      } catch (err) {
        console.error('Fetch issues error:', err);
        notifyError('समस्या लोड करताना त्रुटी');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Filter issues when week changes
  useEffect(() => {
    if (allIssues.length === 0) return;

    if (selectedWeek === 'current') {
      setIssues(allIssues);
      return;
    }

    const weekOffset = Number(selectedWeek);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const filtered = allIssues.filter(issue => {
      const created = new Date(issue.createdAt);
      return created >= startOfWeek && created <= endOfWeek;
    });

    setIssues(filtered);
  }, [selectedWeek, allIssues]);

  return (
    <>
      <Navbar />
      <Sidebar />

      {/* ✨ ENHANCED: Main container with premium gradient background and improved spacing */}
      <div className="pt-28 pb-32 pl-0 md:pl-64 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 relative overflow-hidden">
        
        {/* ✨ ENHANCED: Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(20,184,166,0.05),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10" style={{ paddingLeft: "240px" }}>

          {/* ✨ ENHANCED: Premium header with improved typography and animations */}
          <div className="max-w-7xl mx-auto mb-12 text-center">
            <div className="inline-block mb-6">
              <h1 className="text-4xl  sm:text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent tracking-tight leading-tight animate-[fadeIn_0.8s_ease-out]">
                गावातील समस्या
              </h1>
              {/* ✨ ENHANCED: Elegant decorative line with gradient */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-emerald-400 rounded-full"></div>
                <div className="w-20 h-[3px] bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-full shadow-sm"></div>
                <div className="w-12 h-[2px] bg-gradient-to-r from-teal-400 via-teal-400/50 to-transparent rounded-full"></div>
              </div>
            </div>
            {/* ✨ ENHANCED: Improved subtitle with better contrast */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed animate-[fadeIn_1s_ease-out]">
              आपल्या गावाच्या विकासासाठी आवाज उठवा
            </p>
          </div>

          {/* ✨ ENHANCED: Premium dropdown with glass morphism effect */}
          <div className="max-w-xl mx-auto mb-14 px-4">
            <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-3 text-center tracking-wide">
              आठवडा निवडा
            </label>
            <div className="relative group">
              {/* ✨ ENHANCED: Glow effect on focus */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-0 group-focus-within:opacity-20 blur-lg transition-all duration-500"></div>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="relative w-full p-4 sm:p-5 border-2 border-emerald-200/60 rounded-xl sm:rounded-2xl text-base sm:text-lg font-medium text-gray-700 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-lg hover:border-emerald-300 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '3rem'
                }}
              >
                {weekOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="py-2">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ✨ ENHANCED: Premium loading state with smooth animation */}
          {loading ? (
            <div className="text-center py-24 sm:py-32">
              <div className="relative inline-block">
                {/* ✨ ENHANCED: Multi-layered spinner with glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 blur-xl animate-pulse"></div>
                <div className="relative animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-gray-200">
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-green-500"></div>
                </div>
              </div>
              <p className="mt-8 text-gray-600 text-lg sm:text-xl font-medium animate-pulse">समस्या लोड होत आहेत...</p>
            </div>
          ) : issues.length === 0 ? (
            /* ✨ ENHANCED: Premium empty state with card design */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100/50 p-12 sm:p-16 text-center transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                {/* ✨ ENHANCED: Animated emoji with gradient background */}
                <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 mb-6 shadow-inner">
                  <div className="text-5xl sm:text-6xl animate-[bounce_2s_ease-in-out_infinite]">😔</div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 tracking-tight">या आठवड्यात कोणतीही समस्या नाही</p>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">नवीन समस्या नोंदवा आणि गावाला मदत करा!</p>
                {/* ✨ ENHANCED: Decorative line */}
                <div className="mt-6 w-24 h-1 bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 rounded-full mx-auto"></div>
              </div>
            </div>
          ) : (
            /* ✨ ENHANCED: Premium issues grid with staggered animation */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto px-2">
              {issues.map((issue, index) => (
                <div
                  key={issue._id}
                  className="group transform transition-all duration-500 hover:scale-[1.03] hover:z-20"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* ✨ ENHANCED: Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 group-hover:duration-300"></div>
                  
                  <Link to={`/issue-details/${issue._id}`} className="relative block">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border border-emerald-100/50 group-hover:border-emerald-200">
                      <IssueCard
                        issue={{
                          _id: issue._id,
                          title: issue.type || 'अज्ञात समस्या',
                          description: issue.description,
                          votes: issue.votes?.length || 0,
                          status: issue.status || 'pending',
                          images: issue.images || [],
                          createdAt: issue.createdAt,
                          mapImage: issue.images?.find(img => img.includes('map-screenshot')) || null
                        }}
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* ✨ ENHANCED: Premium floating action button with advanced effects */}
          <Link to="/submit">
            <button
              className="group fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-emerald-400/60 flex items-center justify-center text-3xl sm:text-4xl font-light transition-all duration-500 hover:scale-110 hover:rotate-90 z-50 border-4 border-white/20"
              aria-label="Add new issue"
            >
              {/* ✨ ENHANCED: Multi-layer glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-500 animate-pulse group-hover:animate-none"></div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <span className="relative z-10 transition-transform duration-300 group-hover:rotate-0 font-extralight">+</span>
              
              {/* ✨ ENHANCED: Ripple effect on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-white/40 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-700"></div>
            </button>
          </Link>
        </div>
      </div>

      {/* ✨ ENHANCED: Custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default Dashboard;