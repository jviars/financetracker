import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Calculator, DollarSign, Trash2, Sun, Moon } from 'lucide-react';

const FinanceTracker = () => {
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [frequency, setFrequency] = useState('Monthly');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  // Initialize dark mode from system preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode and update document class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Colors for pie chart (adjusted for dark mode)
  const COLORS = darkMode 
    ? ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#6EE7B7', '#FCD34D', '#FC8181']
    : ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  // Calculate monthly income based on frequency
  const calculateMonthlyIncome = (amount, freq) => {
    const value = parseFloat(amount);
    switch (freq) {
      case 'Weekly':
        return value * 52 / 12;
      case 'Bi-weekly':
        return value * 26 / 12;
      case 'Yearly':
        return value / 12;
      default:
        return value;
    }
  };

  // Update monthly income when income or frequency changes
  useEffect(() => {
    setMonthlyIncome(calculateMonthlyIncome(income, frequency));
  }, [income, frequency]);

  // Add new expense
  const addExpense = () => {
    if (!category || !amount) {
      setError('Please fill in both category and amount');
      return;
    }

    try {
      const parsedAmount = parseFloat(amount);
      if (parsedAmount <= 0) throw new Error('Amount must be positive');

      const newExpense = {
        id: Date.now(),
        category,
        amount: parsedAmount,
        timestamp: new Date().toISOString()
      };

      setExpenses([...expenses, newExpense]);
      setCategory('');
      setAmount('');
      setError('');
    } catch (err) {
      setError('Please enter a valid amount');
    }
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calculate totals and percentages
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const usagePercentage = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;

  // Prepare data for pie chart
  const pieChartData = expenses.map((expense) => ({
    name: expense.category,
    value: expense.amount
  }));

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      return (
        <div className={`p-2 rounded shadow ${
          darkMode 
            ? 'bg-gray-800 text-white border border-gray-700' 
            : 'bg-white text-gray-900 border border-gray-200'
        }`}>
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">${data.value.toFixed(2)} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Theme Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
            } transition-colors duration-200`}
          >
            {darkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
        </div>

        {error && (
          <div className={`border px-4 py-3 rounded relative ${
            darkMode 
              ? 'bg-red-900 border-red-700 text-red-100' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Income Section */}
        <div className={`p-6 rounded-lg shadow-md ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        }`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <DollarSign className="mr-2 h-6 w-6" /> Income Settings
          </h2>
          <div className="flex space-x-4">
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="Enter income"
              className={`flex-1 p-2 border rounded ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={`p-2 border rounded ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Monthly Income: ${monthlyIncome.toFixed(2)}
          </div>
        </div>

        {/* Expense Form */}
        <div className={`p-6 rounded-lg shadow-md ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        }`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Calculator className="mr-2 h-6 w-6" /> Add Expense
          </h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className={`flex-1 p-2 border rounded ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className={`flex-1 p-2 border rounded ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
            <button
              onClick={addExpense}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Charts and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary Card */}
          <div className={`p-6 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4">Summary</h3>
            <div className="space-y-4">
              <div className="text-lg">
                Monthly Income: ${monthlyIncome.toFixed(2)}
              </div>
              <div className="text-lg">
                Total Expenses: ${totalExpenses.toFixed(2)}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-200 ${
                    usagePercentage > 100 
                      ? 'bg-red-500' 
                      : darkMode ? 'bg-blue-400' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Using {usagePercentage.toFixed(1)}% of monthly income
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className={`p-6 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4">Expense Distribution</h3>
            <div className="h-96 flex justify-center items-center">
              <PieChart width={500} height={350}>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={120}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(1)}%`}
                  labelLine={{ strokeWidth: 1 }}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className={`p-6 rounded-lg shadow-md ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        }`}>
          <h3 className="text-xl font-bold mb-4">Expenses</h3>
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div 
                key={expense.id} 
                className={`flex justify-between items-center p-3 rounded hover:bg-opacity-75 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div>
                  <span className="font-medium">{expense.category}</span>
                  <span className="ml-4">${expense.amount.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;