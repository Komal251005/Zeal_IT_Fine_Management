import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import {
    FiSearch,
    FiUser,
    FiMail,
    FiPhone,
    FiBook,
    FiChevronRight,
    FiAlertCircle
} from 'react-icons/fi';

const SearchStudent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [student, setStudent] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setError('Please enter a PRN to search');
            return;
        }

        setIsSearching(true);
        setError('');
        setStudent(null);
        setHasSearched(true);

        try {
            const response = await studentsAPI.searchByPRN(searchQuery.trim());
            setStudent(response.data.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setStudent(null);
            } else {
                setError(err.response?.data?.message || 'Failed to search student');
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleViewDetails = () => {
        if (student) {
            navigate(`/student/${student.prn}`);
        }
    };

    const handleAddPayment = () => {
        if (student) {
            navigate(`/add-payment/${student.prn}`);
        }
    };

    return (
        <div className="animate-fadeIn max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Search Student</h1>
                <p className="text-gray-600 mt-1">Find students by their PRN number</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter student PRN (e.g., PRN001)"
                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-primary-500 focus:border-primary-500 text-gray-800 
                         placeholder-gray-400 text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r 
                       from-primary-700 to-primary-800 text-white font-medium rounded-xl 
                       hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 
                       disabled:cursor-not-allowed transition-all duration-200 
                       shadow-lg shadow-primary-200"
                    >
                        {isSearching ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Searching...</span>
                            </>
                        ) : (
                            <>
                                <FiSearch className="w-5 h-5" />
                                <span>Search</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mb-6">
                    <ErrorMessage message={error} onClose={() => setError('')} />
                </div>
            )}

            {/* Loading State */}
            {isSearching && (
                <div className="flex justify-center py-12">
                    <Loading size="md" text="Searching for student..." />
                </div>
            )}

            {/* No Results */}
            {hasSearched && !isSearching && !student && !error && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiAlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No Student Found</h3>
                    <p className="text-gray-500">
                        No student found with PRN: <strong>{searchQuery}</strong>
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Please check the PRN and try again
                    </p>
                </div>
            )}

            {/* Student Result Card */}
            {student && !isSearching && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
                    {/* Student Header */}
                    <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <FiUser className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{student.name}</h2>
                                <p className="text-white/80 text-sm mt-1">PRN: {student.prn}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FiBook className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                                    <p className="text-sm font-medium text-gray-800">{student.department || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FiMail className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                    <p className="text-sm font-medium text-gray-800 truncate">{student.email || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FiPhone className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                    <p className="text-sm font-medium text-gray-800">{student.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold text-amber-600">₹</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Fines</p>
                                    <p className="text-sm font-bold text-amber-600">
                                        ₹{student.totalFines?.toLocaleString('en-IN') || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleViewDetails}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 
                           bg-primary-700 text-white font-medium rounded-lg 
                           hover:bg-primary-600 transition-colors"
                            >
                                <span>View Full Details</span>
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleAddPayment}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 
                           bg-amber-500 text-white font-medium rounded-lg 
                           hover:bg-amber-400 transition-colors"
                            >
                                <span>Add Payment</span>
                                <span className="font-bold">₹</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">💡 Search Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Enter the complete PRN number for accurate results</li>
                    <li>• PRN is case-insensitive</li>
                    <li>• Contact admin if student is not found in the system</li>
                </ul>
            </div>
        </div>
    );
};

export default SearchStudent;
