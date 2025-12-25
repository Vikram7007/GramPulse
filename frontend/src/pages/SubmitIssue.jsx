import { useState } from 'react';
import MapPicker from '../components/MapPicker';
import { notifySuccess, notifyError } from '../components/NotificationToast';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function SubmitIssue() {
  const { t } = useTranslation();
  const [location, setLocation] = useState({ lat: 18.5204, lng: 73.8567 });
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cloudinary upload - with better error handling
  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    console.log('Uploading to Cloudinary:', file.name, file.type, file.size);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'grampulse_unsigned');
    formData.append('folder', 'grampulse_issues');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dkwuxbwkn/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Cloudinary server response error:', errorData);
        throw new Error(errorData.error?.message || `Upload failed (status ${res.status})`);
      }

      const data = await res.json();
      console.log('Cloudinary success:', data.secure_url);
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed:', err.message);
      throw err;
    }
  };

  // Map screenshot capture - fixed and reliable
  const captureMapScreenshot = async () => {
    const mapElement = document.querySelector('.gm-style');
    if (!mapElement) {
      console.warn('Map element not found for screenshot');
      return null;
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        scale: 2, // better quality
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'map-screenshot.png', { type: 'image/png' });
            console.log('Map screenshot created:', file.size, file.type);
            resolve(file);
          } else {
            console.error('Blob creation failed');
            resolve(null);
          }
        }, 'image/png');
      });
    } catch (err) {
      console.error('Screenshot capture error:', err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      notifyError('प्रकार आणि वर्णन आवश्यक आहे!');
      return;
    }

    if (!location.lat || !location.lng) {
      notifyError('कृपया नकाशावर ठिकाण निवडा!');
      return;
    }

    setLoading(true);

    try {
      let photoUrl = null;
      let mapScreenshotUrl = null;

      // 1. User photo upload
      if (photoFile) {
        console.log('Starting photo upload...');
        photoUrl = await uploadToCloudinary(photoFile);
        console.log('Photo uploaded:', photoUrl);
      }

      // 2. Map screenshot upload
      console.log('Capturing map screenshot...');
      const mapFile = await captureMapScreenshot();
      if (mapFile) {
        console.log('Map file ready, uploading...');
        mapScreenshotUrl = await uploadToCloudinary(mapFile);
        console.log('Map screenshot uploaded:', mapScreenshotUrl);
      }

      // 3. Send to backend
      const payload = {
        type: issueType,
        description: description.trim(),
        location: {
          lat: Number(location.lat.toFixed(6)),
          lng: Number(location.lng.toFixed(6))
        },
        images: [photoUrl, mapScreenshotUrl].filter(Boolean) // remove null/undefined
      };

      console.log('Sending to backend:', payload);
      const res = await api.post('/issues', payload);
      console.log('Backend success:', res.data);

      notifySuccess('समस्या यशस्वीरीत्या नोंदवली गेली! 🚀');

      // Reset form
      setIssueType('');
      setDescription('');
      setPhotoFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      setLocation({ lat: 18.5204, lng: 73.8567 });
    } catch (err) {
      notifyError('काहीतरी चुकलं. पुन्हा प्रयत्न करा.');
      console.error('Submit error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Sidebar />
      <div className="max-w-5xl mx-auto ml-[350px] mt-32">
        {/* Header with animated gradient */}
        <div className="text-center mb-10 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg className="w-64 h-64 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 mb-3 relative z-10">
            {t('newIssue')}
          </h1>
          <div className="h-1.5 w-32 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full shadow-lg"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-lg border border-gray-100 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-400/10 to-emerald-400/10 rounded-tr-full"></div>

          <div className="relative z-10">
            {/* समस्या प्रकार */}
            <div className="mb-8 transform transition-all hover:scale-[1.01]">
              <label className="flex items-center gap-3 text-xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">
                  1
                </span>
                {t('issueType')}
              </label>
              <div className="relative">
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full p-5 pl-6 pr-12 border-2 border-gray-200 rounded-2xl text-lg font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-300 appearance-none bg-gradient-to-r from-white to-emerald-50/30 hover:border-emerald-300 cursor-pointer shadow-sm"
                  disabled={loading}
                >
                  <option value="">{t('selectOption')}</option>
                  <option value="water">🚰 {t('issueTypes.water')}</option>
                  <option value="road">🛣️ {t('issueTypes.road')}</option>
                  <option value="light">💡 {t('issueTypes.light')}</option>
                  <option value="drainage">🚰 {t('issueTypes.drainage')}</option>
                  <option value="garbage">🗑️ {t('issueTypes.garbage')}</option>
                  <option value="other">📌 {t('issueTypes.other')}</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* वर्णन */}
            <div className="mb-8 transform transition-all hover:scale-[1.01]">
              <label className="flex items-center gap-3 text-xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">
                  2
                </span>
                {t('description')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-6 border-2 border-gray-200 rounded-2xl text-lg h-48 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 resize-none bg-gradient-to-br from-white to-green-50/30 hover:border-green-300 shadow-sm font-medium"
                placeholder="समस्येचे तपशीलवार वर्णन लिहा..."
                disabled={loading}
              />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">कमीत कमी 10 अक्षरे</span>
                <span className={`font-semibold ${description.length > 10 ? 'text-green-600' : 'text-gray-400'}`}>
                  {description.length} अक्षरे
                </span>
              </div>
            </div>

            {/* फोटो अपलोड */}
            <div className="mb-8 transform transition-all hover:scale-[1.01]">
              <label className="flex items-center gap-3 text-xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">
                  3
                </span>
                {t('uploadMedia')}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl text-lg file:mr-4 file:py-3 file:px-8 file:rounded-xl file:border-0 file:text-white file:bg-gradient-to-r file:from-emerald-500 file:to-teal-500 file:font-semibold file:shadow-lg hover:file:from-emerald-600 hover:file:to-teal-600 file:transition-all cursor-pointer bg-gradient-to-br from-white to-emerald-50/20 hover:border-emerald-400 transition-all duration-300 shadow-sm"
                  disabled={loading}
                />
                {!photoFile && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              {photoFile && (
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm animate-fadeIn">
                  <div className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-800 font-bold">१ फोटो निवडला</p>
                    <p className="text-emerald-600 text-sm truncate">{photoFile.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map Picker */}
            <div className="mb-10 transform transition-all hover:scale-[1.01]">
              <label className="flex items-center gap-3 text-xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">
                  4
                </span>
                <div>
                  {t('selectLocation')}
                  <span className="block text-sm font-normal text-gray-500 mt-1">
                    (सबमिट वर screenshot automatic upload होईल)
                  </span>
                </div>
              </label>
              <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-200 ring-4 ring-emerald-100 transition-all duration-300 hover:border-emerald-400 hover:shadow-3xl">
                <MapPicker location={location} setLocation={setLocation} />
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-800 font-bold">{t('selectedLocation')}</p>
                  <p className="text-emerald-600 font-mono text-sm">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-6 rounded-2xl text-2xl font-black hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl relative overflow-hidden group ${
                loading ? 'opacity-70 cursor-not-allowed scale-100' : ''
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-7 w-7" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    सबमिट होत आहे...
                  </>
                ) : (
                  <>
                    {t('submitIssue')} ✅
                  </>
                )}
              </span>
            </button>

            {/* Help text */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                सर्व माहिती भरून सबमिट करा
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitIssue;