import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Flag, ThumbsUp, MessageSquare, Upload, AlertCircle, Clock, Camera, FileText, User, TrendingUp, Award, MapPin, Calendar, Search, Filter } from 'lucide-react';
import api from '../utils/api';
import { notifyError, notifySuccess } from '../components/NotificationToast';
import ReturnToDashboard from './ReturnToDashboard'
      
// तुझ्या Cloudinary account चे details – बदलून टाक
const CLOUDINARY_CLOUD_NAME = 'dkwuxbwkn'; // तुझा cloud name
const CLOUDINARY_UPLOAD_PRESET = 'grampulse_unsigned'; // तुझा unsigned preset

const GramSevakDashboard = () => {
  const [gramSevak] = useState({
    name: 'राजेश कुमार',
    village: 'रामपूर',
    id: 'GS001'
  });

  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [issueProofUrls, setIssueProofUrls] = useState({}); // प्रत्येक issue साठी local proof URLs
  const [uploadingProof, setUploadingProof] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [weekFilter, setWeekFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // नवीन: टॅब साठी

  const newNotificationsCount = notifications.length;

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'grampulse/proof');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  };

  // फोटो निवडताक्षण automatic अपलोड होईल (specific issue साठी)
  const handleProofFileChange = async (e, issueId) => {
    const files = e.target.files;
    if (files.length === 0) return;

    setUploadingProof(true);
    const newUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadToCloudinary(file);
        newUrls.push(url);
      }
      
      setIssueProofUrls(prev => ({
        ...prev,
        [issueId]: [...(prev[issueId] || []), ...newUrls]
      }));
      
      notifySuccess(`${newUrls.length} पुरावा फोटो यशस्वीपणे अपलोड झाले!`);
    } catch (err) {
      notifyError('काही फोटो अपलोड करताना त्रुटी');
    } finally {
      setUploadingProof(false);
      e.target.value = ''; // reset input
    }
  };

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      setLoading(true);
      try {
        const res = await api.get('/issues/gramsevek');
        const fetchedIssues = res.data.issues || [];

        setIssues(fetchedIssues.map(issue => ({ ...issue, statusChanged: false })));
        setFilteredIssues(fetchedIssues);

        if (fetchedIssues.length > 0) {
          const newNotifs = fetchedIssues.map(issue => ({
            id: issue._id,
            title: issue.type,
            preview: issue.description.substring(0, 35) + (issue.description.length > 35 ? '...' : ''),
            priority: issue.priority ? (issue.priority === 'high' ? 'उच्च' : issue.priority === 'medium' ? 'मध्यम' : 'कमी') : '',
            time: new Date(issue.createdAt).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })
          }));
          setNotifications(newNotifs);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        notifyError('समस्यांची यादी लोड होत नाही');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    if (searchQuery.trim()) {
      filtered = filtered.filter(issue =>
        issue.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    if (weekFilter === 'thisWeek') {
      filtered = filtered.filter(issue => new Date(issue.createdAt) >= startOfThisWeek);
    } else if (weekFilter === 'lastWeek') {
      filtered = filtered.filter(issue =>
        new Date(issue.createdAt) >= startOfLastWeek && new Date(issue.createdAt) < startOfThisWeek
      );
    }

    setFilteredIssues(filtered);
  }, [searchQuery, weekFilter, issues]);

  const handleSubmitUpdate = async (issue) => {
    if (!issue || !issue._id) {
      notifyError('समस्या निवडलेली नाही किंवा डेटा हरवला');
      return;
    }

    const hasComment = comment.trim().length > 0;
    const hasProof = issueProofUrls[issue._id] && issueProofUrls[issue._id].length > 0;
    const hasStatusChange = issue.statusChanged === true;

    if (!hasComment && !hasProof && !hasStatusChange) {
      notifyError('कृपया काही तरी बदल करा (स्थिती, टिप्पणी किंवा फोटो)');
      return;
    }

    // पूर्ण schema नुसार सगळे fields backend ला पाठवतो
    const payload = {
      type: issue.type,
      description: issue.description,
      location: issue.location || { lat: 0, lng: 0 },
      images: issue.images || [],
      votes: issue.votes || [],
      priority: issue.priority || 'low',
      assignedTo: issue.assignedTo || gramSevak.name,
      status: hasStatusChange ? issue.status : (issue.status || 'in-progress'),
      comments: hasComment 
        ? [...(issue.comments || []), { 
            text: comment.trim(), 
            date: new Date().toLocaleDateString('hi-IN'), 
            time: new Date().toLocaleTimeString('hi-IN') 
          }]
        : (issue.comments || []),
      proofPhotos: hasProof 
        ? [...(issue.proofPhotos || []), ...issueProofUrls[issue._id]]
        : (issue.proofPhotos || []),
      originalIssueId: issue.originalIssueId || issue._id
    };

    try {
      const res = await api.patch(`/issues/gramsevek/${issue._id}/approval`, payload);
      const ChnageStatus=await api.patch(`/issues/gramsevek/${payload.status}/${issue._id}`)
      console.log(ChnageStatus)
      setIssues(prev => prev.map(i =>
        i._id === issue._id
          ? { ...i, ...res.data.gramSevakIssue, statusChanged: false }
          : i
      ));

      notifySuccess('अपडेट यशस्वी!');

      // Clear local state
      setIssueProofUrls(prev => {
        const newState = { ...prev };
        delete newState[issue._id];
        return newState;
      });
      setComment('');
    } catch (err) {
      console.error('Update error:', err.response?.data || err);
      const errorMsg = err.response?.data?.message || 'अपडेट करताना त्रुटी आली';
      notifyError(errorMsg);
    }
  };

  const updateStatus = (issueId, newStatus) => {
    setIssues(prev => prev.map(issue =>
      issue._id === issueId ? { ...issue, status: newStatus, statusChanged: true } : issue
    ));
  };

  const addComment = () => {
    if (comment.trim() && selectedIssue) {
      const newComment = {
        text: comment.trim(),
        date: new Date().toLocaleDateString('hi-IN'),
        time: new Date().toLocaleTimeString('hi-IN')
      };
      setIssues(prev => prev.map(issue =>
        issue._id === selectedIssue._id
          ? { ...issue, comments: [...(issue.comments || []), newComment] }
          : issue
      ));
      setComment('');
      setShowCommentModal(false);
    }
  };

  const removeProofPhoto = (issueId, index) => {
    setIssueProofUrls(prev => ({
      ...prev,
      [issueId]: (prev[issueId] || []).filter((_, i) => i !== index)
    }));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Issue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = {
    total: filteredIssues.length,
    inProgress: filteredIssues.filter(i => i.status === 'in-progress').length,
    completed: filteredIssues.filter(i => i.status === 'Completed').length,
    totalVotes: filteredIssues.reduce((sum, issue) => sum + (issue.votes?.length || 0), 0)
  };

  // टॅब नुसार issues फिल्टर करा
  const displayedIssues = activeTab === 'all' 
    ? filteredIssues 
    : filteredIssues.filter(issue => {
        if (activeTab === 'pending') return issue.status === 'in-progress';
        if (activeTab === 'completed') return issue.status === 'Completed';
        if (activeTab === 'rejected') return issue.status === 'Issue';
        return true;
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ग्रामसेवक डॅशबोर्ड</h1>
                <p className="text-green-100 text-base flex items-center gap-2">
                  <span className="font-semibold">{gramSevak.name}</span>
                  <span className="text-green-200">|</span>
                  <MapPin className="w-4 h-4" />
                  <span>{gramSevak.village}</span>
                </p>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setNotifications([]);
                }}
                className="relative bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Bell className="w-6 h-6 text-white" />
                {newNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {newNotificationsCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideDown z-50">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3">
                    <h3 className="text-white font-bold text-lg">सूचना ({newNotificationsCount})</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center py-8 text-gray-500">कोणतीही सूचना नाही</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="px-5 py-4 border-b border-green-100 hover:bg-green-50 transition-colors bg-green-50">
                          <p className="text-green-900 font-bold text-base mb-1">{notif.title}</p>
                          <p className="text-green-800 text-sm mb-1">{notif.preview}</p>
                          <div className="flex items-center justify-between text-xs text-green-600">
                            <span>प्राधान्य: <strong>{notif.priority}</strong></span>
                            <span>{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
 <ReturnToDashboard/>
      <div className="max-w-7xl mx-auto mt-10 px-6 py-8">
        {/* Stats Cards */}
        
             
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold uppercase tracking-wide mb-1">एकूण समस्या</p>
                <p className="text-4xl font-bold text-green-800">{stats.total}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-1">प्रगतीत</p>
                <p className="text-4xl font-bold text-blue-800">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wide mb-1">पूर्ण झाले</p>
                <p className="text-4xl font-bold text-emerald-800">{stats.completed}</p>
              </div>
              <div className="bg-emerald-100 p-4 rounded-full">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide mb-1">एकूण मते</p>
                <p className="text-4xl font-bold text-orange-800">{stats.totalVotes}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="text"
                placeholder="समस्येच्या नावाने शोधा..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-green-900"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-green-600" />
              <select
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
                className="px-5 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-green-900 font-medium"
              >
                <option value="all">सर्व समस्या</option>
                <option value="thisWeek">हा आठवडा</option>
                <option value="lastWeek">मागील आठवडा</option>
              </select>
            </div>
          </div>
        </div>

        {/* Simple 3 Buttons for Category Tabs */}
        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'all' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            सर्व ({filteredIssues.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'pending' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            प्रगतीत ({stats.inProgress})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'completed' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            पूर्ण ({stats.completed})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
              activeTab === 'rejected' 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            अडचण ({filteredIssues.filter(i => i.status === 'Issue').length})
          </button>
        </div>

        {/* Issues Grid – एकच grid, फक्त फिल्टर केलेले cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
            <FileText className="w-7 h-7" />
            नियुक्त समस्या ({displayedIssues.length})
          </h2>
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto"></div>
              <p className="mt-6 text-green-700 text-xl">समस्यांची यादी लोड होत आहे...</p>
            </div>
          ) : displayedIssues.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <FileText className="w-20 h-20 text-green-300 mx-auto mb-4" />
              <p className="text-2xl text-green-700 font-semibold">
                या श्रेणीमध्ये सध्या कोणतीही समस्या नाही
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedIssues.map((issue, index) => (
                <div
                  key={issue._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-2xl border-2 border-green-100"
                  style={{animation: `slideUp 0.5s ease-out ${index * 0.15}s both`}}
                >
                  {/* Issue Header */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white flex-1">{issue.type}</h3>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getPriorityColor(issue.priority)}`}>
                        {issue.priority === 'high' ? 'उच्च' : issue.priority === 'medium' ? 'मध्यम' : 'कमी'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-white text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(issue.createdAt).toLocaleDateString('mr-IN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {issue.votes?.length || 0} मते
                      </span>
                    </div>
                  </div>
                  {/* Issue Body */}
                  <div className="p-6">
                    <p className="text-green-900 text-base mb-4 leading-relaxed">{issue.description}</p>
                    {/* Photo & Map Section */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Camera className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-semibold text-sm">समस्येचा फोटो</span>
                        </div>
                        {issue.images && issue.images.length > 0 ? (
                          <img
                            src={issue.images[0]}
                            alt="Problem"
                            className="w-full h-32 object-cover rounded-lg shadow"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <div className="bg-green-200 h-32 rounded-lg flex items-center justify-center">
                            <Camera className="w-12 h-12 text-green-600" />
                          </div>
                        )}
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700 font-semibold text-sm">स्थान नकाशा</span>
                        </div>
                        <div className="bg-blue-200 h-32 rounded-lg flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    {/* Status Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-800 font-semibold text-sm">सध्याची स्थिती:</span>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(issue.status)}`}>
                          {issue.status === 'in-progress' ? '⏳ प्रगतीत आहे' : issue.status === 'Completed' ? '✅ पूर्ण' : '⚠️ अडचण'}
                        </span>
                      </div>
                    </div>
                    {/* Comments Display */}
                    {(issue.comments || []).length > 0 && (
                      <div className="mb-4 bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          प्रगती टिप्पणी ({issue.comments.length})
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {issue.comments.map((comm, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-3 border border-green-200">
                              <p className="text-green-900 text-sm mb-1">{comm.text}</p>
                              <p className="text-green-600 text-xs">{comm.date} - {comm.time}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Uploaded Proof Photos Display */}
                    {issueProofUrls[issue._id] && issueProofUrls[issue._id].length > 0 && (
                      <div className="mb-4 bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          अपलोड केलेले पुरावा फोटो ({issueProofUrls[issue._id].length})
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {issueProofUrls[issue._id].map((url, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={url}
                                alt={`पुरावा ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg shadow"
                              />
                              <button
                                onClick={() => removeProofPhoto(issue._id, idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => updateStatus(issue._id, 'in-progress')}
                          className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                            issue.status === 'in-progress'
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                          प्रगतीत
                        </button>
                        <button
                          onClick={() => updateStatus(issue._id, 'Completed')}
                          className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                            issue.status === 'Completed'
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          पूर्ण
                        </button>
                        <button
                          onClick={() => updateStatus(issue._id, 'Issue')}
                          className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                            issue.status === 'Issue'
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4" />
                          अडचण
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowCommentModal(true);
                          }}
                          className="px-4 py-3 bg-purple-500 text-white rounded-xl font-semibold text-sm hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                        >
                          <MessageSquare className="w-4 h-4" />
                          टिप्पणी जोडा
                        </button>
                        
                        {/* Upload Button */}
                        <label className="px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md cursor-pointer">
                          <Upload className="w-4 h-4" />
                          {uploadingProof ? 'अपलोड होत आहे...' : 'पुरावा अपलोड'}
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleProofFileChange(e, issue._id)}
                            className="hidden"
                            disabled={uploadingProof}
                          />
                        </label>
                      </div>
                      <button
                        onClick={() => handleSubmitUpdate(issue)}
                        className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-base hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-6 h-6" />
                        अपडेट सबमिट करा
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                प्रगती टिप्पणी जोडा
              </h3>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setComment('');
                  setSelectedIssue(null);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-5 bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <h4 className="font-bold text-green-900 text-lg mb-2">{selectedIssue?.type}</h4>
                <p className="text-green-700 text-sm">{selectedIssue?.description}</p>
              </div>
              <label className="block text-green-800 font-semibold mb-3 text-base">
                आजचे काम / प्रगती
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="आज काय काम केले ते येथे लिहा..."
                className="w-full h-40 px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-green-900 resize-none"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={addComment}
                  disabled={!comment.trim()}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  टिप्पणी जतन करा
                </button>
                <button
                  onClick={() => {
                    setShowCommentModal(false);
                    setComment('');
                    setSelectedIssue(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  रद्द करा
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out both;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
};

export default GramSevakDashboard;