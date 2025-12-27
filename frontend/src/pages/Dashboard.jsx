import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifyError } from '../components/NotificationToast';
import SubmitIssue from './SubmitIssue';

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [activeTab, setActiveTab] = useState('all');

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

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const res = await api.get('/issues');
        const fetchedIssues = res.data.issues || [];
        setAllIssues(fetchedIssues);
        setIssues(fetchedIssues);
      } catch (err) {
        console.error('Fetch issues error:', err);
        notifyError('समस्या लोड करताना त्रुटी');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

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

  const stats = {
    all: issues.length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    completed: issues.filter(i => i.status === 'approved').length,
    issue: issues.filter(i => i.status === 'rejected').length
  };

  const displayedIssues = activeTab === 'all' 
    ? issues 
    : issues.filter(issue => {
        if (activeTab === 'inProgress') return issue.status === 'in-progress';
        if (activeTab === 'approved') return issue.status === 'approved';
        if (activeTab === 'rejected') return issue.status === 'rejected';
        return true;
      });

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="pt-28 pb-32 pl-0 md:pl-64 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10" style={{ paddingLeft: "240px" }}>

          <div className="max-w-7xl mx-auto mb-16 text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-20 blur-2xl rounded-full animate-pulse"></div>
              <h1 className="relative text-5xl sm:text-6xl md:text-7xl font-black mb-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight leading-tight filter drop-shadow-lg">
                गावातील समस्या
              </h1>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-green-400 to-green-500 rounded-full shadow-lg"></div>
                <div className="h-2 w-32 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full shadow-xl"></div>
                <div className="h-1 w-20 bg-gradient-to-r from-teal-500 via-teal-400 to-transparent rounded-full shadow-lg"></div>
              </div>
            </div>
            <p className="text-xl sm:text-2xl text-gray-700 font-semibold max-w-3xl mx-auto leading-relaxed tracking-wide">
              आपल्या गावाच्या विकासासाठी आवाज उठवा
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-14 px-4">
            <label className="block text-lg font-bold text-gray-800 mb-4 text-center tracking-wide">
              📅 आठवडा निवडा
            </label>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl opacity-30 group-hover:opacity-50 blur-xl transition-all duration-500"></div>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="relative w-full px-6 py-5 bg-white/90 backdrop-blur-md border-3 border-green-300 rounded-2xl text-lg font-bold text-gray-800 shadow-xl hover:shadow-2xl focus:shadow-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 cursor-pointer appearance-none hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1.5rem center',
                  backgroundSize: '2em 2em',
                  paddingRight: '4rem'
                }}
              >
                {weekOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="py-3 font-semibold">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mb-16 px-4">
            <div className="relative bg-gradient-to-br from-white/80 to-green-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-green-200/50">
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-green-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative flex flex-wrap justify-center gap-5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`relative px-12 py-5 rounded-2xl font-extrabold text-lg tracking-wide transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-400/60'
                      : 'bg-white/90 text-green-700 hover:bg-green-100 border-3 border-green-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {activeTab === 'all' && (
                    <div className="absolute inset-0 rounded-2xl bg-white/30 animate-ping"></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    📋 सर्व <span className="text-2xl">({stats.all})</span>
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('inProgress')}
                  className={`relative px-12 py-5 rounded-2xl font-extrabold text-lg tracking-wide transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    activeTab === 'inProgress'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-400/60'
                      : 'bg-white/90 text-blue-700 hover:bg-blue-100 border-3 border-blue-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {activeTab === 'inProgress' && (
                    <div className="absolute inset-0 rounded-2xl bg-white/30 animate-ping"></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    ⏳ प्रगतीत <span className="text-2xl">({stats.inProgress})</span>
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`relative px-12 py-5 rounded-2xl font-extrabold text-lg tracking-wide transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    activeTab === 'approved'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-400/60'
                      : 'bg-white/90 text-emerald-700 hover:bg-emerald-100 border-3 border-emerald-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {activeTab === 'approved' && (
                    <div className="absolute inset-0 rounded-2xl bg-white/30 animate-ping"></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    ✅ पूर्ण <span className="text-2xl">({stats.completed})</span>
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`relative px-12 py-5 rounded-2xl font-extrabold text-lg tracking-wide transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    activeTab === 'rejected'
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl shadow-red-400/60'
                      : 'bg-white/90 text-red-700 hover:bg-red-100 border-3 border-red-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {activeTab === 'rejected' && (
                    <div className="absolute inset-0 rounded-2xl bg-white/30 animate-ping"></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    ⚠️ अडचण <span className="text-2xl">({stats.issue})</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-32">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-40 blur-3xl animate-pulse"></div>
                <div className="relative">
                  <div className="animate-spin rounded-full h-28 w-28 border-8 border-gray-200 border-t-green-500 border-r-emerald-500 shadow-2xl"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-teal-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
              </div>
              <p className="mt-12 text-gray-700 text-2xl font-bold animate-pulse tracking-wide">समस्या लोड होत आहेत...</p>
            </div>
          ) : displayedIssues.length === 0 ? (
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-gradient-to-br from-white via-green-50/50 to-emerald-50/50 backdrop-blur-xl rounded-3xl shadow-2xl border-3 border-green-200 p-20 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-teal-300/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                
                <div className="relative inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 mb-10 shadow-2xl border-4 border-white">
                  <div className="text-8xl animate-bounce">😔</div>
                </div>
                <p className="text-4xl font-black text-gray-800 mb-5 tracking-tight leading-tight">या श्रेणीमध्ये कोणतीही समस्या नाही</p>
                <p className="text-xl text-gray-600 leading-relaxed font-semibold">नवीन समस्या नोंदवा आणि गावाला मदत करा!</p>
                <div className="mt-10 h-2 w-40 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full mx-auto shadow-xl"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto px-2">
              {displayedIssues.map((issue, index) => (
                <div
                  key={issue._id}
                  className="group"
                  style={{
                    animation: `cardFloat 0.8s ease-out ${index * 0.15}s both`
                  }}
                >
                  <div className="absolute -inset-3 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-3xl opacity-0 group-hover:opacity-50 blur-2xl transition-all duration-500"></div>
                  
                  <Link to={`/issue-details/${issue._id}`} className="relative block">
                    <div className="relative overflow-hidden rounded-3xl shadow-xl group-hover:shadow-3xl transition-all duration-500 bg-white/95 backdrop-blur-sm border-3 border-green-200 group-hover:border-green-400 transform group-hover:-translate-y-3 group-hover:scale-105">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-300/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                      
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

          <Link to="/submit">
            <button
              className="group fixed bottom-8 right-8 w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-green-400/80 flex items-center justify-center text-5xl font-light transition-all duration-500 hover:scale-125 hover:rotate-180 z-50 border-4 border-white backdrop-blur-sm"
              aria-label="Add new issue"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-300 to-teal-300 opacity-0 group-hover:opacity-70 blur-3xl transition-opacity duration-500 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              
              <span className="relative z-10 font-thin">+</span>
              
              <div className="absolute inset-0 rounded-full border-4 border-white/60 scale-100 group-hover:scale-[2] opacity-100 group-hover:opacity-0 transition-all duration-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-white/40 scale-100 group-hover:scale-[2.5] opacity-100 group-hover:opacity-0 transition-all duration-1000"></div>
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes cardFloat {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9) rotateX(10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
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

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </>
  );
}

export default Dashboard;