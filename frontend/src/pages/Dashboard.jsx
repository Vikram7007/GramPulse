import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifyError } from '../components/NotificationToast';
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  Zap,
  Users,
  Target,
  Award,
  ArrowRight,
  Info,
  Bell,
  Star,
  Heart,
  Eye
} from 'lucide-react';

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

  const displayedIssues =
    activeTab === 'all'
      ? issues
      : issues.filter(issue => {
          if (activeTab === 'inProgress') return issue.status === 'in-progress';
          if (activeTab === 'approved') return issue.status === 'approved';
          if (activeTab === 'rejected') return issue.status === 'rejected';
          return true;
        });

  return (
    <>
      <div>
        <Navbar />
        <Sidebar />

        <div className="relative  ml-10 pt-20 pb-24 pl-0 md:pl-64 min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-400/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10">
            {/* Hero Section */}
            <div className="px-6 py-8 max-w-7xl mx-auto animate-fadeInDown">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-20 blur-2xl rounded-full animate-pulse-slow"></div>
                    
                    <div className="relative flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-xl">
                          <Target className="w-10 h-10 text-white animate-bounce" />
                        </div>
                      </div>
                      
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight animate-slideInLeft">
                        गावातील समस्या
                      </h1>
                      
                      <Sparkles className="w-8 h-8 text-yellow-400 animate-spin-slow" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 animate-fadeInUp animation-delay-300">
                    <TrendingUp className="w-6 h-6 text-green-600 animate-pulse" />
                    <p className="text-lg md:text-xl text-green-700 font-bold">
                      आपल्या गावाच्या विकासासाठी आवाज उठवा
                    </p>
                    <Award className="w-6 h-6 text-yellow-500 animate-bounce" />
                  </div>
                  
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4 shadow-lg animate-fadeInUp animation-delay-500">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500 p-2 rounded-xl">
                        <Info className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                          कसे वापरायचे? <ArrowRight className="w-4 h-4 animate-bounceX" />
                        </h3>
                        <p className="text-sm text-blue-800">
                          <strong>१.</strong> खालील श्रेणी निवडा 
                          <strong> २.</strong> समस्या पहा आणि मत द्या 
                          <strong> ३.</strong> नवीन समस्या नोंदवण्यासाठी <strong className="text-green-600">+ बटण</strong> दाबा
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Week Dropdown */}
                <div className="w-full lg:w-auto lg:min-w-[340px] animate-fadeInRight">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-pulse-slow"></div>
                    
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-green-300 p-5 group-hover:border-green-400 transition-all duration-300">
                      <label className="flex items-center gap-2 text-sm font-black text-green-800 mb-3 uppercase tracking-wide">
                        <Calendar className="w-5 h-5 animate-bounce" />
                        आठवडा निवडा
                        <Filter className="w-5 h-5 animate-pulse" />
                      </label>
                      
                      <div className="relative">
                        <select
                          value={selectedWeek}
                          onChange={(e) => setSelectedWeek(e.target.value)}
                          className="w-full px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 text-green-900 font-bold hover:border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 cursor-pointer appearance-none hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '3.5rem'
                          }}
                        >
                          {weekOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="font-semibold">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none"></div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-green-700 font-semibold">
                          <FileText className="w-3 h-3" />
                          एकूण: <strong className="text-green-900">{stats.all}</strong>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          पूर्ण: <strong className="text-emerald-900">{stats.completed}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="relative bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 border-2 border-green-200/50 overflow-hidden animate-fadeInUp animation-delay-700">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="h-1 w-12 bg-gradient-to-r from-transparent via-green-400 to-green-500 rounded-full"></div>
                  <h2 className="text-lg font-black text-green-800 flex items-center gap-2">
                    <Filter className="w-5 h-5 animate-pulse" />
                    श्रेणी निवडा
                  </h2>
                  <div className="h-1 w-12 bg-gradient-to-r from-green-500 via-green-400 to-transparent rounded-full"></div>
                </div>
                
                <div className="relative flex flex-wrap gap-4">
                  {[
                    ['all', '📋 सर्व', stats.all, 'from-green-500 to-emerald-600', FileText],
                    ['inProgress', '⏳ प्रगतीत', stats.inProgress, 'from-blue-500 to-blue-600', Clock],
                    ['approved', '✅ पूर्ण', stats.completed, 'from-emerald-500 to-emerald-600', CheckCircle],
                    ['rejected', '⚠️ अडचण', stats.issue, 'from-red-500 to-red-600', AlertTriangle],
                  ].map(([key, label, count, gradient, Icon], index) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`group relative flex-1 min-w-[150px] px-6 py-5 rounded-2xl font-black transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden ${
                        activeTab === key
                          ? `bg-gradient-to-r ${gradient} text-white shadow-2xl`
                          : 'bg-white/90 text-green-700 border-2 border-green-300 hover:border-green-400 shadow-lg hover:shadow-xl'
                      }`}
                      style={{
                        animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      {activeTab === key && (
                        <>
                          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-shimmer"></div>
                        </>
                      )}
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Icon className={`w-5 h-5 ${activeTab === key ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
                          <span className="text-base">{label}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-3xl font-black">({count})</span>
                          {activeTab === key && <Star className="w-5 h-5 text-yellow-300 animate-spin-slow" />}
                        </div>
                      </div>
                      
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Issues Grid - Super Stylish Cards */}
            {loading ? (
              <div className="text-center py-32 animate-fadeIn">
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-30 blur-3xl animate-pulse-slow"></div>
                  
                  <div className="relative">
                    <div className="animate-spin rounded-full h-32 w-32 border-8 border-gray-200 border-t-green-500 border-r-emerald-500 shadow-2xl"></div>
                    
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-teal-500 animate-spin-reverse"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-12 h-12 text-green-600 animate-pulse" />
                    </div>
                  </div>
                </div>
                <p className="mt-12 text-gray-700 text-2xl font-black animate-pulse tracking-wide">
                  समस्या लोड होत आहेत...
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce animation-delay-400"></div>
                </div>
              </div>
            ) : displayedIssues.length === 0 ? (
              <div className="text-center py-20 px-4 animate-fadeInUp">
                <div className="max-w-3xl mx-auto relative bg-gradient-to-br from-white via-green-50/70 to-emerald-50/70 backdrop-blur-xl rounded-3xl shadow-2xl border-3 border-green-200 p-16 transform hover:scale-105 transition-all duration-500 overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-48 h-48 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-teal-300/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                  
                  <div className="relative inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 mb-8 shadow-2xl border-8 border-white animate-float">
                    <div className="text-9xl animate-wiggle">😔</div>
                    <div className="absolute inset-0 rounded-full border-4 border-green-300/50 animate-ping"></div>
                  </div>
                  
                  <p className="text-4xl font-black text-gray-800 mb-4 tracking-tight leading-tight">
                    या श्रेणीमध्ये कोणतीही समस्या नाही
                  </p>
                  <p className="text-xl text-gray-600 leading-relaxed font-bold mb-6">
                    नवीन समस्या नोंदवा आणि गावाला मदत करा!
                  </p>
                  
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <Users className="w-6 h-6 text-green-600 animate-bounce" />
                    <p className="text-green-700 font-semibold">आपले योगदान महत्वाचे आहे</p>
                    <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                  </div>
                  
                  <div className="relative mt-8">
                    <div className="h-2 w-48 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full mx-auto shadow-xl"></div>
                    <div className="absolute inset-0 h-2 w-48 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 rounded-full mx-auto blur-sm animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 mt-10">
                {displayedIssues.map((issue, index) => (
                  <div
                    key={issue._id}
                    className="group relative"
                    style={{
                      animation: `cardFloat 0.8s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Premium Glow Effects */}
                    <div className="absolute -inset-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-3xl opacity-0 group-hover:opacity-40 blur-3xl transition-all duration-700 animate-pulse-slow"></div>
                    <div className="absolute -inset-3 bg-gradient-to-br from-green-300 to-teal-300 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-white via-green-50/40 to-emerald-50/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-4 border-green-200 group-hover:border-green-400 transition-all duration-700 transform group-hover:-translate-y-8 group-hover:scale-[1.05]">
                      
                      {/* Top Gradient Bar */}
                      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 animate-shimmer"></div>
                      </div>
                      
                      {/* Vote Count Badge - Top Left */}
                      <div className="absolute top-4 left-4 z-20">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 rounded-full shadow-2xl border-2 border-white flex items-center gap-2">
                          <Heart className="w-5 h-5 text-white animate-pulse" />
                          <span className="text-white font-black text-lg">{issue.votes?.length || 0}</span>
                          <span className="text-white font-semibold text-sm">मते</span>
                        </div>
                      </div>
                      
                      {/* Corner Glows */}
                      <div className="absolute -top-20 -right-20 w-48 h-48 bg-green-300/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700"></div>
                      
                      {/* Sparkles on Hover */}
                      <Sparkles className="absolute top-4 right-4 w-7 h-7 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 drop-shadow-lg" />
                      
                      {/* Issue Content */}
                      <div className="relative z-10 p-6 pt-16"> {/* pt-16 to make space for vote badge */}
                        <IssueCard issue={issue} />
                        
                        {/* Details Button */}
                        <Link to={`/issue-details/${issue._id}`}>
                          <button className="w-full mt-5 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group/button">
                            <Eye className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
                            <span>सविस्तर माहिती पहा</span>
                            <ArrowRight className="w-5 h-5 group-hover/button:translate-x-2 transition-transform" />
                          </button>
                        </Link>
                      </div>
                      
                      {/* Bottom Glow */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Floating Action Button */}
            <Link to="/submit">
              <button
                className="group fixed bottom-8 right-8 w-28 h-28 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(16,185,129,0.6)] flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-180 z-50 border-4 border-white backdrop-blur-sm overflow-hidden"
                aria-label="Add new issue"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-300 to-teal-300 opacity-0 group-hover:opacity-70 blur-3xl transition-opacity duration-500 animate-pulse-slow"></div>
                
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                
                <Plus className="relative z-10 w-14 h-14 stroke-[3]" />
                
                <div className="absolute inset-0 rounded-full border-4 border-white/60 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-white/40 scale-100 group-hover:scale-[2] opacity-100 group-hover:opacity-0 transition-all duration-1000"></div>
                
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/50 animate-spin-slow"></div>
                
                <div className="absolute -top-16 right-0 bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
                  नवीन समस्या नोंदवा
                  <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-green-900"></div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes cardFloat {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
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

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-15deg);
          }
          75% {
            transform: rotate(15deg);
          }
        }

        @keyframes bounceX {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        .animate-bounceX {
          animation: bounceX 1s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}

export default Dashboard;