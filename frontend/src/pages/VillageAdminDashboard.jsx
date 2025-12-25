import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Flag, Users, MapPin, Calendar, FileText, ChevronDown, AlertTriangle, TrendingUp, Send } from 'lucide-react';
import api from '../utils/api';
import { notifyError, notifySuccess } from '../components/NotificationToast';

const VillageAdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gramSabhaNotes, setGramSabhaNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedGramSevak, setSelectedGramSevak] = useState('राजेश कुमार');

  const gramSevaks = [
    'राजेश कुमार',
    'सुरेश पाटील',
    'अमित शर्मा',
    'प्रिया देवी',
    'रमेश सिंह'
  ];

  // Fetch issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const res = await api.get('/issues');
        let fetchedIssues = res.data.issues || [];

        fetchedIssues = fetchedIssues.map(issue => ({
          ...issue,
          status: issue.status || 'pending',
          priority: issue.priority || null,
          assignedTo: issue.assignedTo || null
        }));

        // Auto-set priority based on vote count
        fetchedIssues = fetchedIssues.map(issue => {
          const votes = issue.votes?.length || 0;
          let autoPriority = null;
          if (votes >= 10) autoPriority = 'high';
          else if (votes >= 5) autoPriority = 'medium';
          else if (votes >= 1) autoPriority = 'low';

          return {
            ...issue,
            priority: issue.priority || autoPriority
          };
        });

        // Sort by votes descending
        const sortedIssues = fetchedIssues.sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0));

        setIssues(sortedIssues);
      } catch (err) {
        console.error('Fetch issues error:', err);
        notifyError('समस्यांची यादी लोड होत नाही');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const stats = {
    pending: issues.filter(i => i.status === 'pending').length,
    high: issues.filter(i => i.priority === 'high').length,
    medium: issues.filter(i => i.priority === 'medium').length,
    low: issues.filter(i => i.priority === 'low').length,
    total: issues.length,
  };

  // Open assign modal
  const setInProgress = (id) => {
    const issue = issues.find(i => i._id === id);
    if (issue) {
      setSelectedIssue(issue);
      setSelectedGramSevak('राजेश कुमार');
      setShowSendModal(true);
    }
  };

  // Approve issue
  const approveIssue = async (id) => {
    try {
      await api.patch(`/issues/${id}/approved`);
      setIssues(issues.map(issue => 
        issue._id === id ? { ...issue, status: 'approved' } : issue
      ));
      notifySuccess('समस्या मंजूर केली!');
    } catch (err) {
      console.error(err);
      notifyError('मंजूर करताना त्रुटी');
    }
  };

  // Reject issue
  const rejectIssue = async (id) => {
    try {
      await api.patch(`/issues/${id}/rejected`);
      setIssues(issues.map(issue => 
        issue._id === id ? { ...issue, status: 'rejected', priority: null, assignedTo: null } : issue
      ));
      notifySuccess('समस्या नाकारली!');
    } catch (err) {
      console.error(err);
      notifyError('नाकारताना त्रुटी');
    }
  };

  // Send to Gram Sevak – FULLY UPDATED with proper error handling
  const sendToGramSevak = async () => {
    if (!selectedIssue || !selectedPriority || !selectedGramSevak) {
      notifyError('प्राधान्य आणि ग्रामसेवक निवडा');
      return;
    }

    try {
      await api.patch(`/issues/${selectedIssue._id}/in-progress`, {
        priority: selectedPriority.toLowerCase(),
        assignedTo: selectedGramSevak
      });

      // Local UI update
      setIssues(issues.map(issue => 
        issue._id === selectedIssue._id 
          ? { ...issue, priority: selectedPriority.toLowerCase(), assignedTo: selectedGramSevak, status: 'in-progress' } 
          : issue
      ));

      notifySuccess('समस्या ग्रामसेवकाला सोपवली!');
    } catch (err) {
      console.error('Assign error:', err);
      if (err.response?.status === 404) {
        notifyError('ही समस्या सापडली नाही – कदाचित delete झाली असेल');
      } else if (err.response?.status === 500) {
        notifyError('सर्व्हर त्रुटी – पुन्हा प्रयत्न करा');
      } else {
        notifyError('सोपवताना त्रुटी आली');
      }
    } finally {
      setShowSendModal(false);
      setSelectedIssue(null);
      setSelectedPriority('');
      setSelectedGramSevak('राजेश कुमार');
    }
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
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* NEW GREEN NAVBAR STYLE – तुझ्या screenshot प्रमाणे */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <MapPin className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">गाव प्रशासन डॅशबोर्ड</h1>
                <p className="text-green-100 text-lg mt-1">गावातील समस्या व्यवस्थापन करा</p>
              </div>
            </div>
            {/* Optional: Bell icon with notification badge (तुझ्या screenshot मध्ये red badge आहे) */}
            <div className="relative">
              <div className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-full transition-all duration-300 cursor-pointer">
                <Bell className="w-8 h-8 text-white" />
                {/* Example badge – तू real count लावू शकतोस */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse">
                  4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content – padding top add केला navbar साठी */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide mb-1">प्रलंबित मंजुरी</p>
                <p className="text-4xl font-bold text-orange-800">{stats.pending}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <Bell className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-semibold uppercase tracking-wide mb-1">उच्च प्राधान्य</p>
                <p className="text-4xl font-bold text-red-800">{stats.high}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-semibold uppercase tracking-wide mb-1">मध्यम प्राधान्य</p>
                <p className="text-4xl font-bold text-yellow-800">{stats.medium}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-full">
                <Flag className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-1">कमी प्राधान्य</p>
                <p className="text-4xl font-bold text-blue-800">{stats.low}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Village Summary Card */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            गाव सारांश
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-green-800 mb-4">एकूण गावातील समस्या</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5 border-2 border-green-200">
                <p className="text-green-600 font-semibold mb-1 text-sm uppercase">एकूण समस्या</p>
                <p className="text-4xl font-bold text-green-900">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
                <p className="text-orange-600 font-semibold mb-1 text-sm uppercase">प्रलंबित</p>
                <p className="text-4xl font-bold text-orange-900">{stats.pending}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-300">
                <p className="text-green-600 font-semibold mb-1 text-sm uppercase">मंजूर</p>
                <p className="text-4xl font-bold text-green-900">{issues.filter(i => i.status === 'approved').length}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
                <p className="text-red-600 font-semibold mb-1 text-sm uppercase">नाकारले</p>
                <p className="text-4xl font-bold text-red-900">{issues.filter(i => i.status === 'rejected').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Board */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
            <Flag className="w-6 h-6" />
            प्राधान्य बोर्ड
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['high', 'medium', 'low'].map((priority, index) => {
              const priorityLabel = priority === 'high' ? 'उच्च' : priority === 'medium' ? 'मध्यम' : 'कमी';
              const filteredIssues = issues.filter(i => i.priority === priority);
              return (
                <div key={priority} className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{animation: `slideIn 0.3s ease-out ${index * 0.15}s both`}}>
                  <div className={`px-6 py-4 ${priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                    <h3 className="text-xl font-bold text-white">{priorityLabel} प्राधान्य</h3>
                    <p className="text-white text-sm opacity-90">{filteredIssues.length} समस्या</p>
                  </div>
                  <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                    {filteredIssues.map(issue => (
                      <div key={issue._id} className="bg-green-50 rounded-xl p-4 border-2 border-green-200 hover:shadow-md transition-all duration-200">
                        {issue.images && issue.images.length > 0 && (
                          <img 
                            src={issue.images[0]} 
                            alt="Issue" 
                            className="w-full h-32 object-cover rounded-lg mb-3 shadow"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <p className="font-semibold text-green-900 mb-1">{issue.type}</p>
                        <p className="text-sm text-green-700 mb-2">{issue.description}</p>
                        {issue.assignedTo && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {issue.assignedTo}
                          </p>
                        )}
                      </div>
                    ))}
                    {filteredIssues.length === 0 && (
                      <p className="text-gray-500 text-center py-8 text-sm">या प्राधान्यात कोणतीही समस्या नाही</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Issues Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6" />
              समस्या व्यवस्थापन
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 uppercase tracking-wide">समस्या तपशील</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 uppercase tracking-wide">स्थिती</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 uppercase tracking-wide">प्राधान्य</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 uppercase tracking-wide">नियुक्त</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 uppercase tracking-wide">मत</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 uppercase tracking-wide">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">लोड होत आहे...</p>
                    </td>
                  </tr>
                ) : issues.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-gray-500">
                      <p className="text-xl">कोणतीही समस्या नाही</p>
                    </td>
                  </tr>
                ) : (
                  issues.map((issue, index) => (
                    <tr key={issue._id} className="hover:bg-green-50 transition-colors duration-200" style={{animation: `slideIn 0.3s ease-out ${index * 0.1}s both`}}>
                      <td className="px-6 py-3">
                        <div>
                          {issue.images && issue.images.length > 0 && (
                            <img 
                              src={issue.images[0]} 
                              alt="Issue" 
                              className="w-full max-w-xs h-28 object-cover rounded-lg mb-3 shadow"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <p className="text-green-900 font-semibold text-base mb-1">{issue.type}</p>
                          <p className="text-green-600 text-sm mb-1">{issue.description}</p>
                          <div className="flex gap-3 mt-2">
                            <span className="text-green-500 text-xs flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(issue.createdAt).toLocaleDateString('mr-IN')}
                            </span>
                            <span className="text-green-500 text-xs px-2 py-0.5 bg-green-100 rounded">
                              {issue.category || 'सामान्य'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(issue.status)}`}>
                          {issue.status === 'pending' ? 'प्रलंबित' : 
                           issue.status === 'approved' ? 'मंजूर' :
                           issue.status === 'rejected' ? 'नाकारले' :
                           issue.status === 'in-progress' ? 'प्रगतीत' : issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {issue.priority ? (
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(issue.priority)}`}>
                            {issue.priority === 'high' ? 'उच्च' : issue.priority === 'medium' ? 'मध्यम' : 'कमी'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">सेट केलेले नाही</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {issue.assignedTo ? (
                          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-semibold flex items-center gap-1 w-fit">
                            <Users className="w-4 h-4" />
                            {issue.assignedTo}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">नियुक्त नाही</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">👍</span>
                          <span className="font-bold text-green-800 text-xl">{issue.votes?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => setInProgress(issue._id)}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-1"
                          >
                            <Send className="w-4 h-4" />
                            प्रगतीत करा
                          </button>
                          <button
                            onClick={() => approveIssue(issue._id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            मंजूर
                          </button>
                          <button
                            onClick={() => rejectIssue(issue._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            नाकार
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Send to Gram Sevak Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Send className="w-6 h-6" />
                ग्राम सेवकाला समस्या पाठवा
              </h3>
              <button
                onClick={() => {
                  setShowSendModal(false);
                  setSelectedIssue(null);
                  setSelectedPriority('');
                  setSelectedGramSevak('राजेश कुमार');
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 bg-green-50 rounded-xl p-5 border-2 border-green-200">
                <h4 className="font-bold text-green-900 text-lg mb-2">{selectedIssue?.type}</h4>
                <p className="text-green-700 text-sm mb-3">{selectedIssue?.description}</p>
                {selectedIssue?.images && selectedIssue.images.length > 0 && (
                  <img 
                    src={selectedIssue.images[0]} 
                    alt="Issue" 
                    className="w-full h-48 object-cover rounded-lg mt-3 shadow"
                  />
                )}
                <div className="flex gap-4 text-sm mt-3">
                  <span className="text-green-600">मत: <strong>{selectedIssue?.votes?.length || 0}</strong></span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-green-800 font-bold mb-3 text-base">
                    प्राधान्य निवडा (मतांनुसार सुचवलेले)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setSelectedPriority('high')}
                      className={`p-4 rounded-xl border-2 font-semibold text-base transition-all duration-200 transform hover:scale-105 ${
                        selectedPriority === 'high' 
                          ? 'bg-red-500 text-white border-red-600 shadow-lg' 
                          : 'bg-white text-red-600 border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <Flag className="w-5 h-5 mx-auto mb-1" />
                      उच्च
                    </button>
                    <button
                      onClick={() => setSelectedPriority('medium')}
                      className={`p-4 rounded-xl border-2 font-semibold text-base transition-all duration-200 transform hover:scale-105 ${
                        selectedPriority === 'medium' 
                          ? 'bg-yellow-500 text-white border-yellow-600 shadow-lg' 
                          : 'bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50'
                      }`}
                    >
                      <Flag className="w-5 h-5 mx-auto mb-1" />
                      मध्यम
                    </button>
                    <button
                      onClick={() => setSelectedPriority('low')}
                      className={`p-4 rounded-xl border-2 font-semibold text-base transition-all duration-200 transform hover:scale-105 ${
                        selectedPriority === 'low' 
                          ? 'bg-blue-500 text-white border-blue-600 shadow-lg' 
                          : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <Flag className="w-5 h-5 mx-auto mb-1" />
                      कमी
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-green-800 font-bold mb-3 text-base">
                    ग्राम सेवक निवडा
                  </label>
                  <div className="space-y-3">
                    {gramSevaks.map(sevak => (
                      <button
                        key={sevak}
                        onClick={() => setSelectedGramSevak(sevak)}
                        className={`w-full p-4 rounded-xl border-2 font-semibold text-base transition-all duration-200 transform hover:scale-102 flex items-center gap-3 ${
                          selectedGramSevak === sevak 
                            ? 'bg-green-500 text-white border-green-600 shadow-lg' 
                            : 'bg-white text-green-800 border-green-300 hover:bg-green-50'
                        }`}
                      >
                        <Users className="w-5 h-5" />
                        {sevak}
                        {selectedGramSevak === sevak && <CheckCircle className="w-5 h-5 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={sendToGramSevak}
                  disabled={!selectedPriority || !selectedGramSevak}
                  className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-base hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  प्रगतीत करा आणि पाठवा
                </button>
                <button
                  onClick={() => {
                    setShowSendModal(false);
                    setSelectedIssue(null);
                    setSelectedPriority('');
                    setSelectedGramSevak('राजेश कुमार');
                  }}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold text-base hover:bg-gray-300 transition-all duration-200"
                >
                  रद्द करा
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gram Sabha Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                ग्राम सभा टिप्पणी
              </h3>
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setGramSabhaNotes('');
                  setSelectedIssue(null);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <h4 className="font-bold text-green-900 text-lg mb-2">{selectedIssue?.type}</h4>
                <p className="text-green-700 text-sm mb-2">{selectedIssue?.description}</p>
                <div className="flex gap-4 text-sm flex-wrap">
                  <span className="text-green-600">स्थिती: <strong>{selectedIssue?.status === 'approved' ? 'मंजूर' : selectedIssue?.status}</strong></span>
                  {selectedIssue?.priority && (
                    <span className="text-green-600">प्राधान्य: <strong>{selectedIssue?.priority === 'high' ? 'उच्च' : selectedIssue?.priority === 'medium' ? 'मध्यम' : 'कमी'}</strong></span>
                  )}
                  {selectedIssue?.assignedTo && (
                    <span className="text-green-600">नियुक्त: <strong>{selectedIssue?.assignedTo}</strong></span>
                  )}
                </div>
              </div>

              <label className="block text-green-800 font-semibold mb-3 text-base">
                ग्राम सभा बैठक टिप्पणी जोडा
              </label>
              <textarea
                value={gramSabhaNotes}
                onChange={(e) => setGramSabhaNotes(e.target.value)}
                placeholder="ग्राम सभेतील चर्चा, निर्णय आणि कृती बिंदू येथे नोंदवा..."
                className="w-full h-48 px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-green-900 resize-none"
              />
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('Notes saved:', gramSabhaNotes);
                    setShowNotesModal(false);
                    setGramSabhaNotes('');
                    setSelectedIssue(null);
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  टिप्पणी जतन करा
                </button>
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setGramSabhaNotes('');
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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        /* Custom scrollbar */
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

export default VillageAdminDashboard;