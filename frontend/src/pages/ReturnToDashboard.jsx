import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

function ReturnToDashboard() {
  const navigate = useNavigate();

  return (
    <>
      {/* Ultra Stylish Back to Dashboard Button with Advanced Animations */}
      <div className="fixed top-25 left-6 z-50">
        <button
          onClick={() => navigate('/dashboard')}
          className="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-br from-white via-green-50 to-emerald-50 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-green-300/60 hover:border-green-400 hover:shadow-[0_20px_60px_rgba(34,197,94,0.4)] transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-1"
        >
          {/* Animated gradient background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-700 animate-pulse-slow"></div>
          
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          
          {/* Rotating gradient border animation */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 animate-spin-slow blur-sm opacity-60"></div>
          </div>
          
          {/* Inner content container */}
          <div className="relative flex items-center gap-3 z-10">
            {/* Icon container with multiple animations */}
            <div className="relative">
              {/* Pulsing background circle */}
              <div className="absolute inset-0 bg-green-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 blur-md"></div>
              
              {/* Arrow icon with slide and rotate */}
              <ArrowLeft className="w-6 h-6 text-green-700 group-hover:text-green-600 group-hover:-translate-x-2 group-hover:scale-110 transition-all duration-400" />
              
              {/* Decorative sparkle on hover */}
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500" />
            </div>
            
            {/* Text with gradient and animations */}
            <div className="relative overflow-hidden">
              <span className="relative text-green-800 font-bold text-base tracking-wide bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 bg-clip-text group-hover:text-transparent transition-all duration-500">
                डॅशबोर्डवर परत
              </span>
              
              {/* Underline animation */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-500"></div>
            </div>
            
            {/* Home icon that appears on hover */}
            <Home className="w-5 h-5 text-green-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
          </div>
          
          {/* Expanding ripple border effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-green-400/40 scale-95 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          
          {/* Secondary ripple */}
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 scale-90 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100"></div>
          
          {/* Corner accent dots */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping delay-75"></div>
        </button>
        
        {/* Floating shadow beneath button */}
        <div className="absolute inset-0 top-2 bg-green-400/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </div>

      {/* Custom CSS for additional animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1.1); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        /* Smooth hover state transitions */
        button:hover {
          filter: brightness(1.05);
        }
        
        /* Add subtle 3D effect */
        button:active {
          transform: scale(0.98) translateY(0px);
        }
      `}</style>
    </>
  );
}

export default ReturnToDashboard;