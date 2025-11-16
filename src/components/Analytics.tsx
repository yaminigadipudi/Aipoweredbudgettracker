import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export default function Analytics() {
  const { expenses, getTotalSpent, monthlyBudget } = useBudget();

  // Calculate category breakdown
  const categoryData: { [key: string]: number } = {};
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
      categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
    }
  });

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Monthly comparison (current vs last month)
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let lastMonthTotal = 0;
  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    if (expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear) {
      lastMonthTotal += exp.amount;
    }
  });

  const currentMonthTotal = getTotalSpent();
  const monthlyDifference = lastMonthTotal > 0 
    ? ((lastMonthTotal - currentMonthTotal) / lastMonthTotal) * 100 
    : 0;

  const monthlyComparisonData = [
    { name: 'Last Month', amount: lastMonthTotal },
    { name: 'This Month', amount: currentMonthTotal },
  ];

  // Weekly trend
  const weeklyData: { [key: string]: number } = {};
  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
      const day = expDate.toLocaleDateString('en-US', { weekday: 'short' });
      weeklyData[day] = (weeklyData[day] || 0) + exp.amount;
    }
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trendData = weekDays.map((day) => ({
    day,
    amount: weeklyData[day] || 0,
  }));

  // Colors
  const COLORS = ['#EAB308', '#FACC15', '#FDE047', '#FEF08A', '#FEF9C3'];

  // Find overspending categories
  const overspendCategories = Object.entries(categoryData)
    .map(([category, amount]) => {
      const percentage = monthlyBudget > 0 ? (amount / monthlyBudget) * 100 : 0;
      return { category, amount, percentage };
    })
    .filter((item) => item.percentage > 30)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-gray-50">Analytics</h1>
          <p className="text-yellow-500">Deep insights into your spending</p>
        </motion.div>

        {/* Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border border-yellow-500 rounded-lg p-6 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-gray-50">Monthly Insights</h2>
          </div>
          {monthlyDifference > 0 ? (
            <div className="flex items-center gap-2 text-yellow-500">
              <TrendingDown className="w-5 h-5" />
              <p>You spent {Math.abs(monthlyDifference).toFixed(0)}% less than last month 🎉</p>
            </div>
          ) : monthlyDifference < 0 ? (
            <div className="flex items-center gap-2 text-yellow-500">
              <TrendingUp className="w-5 h-5" />
              <p>You spent {Math.abs(monthlyDifference).toFixed(0)}% more than last month</p>
            </div>
          ) : (
            <p className="text-gray-400">Start tracking to see insights</p>
          )}
        </motion.div>

        {/* Overspend Alerts */}
        {overspendCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black border border-red-500/30 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-black border border-red-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-gray-50">Overspend Alerts</h2>
            </div>
            <div className="space-y-2">
              {overspendCategories.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-3 bg-neutral-950 border border-red-500/20 rounded-lg"
                >
                  <p className="text-gray-50">{item.category} Overspend</p>
                  <p className="text-red-400">+₹{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black border border-yellow-500/30 rounded-lg p-6"
          >
            <h2 className="text-gray-50 mb-4">Spending by Category</h2>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.value > monthlyBudget * 0.3 ? '#EAB308' : COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #EAB308', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </motion.div>

          {/* Monthly Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black border border-yellow-500/30 rounded-lg p-6"
          >
            <h2 className="text-gray-50 mb-4">Monthly Comparison</h2>
            {monthlyComparisonData.some(d => d.amount > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyComparisonData}>
                  <XAxis dataKey="name" stroke="#EAB308" />
                  <YAxis stroke="#EAB308" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #EAB308', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Bar dataKey="amount" fill="#EAB308" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <h2 className="text-gray-50 mb-4">Weekly Spending Trend</h2>
          {trendData.some(d => d.amount > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="day" stroke="#EAB308" />
                <YAxis stroke="#EAB308" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #EAB308', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="amount" stroke="#EAB308" strokeWidth={2} dot={{ fill: '#EAB308', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
