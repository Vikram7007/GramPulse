import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PublicDashboard() {
  const pieData = [{ name: 'सोडवले', value: 60 }, { name: 'प्रलंबित', value: 40 }];
  const barData = [{ month: 'जानेवारी', complaints: 30 }, { month: 'फेब्रुवारी', complaints: 45 }];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="p-6 min-h-screen bg-green-50">
      <h1 className="text-4xl font-bold text-primary text-center mb-10">गावाचा सार्वजनिक डॅशबोर्ड</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">समस्या स्थिती</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">मासिक तक्रारी</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default PublicDashboard;