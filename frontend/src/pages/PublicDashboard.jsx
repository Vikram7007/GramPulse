import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertTriangle, Users, FileText, Target, Award, Activity, Sparkles } from 'lucide-react';
import ReturnToDashboard from './ReturnToDashboard';

function PublicDashboard() {
  // Data
  const pieData = [
    { name: 'सोडवले', value: 60 }, 
    { name: 'प्रलंबित', value: 40 }
  ];
  
  const barData = [
    { month: 'जानेवारी', complaints: 30, solved: 25 },
    { month: 'फेब्रुवारी', complaints: 45, solved: 38 },
    { month: 'मार्च', complaints: 38, solved: 32 },
    { month: 'एप्रिल', complaints: 52, solved: 45 }
  ];

  const trendData = [
    { month: 'जान', value: 30 },
    { month: 'फेब', value: 45 },
    { month: 'मार्च', value: 38 },
    { month: 'एप्रिल', value: 52 },
    { month: 'मे', value: 48 },
    { month: 'जून', value: 65 }
  ];

  const COLORS = ['#10b981', '#ef4444'];
  const GRADIENT_COLORS = ['#059669', '#34d399'];

  // Stats data
  const stats = [
    {
      icon: CheckCircle,
      title: 'सोडवलेल्या समस्या',
      value: '156',
      change: '+12%',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'प्रलंबित समस्या',
      value: '42',
      change: '-8%',
      color: 'from-orange-500 to-yellow-600',
      bgColor: 'from-orange-50 to-yellow-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'एकूण तक्रारी',
      value: '198',
      change: '+5%',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'सक्रिय नागरिक',
      value: '1,245',
      change: '+18%',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600'
    }
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl border-2 border-green-200">
          <p className="text-green-900 font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <ReturnToDashboard/>
      
      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeInDown">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-500 animate-spin-slow" />
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              गावाचा सार्वजनिक डॅशबोर्ड
            </h1>
            <Sparkles className="w-10 h-10 text-yellow-500 animate-spin-slow" />
          </div>
          <p className="text-green-700 text-xl font-medium mt-3">
            आमच्या गावाच्या प्रगतीचा वास्तविक काळातील आढावा
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            <Activity className="w-5 h-5 text-green-600 animate-pulse" />
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border-2 border-white/50 overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">{stat.title}</p>
                  <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                </div>

                {/* Corner Sparkle */}
                <Sparkles className="absolute bottom-2 right-2 w-6 h-6 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700" />
              </div>
            );
          })}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
          {/* Pie Chart */}
          <div className="group bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-[0_20px_70px_rgba(16,185,129,0.3)] transform hover:scale-[1.02] transition-all duration-500 border-2 border-green-200/50 animate-fadeInLeft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                <Target className="w-8 h-8 text-green-600" />
                समस्या स्थिती विश्लेषण
              </h2>
              <Award className="w-8 h-8 text-yellow-500 animate-bounce" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "url(#greenGradient)" : "url(#redGradient)"} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend with Icons */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-700">सोडवले: 60%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-700">प्रलंबित: 40%</span>
              </div>
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="group bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-[0_20px_70px_rgba(16,185,129,0.3)] transform hover:scale-[1.02] transition-all duration-500 border-2 border-green-200/50 animate-fadeInRight">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                मासिक तक्रारी आकडेवारी
              </h2>
              <TrendingUp className="w-8 h-8 text-green-600 animate-pulse" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#059669" fontWeight="bold" />
                <YAxis stroke="#059669" fontWeight="bold" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="complaints" fill="url(#barGradient)" radius={[10, 10, 0, 0]} animationDuration={1500} name="तक्रारी" />
                <Bar dataKey="solved" fill="url(#solvedGradient)" radius={[10, 10, 0, 0]} animationDuration={1500} name="सोडवले" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart - Full Width */}
        <div className="max-w-7xl mx-auto">
          <div className="group bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-[0_20px_70px_rgba(16,185,129,0.3)] transform hover:scale-[1.01] transition-all duration-500 border-2 border-green-200/50 animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                <Activity className="w-8 h-8 text-green-600" />
                प्रगती ट्रेंड (शेवटचे 6 महिने)
              </h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-green-700">लाइव्ह डेटा</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#059669" fontWeight="bold" />
                <YAxis stroke="#059669" fontWeight="bold" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#059669"
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                  animationDuration={2000}
                  name="तक्रारी"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
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

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
          animation-fill-mode: both;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out;
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

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default PublicDashboard;