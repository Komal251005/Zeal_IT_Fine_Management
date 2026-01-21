import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentsAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
    FiArrowLeft,
    FiDollarSign,
    FiFileText,
    FiCalendar,
    FiCheck,
    FiUser
} from 'react-icons/fi';

const AddFine = () => {
    const { prn } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        reason: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchStudent();
    }, [prn]);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const response = await studentsAPI.getByPRN(prn);
            setStudent(response.data.data);
        } catch (err) {
            setError('Student not found');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid fine amount');
            return;
        }

        if (!formData.reason.trim()) {
            setError('Please enter a reason for the fine');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await studentsAPI.addFine(prn, {
                amount: parseFloat(formData.amount),
                reason: formData.reason.trim(),
                date: formData.date
            });

            setSuccess(true);

            // Reset form
            setFormData({
                amount: '',
                reason: '',
                date: new Date().toISOString().split('T')[0]
            });

            // Redirect after delay
            setTimeout(() => {
                navigate(`/student/${prn}`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add fine. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loading size="lg" text="Loading student details..." />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="max-w-2xl mx-auto">
                <ErrorMessage message={error || 'Student not found'} />
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/search')}
                        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        <span>Back to Search</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn max-w-2xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
            >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Add Fine</h1>
                <p className="text-gray-600 mt-1">Add a new fine to student record</p>
            </div>

            {/* Student Info */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-primary-700 rounded-full flex items-center justify-center">
                        <FiUser className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-primary-600">Adding fine to:</p>
                        <h3 className="text-lg font-semibold text-primary-800">{student.name}</h3>
                        <p className="text-sm text-primary-600">PRN: {student.prn} • {student.department}</p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <FiCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-800">Fine Added Successfully!</h3>
                            <p className="text-sm text-green-700">Redirecting to student details...</p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6">
                    <ErrorMessage message={error} onClose={() => setError('')} />
                </div>
            )}

            {/* Fine Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                            Fine Amount (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                ₹
                            </div>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                min="1"
                                step="1"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-primary-500 focus:border-primary-500 text-gray-800 
                           placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FiFileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Enter reason for the fine (e.g., Late library book return)"
                                rows="3"
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-primary-500 focus:border-primary-500 text-gray-800 
                           placeholder-gray-400 resize-none"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                            Fine Date
                        </label>
                        <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-primary-500 focus:border-primary-500 text-gray-800"
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Defaults to today if not specified</p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg 
                         hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || success}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 
                         to-amber-600 text-white font-medium rounded-lg hover:from-amber-400 
                         hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all shadow-lg shadow-amber-200"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Adding Fine...</span>
                                </>
                            ) : (
                                <>
                                    <FiDollarSign className="w-5 h-5" />
                                    <span>Add Fine</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">📋 Common Fine Reasons</h3>
                <div className="flex flex-wrap gap-2">
                    {[
                        'Late library book return',
                        'Lab equipment damage',
                        'ID card replacement',
                        'Late fee payment',
                        'Examination fee'
                    ].map((reason) => (
                        <button
                            key={reason}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, reason }))}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm 
                         text-gray-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
                        >
                            {reason}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddFine;
