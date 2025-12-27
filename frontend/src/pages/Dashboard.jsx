import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifyError } from '../components/NotificationToast';
import {
  Sparkles,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Filter,
  Plus,
  Zap,
  Award,
  Target
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
       
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
       
        <div className="relative z-10" style={{ paddingLeft: "240px" }}>
          {/* Hero Header Section */}
          <div className="max-w-7xl mx-auto mb-16 text-center animate-fadeInDown">
            <div className="relative inline-block mb-8">
              {/* Glow Effects */}
              <div className="absolute -inset-8 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-20 blur-3xl rounded-full animate-pulse-slow"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 opacity-30 blur-2xl rounded-full animate-spin-slow"></div>
             
              {/* Title */}
              <div className="relative">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight leading-tight filter drop-shadow-2xl">
                  गावातील समस्या
                </h1>
               
                {/* Sparkles */}
                <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-spin-slow" />
                <Sparkles className="absolute -top-2 -right-6 w-6 h-6 text-green-400 animate-pulse" />
                <Sparkles className="absolute -bottom-2 left-1/4 w-5 h-5 text-teal-400 animate-bounce" />
              </div>
             
              {/* Decorative Lines */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-green-400 to-green-500 rounded-full shadow-lg animate-expandWidth"></div>
                <div className="relative">
                  <div className="h-2.5 w-36 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full shadow-xl"></div>
                  <div className="absolute inset-0 h-2.5 w-36 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full blur-sm animate-pulse"></div>
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-teal-500 via-teal-400 to-transparent rounded-full shadow-lg animate-expandWidth animation-delay-500"></div>
              </div>
            </div>
           
            {/* Subtitle with Icon */}
            <div className="flex items-center justify-center gap-3 animate-fadeInUp animation-delay-300">
              <Target className="w-6 h-6 text-green-600 animate-pulse" />
              <p className="text-xl sm:text-2xl text-gray-700 font-bold max-w-3xl mx-auto leading-relaxed tracking-wide">
                आपल्या गावाच्या विकासासाठी आवाज उठवा
              </p>
              <Award className="w-6 h-6 text-green-600 animate-bounce" />
            </div>
          </div>
          {/* Week Selector Section */}
          <div className="max-w-2xl mx-auto mb-14 px-4 animate-fadeInUp animation-delay-500">
            <div className="relative group">
              {/* Label with Icon */}
              <label className="flex items-center justify-center gap-3 text-lg font-bold text-gray-800 mb-5 tracking-wide">
                <Calendar className="w-6 h-6 text-green-600 animate-bounce" />
                आठवडा निवडा
                <Filter className="w-6 h-6 text-green-600 animate-pulse" />
              </label>
             
              {/* Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-pulse-slow"></div>
             
              {/* Select Dropdown */}
              <div className="relative">
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="relative w-full px-8 py-6 bg-white/95 backdrop-blur-xl border-3 border-green-300 rounded-2xl text-lg font-bold text-gray-800 shadow-2xl hover:shadow-[0_20px_60px_rgba(16,185,129,0.3)] focus:shadow-[0_20px_60px_rgba(16,185,129,0.4)] focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 cursor-pointer appearance-none hover:scale-[1.02] active:scale-[0.98] group-hover:border-green-400"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1.5rem center',
                    backgroundSize: '2em 2em',
                    paddingRight: '4.5rem'
                  }}
                >
                  {weekOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="py-4 font-semibold">
                      {opt.label}
                    </option>
                  ))}
                </select>
               
                {/* Shimmer Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none"></div>
              </div>
            </div>
          </div>
          {/* Filter Tabs Section */}
          <div className="max-w-6xl mx-auto mb-16 px-4 animate-fadeInUp animation-delay-700">
            <div className="relative bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border-2 border-green-200/50 overflow-hidden">
              {/* Corner Glows */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
             
              {/* Tabs Container */}
              <div className="relative flex flex-wrap justify-center gap-4">
                {/* All Tab */}
                <button
                  onClick={() => setActiveTab('all')}
                  className={`group relative px-10 py-5 rounded-2xl font-black text-lg tracking-wide transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-400/60'
                      : 'bg-white/90 text-green-700 hover:bg-green-50 border-3 border-green-300 hover:border-green-400 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {activeTab === 'all' && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-shimmer"></div>
                    </>
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    सर्व <span className="text-2xl font-black">({stats.all})</span>
                  </span>
                </button>
               
                {/* In Progress Tab */}
                <button
                  onClick={() => setActiveTab('inProgress')}
                  className={`group relative px-10 py-5 rounded-2xl font-black text-lg tracking-wide transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden ${
                    activeTab === 'inProgress'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-400/60'
                      : 'bg-white/90 text-blue-700 hover:bg-blue-50 border-3 border-blue-300 hover:border-blue-400 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {activeTab === 'inProgress' && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-shimmer"></div>
                    </>
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Clock className="w-6 h-6 animate-spin-slow" />
                    प्रगतीत <span className="text-2xl font-black">({stats.inProgress})</span>
                  </span>
                </button>
               
                {/* Approved Tab */}
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`group relative px-10 py-5 rounded-2xl font-black text-lg tracking-wide transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden ${
                    activeTab === 'approved'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-400/60'
                      : 'bg-white/90 text-emerald-700 hover:bg-emerald-50 border-3 border-emerald-300 hover:border-emerald-400 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {activeTab === 'approved' && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-shimmer"></div>
                    </>
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 animate-bounce" />
                    पूर्ण <span className="text-2xl font-black">({stats.completed})</span>
                  </span>
                </button>
               
                {/* Rejected Tab */}
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`group relative px-10 py-5 rounded-2xl font-black text-lg tracking-wide transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden ${
                    activeTab === 'rejected'
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl shadow-red-400/60'
                      : 'bg-white/90 text-red-700 hover:bg-red-50 border-3 border-red-300 hover:border-red-400 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {activeTab === 'rejected' && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-shimmer"></div>
                    </>
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                    अडचण <span className="text-2xl font-black">({stats.issue})</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Loading State */}
          {loading ? (
            <div className="text-center py-32 animate-fadeIn">
              <div className="relative inline-block">
                {/* Outer Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-30 blur-3xl animate-pulse-slow"></div>
               
                {/* Spinner Container */}
                <div className="relative">
                  {/* Main Spinner */}
                  <div className="animate-spin rounded-full h-32 w-32 border-8 border-gray-200 border-t-green-500 border-r-emerald-500 shadow-2xl"></div>
                 
                  {/* Reverse Spinner */}
                  <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-teal-500 animate-spin-reverse"></div>
                 
                  {/* Center Icon */}
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
            /* Empty State */
            <div className="max-w-3xl mx-auto animate-fadeInUp">
              <div className="relative bg-gradient-to-br from-white via-green-50/70 to-emerald-50/70 backdrop-blur-xl rounded-3xl shadow-2xl border-3 border-green-200 p-20 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-[0_30px_80px_rgba(16,185,129,0.3)] overflow-hidden">
                {/* Corner Glows */}
                <div className="absolute -top-8 -right-8 w-48 h-48 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-teal-300/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
               
                {/* Emoji Circle */}
                <div className="relative inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 mb-10 shadow-2xl border-8 border-white animate-float">
                  <div className="text-9xl animate-wiggle">😔</div>
                  <div className="absolute inset-0 rounded-full border-4 border-green-300/50 animate-ping"></div>
                </div>
               
                <p className="text-4xl font-black text-gray-800 mb-6 tracking-tight leading-tight">
                  या श्रेणीमध्ये कोणतीही समस्या नाही
                </p>
                <p className="text-xl text-gray-600 leading-relaxed font-bold mb-8">
                  नवीन समस्या नोंदवा आणि गावाला मदत करा!
                </p>
               
                {/* Decorative Line */}
                <div className="relative mt-10">
                  <div className="h-2 w-48 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full mx-auto shadow-xl"></div>
                  <div className="absolute inset-0 h-2 w-48 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 rounded-full mx-auto blur-sm animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            /* Issues Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto px-2">
              {displayedIssues.map((issue, index) => (
                <div
                  key={issue._id}
                  className="group"
                  style={{
                    animation: `cardFloat 0.8s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Card Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-3xl opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-500"></div>
                 
                  <Link to={`/issue-details/${issue._id}`} className="relative block">
                    <div className="relative overflow-hidden rounded-3xl shadow-xl group-hover:shadow-[0_30px_80px_rgba(16,185,129,0.4)] transition-all duration-500 bg-white/95 backdrop-blur-sm border-3 border-green-200 group-hover:border-green-400 transform group-hover:-translate-y-4 group-hover:scale-105">
                      {/* Top Gradient Bar */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                        <div className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 animate-shimmer"></div>
                      </div>
                     
                      {/* Corner Glow */}
                      <div className="absolute -top-20 -right-20 w-48 h-48 bg-green-300/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                     
                      {/* Sparkle Effect */}
                      <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500" />
                     
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
          {/* Floating Action Button */}
          <Link to="/submit">
            <button
              className="group fixed bottom-8 right-8 w-28 h-28 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(16,185,129,0.6)] flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-180 z-50 border-4 border-white backdrop-blur-sm overflow-hidden"
              aria-label="Add new issue"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-300 to-teal-300 opacity-0 group-hover:opacity-70 blur-3xl transition-opacity duration-500 animate-pulse-slow"></div>
             
              {/* Shimmer */}
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
             
              {/* Icon */}
              <Plus className="relative z-10 w-14 h-14 stroke-[3]" />
             
              {/* Ripple Effects */}
              <div className="absolute inset-0 rounded-full border-4 border-white/60 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-white/40 scale-100 group-hover:scale-[2] opacity-100 group-hover:opacity-0 transition-all duration-1000"></div>
             
              {/* Rotating Border */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/50 animate-spin-slow"></div>
            </button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes cardFloat {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.9) rotateX(15deg);
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
        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
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
        .animate-expandWidth {
          animation: expandWidth 1.5s ease-out;
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
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