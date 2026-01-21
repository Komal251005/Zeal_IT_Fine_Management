import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expenditureAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
    FiTrendingUp,
    FiTrendingDown,
    FiUsers,
    FiFileText,
    FiUpload,
    FiSearch,
    FiPlusCircle
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await expenditureAPI.getSummary();
            setSummary(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loading size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to Zeal IT Accounts Portal</p>
            </div>

            {error && (
                <div className="mb-6">
                    <ErrorMessage message={error} onClose={() => setError('')} />
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Income */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Income</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {formatCurrency(summary?.financial?.totalIncome)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">From all fines collected</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl 
                            flex items-center justify-center shadow-lg shadow-green-200">
                            <FiTrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Total Expenditure */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Expenditure</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {formatCurrency(summary?.financial?.totalExpenditure)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">All department expenses</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl 
                            flex items-center justify-center shadow-lg shadow-red-200">
                            <FiTrendingDown className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Balance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Current Balance</p>
                            <p className={`text-2xl font-bold mt-1 ${(summary?.financial?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {formatCurrency(summary?.financial?.balance)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Income - Expenditure</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl 
                            flex items-center justify-center shadow-lg shadow-primary-200">
                            <FaRupeeSign className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Total Students */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Students</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {summary?.statistics?.totalStudents || 0}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Registered in system</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl 
                            flex items-center justify-center shadow-lg shadow-purple-200">
                            <FiUsers className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-emerald-600 font-medium">Total Payments</p>
                            <p className="text-xl font-bold text-emerald-800">
                                {summary?.statistics?.totalFines || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FiUsers className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Students with Payments</p>
                            <p className="text-xl font-bold text-blue-800">
                                {summary?.statistics?.studentsWithFines || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expenditure by Category */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Expenditure by Category</h2>
                    {summary?.expenditureByCategory && summary.expenditureByCategory.length > 0 ? (
                        <div className="space-y-4">
                            {summary.expenditureByCategory.map((cat, index) => {
                                const total = summary.financial?.totalExpenditure || 1;
                                const percentage = ((cat.totalAmount / total) * 100).toFixed(1);
                                const colors = [
                                    'bg-blue-500',
                                    'bg-green-500',
                                    'bg-amber-500',
                                    'bg-purple-500',
                                    'bg-rose-500',
                                    'bg-cyan-500'
                                ];
                                return (
                                    <div key={cat._id || index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600 capitalize">{cat._id || 'Other'}</span>
                                            <span className="text-gray-800 font-medium">
                                                {formatCurrency(cat.totalAmount)} ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${colors[index % colors.length]}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No expenditure data available</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            to="/upload"
                            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br 
                         from-primary-50 to-primary-100 rounded-xl border border-primary-200 
                         hover:from-primary-100 hover:to-primary-200 transition-all group"
                        >
                            <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center 
                              mb-3 group-hover:scale-110 transition-transform">
                                <FiUpload className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-primary-800">Upload CSV</span>
                        </Link>

                        <Link
                            to="/search"
                            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br 
                         from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200 
                         hover:from-secondary-100 hover:to-secondary-200 transition-all group"
                        >
                            <div className="w-12 h-12 bg-secondary-600 rounded-xl flex items-center justify-center 
                              mb-3 group-hover:scale-110 transition-transform">
                                <FiSearch className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-secondary-800">Search Student</span>
                        </Link>

                        <Link
                            to="/expenditure"
                            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br 
                         from-amber-50 to-amber-100 rounded-xl border border-amber-200 
                         hover:from-amber-100 hover:to-amber-200 transition-all group"
                        >
                            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center 
                              mb-3 group-hover:scale-110 transition-transform">
                                <FiPlusCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-amber-800">Add Expenditure</span>
                        </Link>

                        <button
                            onClick={fetchSummary}
                            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br 
                         from-gray-50 to-gray-100 rounded-xl border border-gray-200 
                         hover:from-gray-100 hover:to-gray-200 transition-all group"
                        >
                            <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center 
                              mb-3 group-hover:scale-110 transition-transform">
                                <FiTrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-800">Refresh Data</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
