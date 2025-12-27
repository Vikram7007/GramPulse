import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { notifySuccess, notifyError } from '../components/NotificationToast';

function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

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
      setIssue(res.data.issue);
      notifySuccess('तुमचं मत नोंदवले गेलं! 👍');
    } catch (err) {
      notifyError(err.response?.data?.msg || 'मत देता आलं नाही');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-40 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
       
        <div className="relative text-center z-10 animate-fadeIn">
          <div className="relative inline-flex mb-6">
            <div className="w-24 h-24 border-4 border-green-300 rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-spin border-r-green-500" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl animate-pulse">📋</span>
            </div>
          </div>
          <p className="text-slate-700 text-xl font-bold mb-2">माहिती लोड होत आहे...</p>
          <p className="text-slate-500 text-sm">कृपया थांबा</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-red-200/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
       
        <div className="relative z-10 max-w-xl w-full animate-scaleIn">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 mb-6 shadow-xl animate-bounce-slow">
              <span className="text-6xl">🔍</span>
            </div>
           
            <h1 className="text-3xl font-black text-slate-800 mb-3">समस्या सापडली नाही</h1>
            <p className="text-slate-600 mb-8 leading-relaxed">कृपया तुमच्या सर्व समस्या पाहण्यासाठी डॅशबोर्ड वर परत जा</p>
           
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>डॅशबोर्ड वर जा</span>
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

      {/* Animated Background with Particles */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}/>
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="ml-32 pt-24 pb-20 pl-0 md:pl-64 px-6 lg:px-10 min-h-screen relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto lg:ml-40">
         
          {/* Back Button with Animation */}
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-3 text-green-700 hover:text-white mb-8 font-bold transition-all duration-300 bg-white/90 hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-lg hover:shadow-2xl border-2 border-green-200/50 hover:border-transparent hover:scale-105 animate-fadeInLeft"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-base">डॅशबोर्ड वर परत जा</span>
          </Link>

          {/* Hero Title Section with Enhanced Animation */}
          <div className="mb-12 animate-fadeInUp">
            <div className="inline-flex items-center gap-5 mb-4 bg-white/80 backdrop-blur-xl px-8 py-6 rounded-3xl shadow-2xl border-2 border-gray-200 hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl animate-bounce-slow">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm text-green-600 font-semibold mb-1 tracking-wide uppercase">समस्येचा प्रकार</p>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  {issue.type || 'अज्ञात समस्या'}
                </h1>
              </div>
            </div>
            <div className="h-2 w-32 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full ml-4 shadow-lg animate-shimmer"></div>
          </div>

          {/* Tutorial Banner - Collapsible */}
          {showTutorial && (
            <div className="mb-10 animate-fadeInDown">
              <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white rounded-3xl p-6">
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-red-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 group shadow-md"
                  >
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="flex items-start gap-4 pr-8">
                    <div className="flex-shrink-0 animate-bounce-slow">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-lg">
                        <span className="text-3xl">💡</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                        या पृष्ठाचा उपयोग कसा करावा?
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-md">महत्वाचे</span>
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200 hover:scale-105 transition-all duration-300 shadow-md">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                            <span className="text-xl">👀</span>
                          </div>
                          <div>
                            <p className="font-bold text-blue-900 text-sm mb-1">स्टेप 1: पहा</p>
                            <p className="text-xs text-blue-800 leading-relaxed">समस्येची माहिती, फोटो आणि ठिकाण नीट पहा</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200 hover:scale-105 transition-all duration-300 shadow-md">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                            <span className="text-xl">👍</span>
                          </div>
                          <div>
                            <p className="font-bold text-purple-900 text-sm mb-1">स्टेप 2: मत द्या</p>
                            <p className="text-xs text-purple-800 leading-relaxed">तुम्हालाही हीच समस्या असल्यास मत द्या</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-200 hover:scale-105 transition-all duration-300 shadow-md">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                            <span className="text-xl">🚀</span>
                          </div>
                          <div>
                            <p className="font-bold text-green-900 text-sm mb-1">स्टेप 3: निराकरण</p>
                            <p className="text-xs text-green-800 leading-relaxed">जास्त मते = लवकर समस्या सुटेल</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8 mb-10">
           
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-8">
             
              {/* Description Card */}
              <div className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-gray-200 hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 animate-fadeInUp">
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl blur-md opacity-50 animate-pulse"></div>
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-slate-800 mb-3 flex items-center gap-3">
                      समस्येचे संपूर्ण वर्णन
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">वाचा</span>
                    </h2>
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-2xl border-2 border-slate-200 shadow-inner">
                      <p className="text-slate-700 text-base leading-relaxed font-medium">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3 rounded-xl border-2 border-amber-200">
                    <span className="text-2xl animate-bounce">📖</span>
                    <p className="text-slate-700 text-sm font-semibold">वरील माहिती काळजीपूर्वक वाचा आणि समस्या समजून घ्या</p>
                  </div>
                </div>
              </div>

              {/* Photos Section - Further Increased Height & Width */}
              {issue.images?.length > 0 && (
                <div className="animate-fadeInUp animation-delay-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl border-2 border-gray-200 hover:scale-105 transition-all duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl blur-md opacity-50 animate-pulse"></div>
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800">समस्येचे फोटो</h2>
                        <p className="text-sm text-slate-600">खालील चित्रे पहा</p>
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center gap-2 animate-pulse">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span>{issue.images.length} फोटो</span>
                    </div>
                  </div>
                  
                  <div className="mb-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-l-4 border-indigo-500 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl animate-bounce">👆</span>
                      <div>
                        <p className="font-black text-indigo-900 text-sm mb-2">कसे पहायचे?</p>
                        <p className="text-indigo-800 text-sm leading-relaxed">कोणत्याही फोटोवर <span className="font-bold">क्लिक करा</span> आणि तो मोठ्या आकारात, स्पष्टपणे पहा. सविस्तर तपासणीसाठी zoom करा!</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Grid - Height Increased to h-[28rem] (~448px) for even larger cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {issue.images.map((img, index) => (
                      <div
                        key={index}
                        className="group relative cursor-pointer animate-scaleIn"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setSelectedImage(img)}
                      >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200 group-hover:border-purple-400 group-hover:scale-105 group-hover:-rotate-1 transition-all duration-500 bg-gradient-to-br from-gray-50 to-gray-100 h-[28rem]">
                          {/* Gradient Overlay on Hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                          
                          {/* Image with Object Cover */}
                          <img
                            src={img}
                            alt={`समस्या फोटो ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => { 
                              e.target.src = 'https://via.placeholder.com/800x700?text=फोटो+लोड+नाही';
                              e.target.className = 'w-full h-full object-contain bg-gray-100';
                            }}
                          />
                          
                          {/* Photo Number Badge */}
                          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 z-20">
                            <span className="text-lg">{index + 1}</span>
                          </div>
                          
                          {/* Zoom Icon and Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                            <div className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                              <div className="flex flex-col items-center gap-3">
                                <svg className="w-12 h-12 text-purple-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                                <span className="text-slate-800 font-black text-lg">मोठे पहा</span>
                                <span className="text-slate-600 text-xs">क्लिक करा</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom Info Bar */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm px-4 py-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                            <div className="flex items-center justify-between text-white">
                              <span className="text-xs font-bold">फोटो #{index + 1}</span>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-xs font-semibold">पाहा</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Additional Photo Instruction */}
                  <div className="mt-6 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                        <span className="text-3xl">🖼️</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-violet-900 font-bold text-sm mb-1">फोटो टीप:</p>
                        <p className="text-violet-800 text-xs leading-relaxed">प्रत्येक फोटोवर क्लिक करून सविस्तर पहा. जास्त स्पष्टतेसाठी फुल स्क्रीन मोडमध्ये उघडा!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Section with Enhanced Styling */}
              {mapImage && (
                <div className="animate-fadeInUp animation-delay-400">
                  <div className="flex items-center gap-4 mb-6 bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl border-2 border-gray-200 inline-flex hover:scale-105 transition-all duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl blur-md opacity-50 animate-pulse"></div>
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800">समस्येचे अचूक ठिकाण</h2>
                      <p className="text-sm text-slate-600">नकाशा खाली पहा</p>
                    </div>
                  </div>
                  
                  <div className="mb-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl animate-bounce">📍</span>
                      <div>
                        <p className="font-black text-emerald-900 text-sm mb-2">नकाशा माहिती</p>
                        <p className="text-emerald-800 text-sm leading-relaxed">खालील नकाश्यावर समस्येचे <span className="font-bold">तंतोतंत ठिकाण</span> दाखवले आहे. हे Google Maps वरून घेतलेले आहे.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Map Image with Better Height */}
                  <div className="group relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-200 hover:border-emerald-400 hover:scale-[1.02] transition-all duration-500 h-96">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      
                      <img
                        src={mapImage}
                        alt="ठिकाणाचा नकाशा"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x400?text=नकाशा+लोड+नाही';
                          e.target.className = 'w-full h-full object-contain bg-gray-100';
                        }}
                      />
                      
                      {/* Live Location Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-20 group-hover:scale-110 transition-transform duration-300">
                        <div className="relative">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-bold text-slate-800">लाइव्ह लोकेशन</span>
                      </div>
                      
                      {/* Bottom Info Bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-5 flex items-center justify-center gap-3 font-bold shadow-2xl z-10">
                        <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-base">Google Maps वरील स्थान</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Enhanced Sidebar */}
            <div className="space-y-8">
             
              {/* Quick Guide Card */}
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-1 shadow-2xl animate-fadeInRight">
                <div className="bg-white rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                      <span className="text-3xl">🤝</span>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-800">मदत कशी करावी?</h3>
                      <p className="text-xs text-gray-600">सोप्या स्टेप्स</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200 hover:scale-105 transition-all duration-300 shadow-md">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-xl font-black text-white">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900 mb-1">वाचा आणि समजून घ्या</p>
                        <p className="text-xs text-blue-800">समस्या, फोटो आणि ठिकाण नीट पहा</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200 hover:scale-105 transition-all duration-300 shadow-md">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-xl font-black text-white">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-purple-900 mb-1">तुम्हालाही त्रास आहे?</p>
                        <p className="text-xs text-purple-800">खाली मत देण्याचे बटण दाबा</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-200 hover:scale-105 transition-all duration-300 shadow-md">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-xl font-black text-white">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-900 mb-1">लवकर निराकरण</p>
                        <p className="text-xs text-green-800">जास्त मते = समस्या लवकर सुटेल</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Action Card - Enhanced */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-gray-200 sticky top-28 animate-fadeInRight animation-delay-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">समस्येची माहिती</h3>
                    <p className="text-xs text-slate-600">सध्याची स्थिती</p>
                  </div>
                </div>
               
                <div className="space-y-5">
                  {/* Status Badge with Animation */}
                  <div className={`relative px-6 py-5 rounded-2xl font-bold shadow-xl text-center border-4 transform hover:scale-105 transition-all duration-300 ${
                    issue.status === 'pending' ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border-red-300' :
                    issue.status === 'in-progress' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-300' :
                    'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300'
                  }`}>
                    <div className="absolute top-2 right-2">
                      <div className={`w-3 h-3 rounded-full animate-ping ${
                        issue.status === 'pending' ? 'bg-red-500' :
                        issue.status === 'in-progress' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl animate-bounce-slow">
                        {issue.status === 'pending' ? '⏳' :
                         issue.status === 'in-progress' ? '🔄' : '✅'}
                      </span>
                      <div>
                        <div className="text-xs opacity-70 font-semibold">सध्याची स्थिती</div>
                        <div className="text-base font-black mt-1">
                          {issue.status === 'pending' ? 'प्रलंबित आहे' :
                           issue.status === 'in-progress' ? 'काम चालू आहे' : 'समस्या सोडवली'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Votes Counter with Enhanced Design */}
                  <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-5 rounded-2xl shadow-xl border-4 border-slate-200 hover:scale-105 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                          <span className="text-3xl">👍</span>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 font-bold">एकूण मतं</div>
                          <div className="text-xs text-slate-500">लोकांनी दिलेली</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-black text-slate-800 animate-pulse">{issue.votes?.length || 0}</div>
                        <div className="text-xs text-slate-600 font-semibold mt-1">मतदार</div>
                      </div>
                    </div>
                  </div>

                  {/* Instruction Box */}
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-4 border-indigo-200 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl animate-bounce">💬</span>
                      <div>
                        <strong className="block mb-2 text-sm font-black text-indigo-900">तुमची मदत हवी आहे!</strong>
                        <p className="text-xs text-indigo-800 leading-relaxed">तुम्हालाही हीच समस्या आहे का? तर खालील <span className="font-bold text-pink-600">"मलाही त्रास आहे"</span> बटण दाबून आपले मत नोंदवा. तुमच्या मताने समस्या लवकर सुटण्यास मदत होईल! 🚀</p>
                      </div>
                    </div>
                  </div>

                  {/* Vote Button with Enhanced Design */}
                  <button
                    onClick={handleVote}
                    disabled={voting}
                    className={`relative w-full px-6 py-5 rounded-2xl font-black text-white transition-all duration-300 shadow-2xl text-base overflow-hidden group ${
                      voting
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:shadow-3xl hover:scale-110 active:scale-95'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-3">
                      {voting ? (
                        <>
                          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>सबमिट होत आहे...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span>मलाही त्रास आहे</span>
                          <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Impact Message */}
                  <div className="text-center pt-4 border-t-2 border-dashed border-slate-200">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 rounded-xl border-2 border-amber-200 shadow-md">
                      <p className="text-xs text-amber-800 leading-relaxed font-semibold flex items-center justify-center gap-2">
                        <span className="text-lg animate-bounce">⚡</span>
                        <span>तुमचे मत खूप महत्त्वाचे आहे! जास्त मते = लवकर कार्यवाही</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Help Card */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-6 shadow-xl border-2 border-cyan-200 animate-fadeInRight animation-delay-400">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                    <span className="text-2xl">ℹ️</span>
                  </div>
                  <h3 className="text-base font-black text-cyan-900">अधिक माहिती</h3>
                </div>
                <div className="space-y-3 text-xs text-cyan-800">
                  <div className="flex items-start gap-2 bg-white/50 p-3 rounded-xl hover:scale-105 transition-transform duration-300">
                    <span className="text-base">📱</span>
                    <p className="leading-relaxed"><span className="font-bold">तुमचा फोन:</span> समस्येच्या ठिकाणी जाऊन स्वतःचे फोटो घ्या</p>
                  </div>
                  <div className="flex items-start gap-2 bg-white/50 p-3 rounded-xl hover:scale-105 transition-transform duration-300">
                    <span className="text-base">👥</span>
                    <p className="leading-relaxed"><span className="font-bold">मित्रांना सांगा:</span> त्यांनाही मत देण्यास सांगा</p>
                  </div>
                  <div className="flex items-start gap-2 bg-white/50 p-3 rounded-xl hover:scale-105 transition-transform duration-300">
                    <span className="text-base">⏰</span>
                    <p className="leading-relaxed"><span className="font-bold">नियमित तपासा:</span> स्थिती अपडेट पहा</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl w-full animate-scaleIn">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-16 right-0 w-14 h-14 bg-white hover:bg-red-500 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-125 hover:rotate-90 group z-50"
            >
              <svg className="w-7 h-7 text-slate-700 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
           
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-3xl"></div>
              <img
                src={selectedImage}
                alt="Full view"
                className="w-full h-auto max-h-[85vh] object-contain rounded-3xl shadow-2xl border-8 border-white/20"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x800?text=फोटो+लोड+नाही';
                }}
              />
            </div>
           
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-2xl animate-pulse">
                <span className="text-2xl">💡</span>
                <p className="text-slate-800 font-bold">बाहेर कुठेही क्लिक करा किंवा ✕ बटण दाबा</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations & Enhanced Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          75% {
            transform: translate(30px, 30px) scale(1.05);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          background-size: 2000px 100%;
          animation: shimmer 3s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out;
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
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

export default IssueDetails;