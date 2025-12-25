import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifySuccess, notifyError } from '../components/NotificationToast';

function IssueDetails() {
  const { id } = useParams(); // URL मधून issue ID घे
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        setIssue(res.data.issue);
      } catch (err) {
        console.error('Issue fetch error:', err);
        notifyError('समस्या माहिती लोड होत नाही');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const handleVote = async () => {
    if (voting) return;
    setVoting(true);

    try {
      const res = await api.post(`/issues/${id}/vote`);
      setIssue(res.data.issue); // updated votes
      notifySuccess('तुमचं मत नोंदवले गेलं! 👍');
    } catch (err) {
      notifyError(err.response?.data?.msg || 'मत देता आलं नाही');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      /* ✨ ENHANCED: Premium loading state with multi-layer spinner */
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 relative overflow-hidden">
        {/* ✨ ENHANCED: Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(20,184,166,0.05),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 text-center">
          <div className="relative inline-block mb-6">
            {/* ✨ ENHANCED: Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 blur-2xl animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-20 w-20 border-4 border-gray-200">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-green-500"></div>
            </div>
          </div>
          <p className="text-gray-600 text-xl font-medium animate-pulse">माहिती लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      /* ✨ ENHANCED: Premium error state with card design */
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 relative overflow-hidden px-4">
        {/* ✨ ENHANCED: Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(20,184,166,0.05),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-md w-full">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100/50 p-12 text-center transform transition-all duration-500 hover:scale-[1.02]">
            {/* ✨ ENHANCED: Animated icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 mb-6 shadow-inner">
              <div className="text-5xl animate-[bounce_2s_ease-in-out_infinite]">🔍</div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">समस्या सापडली नाही</h1>
            <p className="text-gray-600 mb-6">कृपया डॅशबोर्ड वर परत जा</p>
            
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>←</span>
              <span>डॅशबोर्ड वर परत जा</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = issue.images?.[0] || 'https://via.placeholder.com/800x400?text=Image+Not+Available';
  const mapImage = issue.images?.find(img => img.includes('map-screenshot')) || null;

  return (
    <>
      <Navbar />
      <Sidebar />

      {/* ✨ ENHANCED: Main container with premium background */}
      <div className="pt-28 pb-24 pl-0 md:pl-64 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 relative overflow-hidden">
        
        {/* ✨ ENHANCED: Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(20,184,166,0.05),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto" style={{ paddingLeft: "200px" }}>
          
          {/* ✨ ENHANCED: Premium back button with icon and hover effect */}
          <Link 
            to="/dashboard" 
            className="group inline-flex items-center gap-3 text-emerald-600 hover:text-emerald-800 mb-10 text-base sm:text-lg font-semibold transition-all duration-300 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] border border-emerald-100/50"
          >
            {/* ✨ ENHANCED: Animated arrow icon */}
            <span className="text-2xl transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span>डॅशबोर्ड वर परत जा</span>
          </Link>

          {/* ✨ ENHANCED: Premium title with gradient and decorative elements */}
          <div className="mb-8 animate-[fadeIn_0.8s_ease-out]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent tracking-tight leading-tight">
              {issue.type || 'अज्ञात समस्या'}
            </h1>
            {/* ✨ ENHANCED: Decorative line */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-full shadow-sm"></div>
              <div className="w-8 h-1 bg-gradient-to-r from-teal-400 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* ✨ ENHANCED: Premium description card with glass morphism */}
          <div className="relative group mb-12 animate-[fadeInUp_0.6s_ease-out]">
            {/* ✨ ENHANCED: Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
            
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-100/50 transition-all duration-500 group-hover:shadow-2xl">
              
              {/* ✨ ENHANCED: Description with better typography */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {/* ✨ ENHANCED: Icon */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-inner">
                    <span className="text-xl">📝</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">समस्येचे वर्णन</h2>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap pl-0 sm:pl-13">
                  {issue.description}
                </p>
              </div>

              {/* ✨ ENHANCED: Status, Votes & Action section with improved layout */}
              <div className="border-t border-gray-200/50 pt-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    {/* ✨ ENHANCED: Premium status badge */}
                    <div className="relative group/status">
                      <div className={`absolute -inset-0.5 rounded-full opacity-0 group-hover/status:opacity-30 blur-md transition-all duration-300 ${
                        issue.status === 'pending' ? 'bg-red-400' :
                        issue.status === 'in-progress' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}></div>
                      <span className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-md transition-all duration-300 group-hover/status:scale-105 ${
                        issue.status === 'pending' ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200' :
                        issue.status === 'in-progress' ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200' :
                        'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200'
                      }`}>
                        <span className="text-lg">
                          {issue.status === 'pending' ? '⏳' :
                           issue.status === 'in-progress' ? '🔄' : '✅'}
                        </span>
                        {issue.status === 'pending' ? 'प्रलंबित' :
                         issue.status === 'in-progress' ? 'प्रगतीत' : 'सोडवले'}
                      </span>
                    </div>

                    {/* ✨ ENHANCED: Premium votes counter */}
                    <div className="relative group/votes">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover/votes:opacity-30 blur-md transition-all duration-300"></div>
                      <div className="relative flex items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-3 rounded-full shadow-md border border-gray-200/50 transition-all duration-300 group-hover/votes:scale-105">
                        <span className="text-2xl filter drop-shadow-sm">👍</span>
                        <span className="font-bold text-xl text-gray-800">{issue.votes?.length || 0}</span>
                        <span className="text-gray-600 font-medium">मत</span>
                      </div>
                    </div>
                  </div>

                  {/* ✨ ENHANCED: Premium vote button with advanced effects */}
                  <button
                    onClick={handleVote}
                    disabled={voting}
                    className={`group/btn relative px-8 py-4 rounded-xl font-bold text-white transition-all duration-500 shadow-lg text-base sm:text-lg ${
                      voting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:shadow-2xl hover:shadow-emerald-400/50 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {/* ✨ ENHANCED: Button glow effect */}
                    {!voting && (
                      <>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover/btn:opacity-30 blur-xl transition-opacity duration-500"></div>
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300"></div>
                      </>
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {voting ? (
                        <>
                          <span className="inline-block animate-spin">⏳</span>
                          <span>मत देत आहे...</span>
                        </>
                      ) : (
                        <>
                          <span>🙋</span>
                          <span>मलाही त्रास आहे</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ✨ ENHANCED: Premium images section header */}
          {issue.images?.length > 0 && (
            <div className="mb-6 animate-[fadeIn_1s_ease-out]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-inner">
                  <span className="text-xl">📸</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">फोटो</h2>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-3 ml-13"></div>
            </div>
          )}

          {/* ✨ ENHANCED: Premium images grid with staggered animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {issue.images?.length > 0 ? (
              issue.images.map((img, index) => (
                <div 
                  key={index} 
                  className="group relative animate-[fadeInUp_0.6s_ease-out]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* ✨ ENHANCED: Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                  
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white/50 transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl bg-white/30 backdrop-blur-sm">
                    <img
                      src={img}
                      alt={`Issue image ${index + 1}`}
                      className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error'; }}
                    />
                    {/* ✨ ENHANCED: Image overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* ✨ ENHANCED: Image number badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-emerald-600 shadow-lg border-2 border-emerald-200">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* ✨ ENHANCED: Premium empty state */
              <div className="col-span-2 bg-white/60 backdrop-blur-sm rounded-3xl p-12 text-center border border-emerald-100/50 shadow-lg">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
                  <span className="text-4xl">🖼️</span>
                </div>
                <p className="text-gray-600 text-lg font-medium">या समस्येसाठी कोणतीही फोटो उपलब्ध नाही</p>
              </div>
            )}
          </div>

          {/* ✨ ENHANCED: Premium map section with advanced styling */}
          {mapImage && (
            <div className="animate-[fadeInUp_0.8s_ease-out]">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-inner">
                    <span className="text-xl">📍</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">ठिकाण</h2>
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-3 ml-13"></div>
              </div>

              <div className="group relative">
                {/* ✨ ENHANCED: Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-3xl opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40"></div>
                
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 transform transition-all duration-500 hover:scale-[1.01] bg-white/30 backdrop-blur-sm">
                  <img
                    src={mapImage}
                    alt="Map Location Screenshot"
                    className="w-full h-96 md:h-[500px] object-cover"
                  />
                  {/* ✨ ENHANCED: Premium caption with gradient and icon */}
                  <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-6 py-5 flex items-center justify-center gap-3 shadow-inner">
                    <span className="text-2xl">🗺️</span>
                    <span className="font-bold text-lg tracking-wide">हे ठिकाणाचा स्क्रीनशॉट आहे</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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

export default IssueDetails;