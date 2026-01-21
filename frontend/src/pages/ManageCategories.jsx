import { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiTag,
    FiCheck,
    FiX
} from 'react-icons/fi';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'fine',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryAPI.getAll();
            setCategories(response.data.data?.categories || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            if (editingId) {
                await categoryAPI.update(editingId, formData);
            } else {
                await categoryAPI.create(formData);
            }

            await fetchCategories();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setFormData({
            name: category.name,
            type: category.type,
            description: category.description || ''
        });
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await categoryAPI.delete(id);
            await fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete category');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', type: 'fine', description: '' });
        setIsAdding(false);
        setEditingId(null);
    };

    if (loading) {
        return <Loading message="Loading categories..." />;
    }

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
                    <p className="text-gray-600 mt-1">Create and manage payment categories for fines and fees</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-700 
                         to-primary-800 text-white font-medium rounded-lg hover:from-primary-600 
                         hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-200"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Category</span>
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6">
                    <ErrorMessage message={error} onClose={() => setError('')} />
                </div>
            )}

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingId ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Late Fine, ITSA Committee Fees"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                     focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                     focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                >
                                    <option value="fine">Fine</option>
                                    <option value="fee">Fee</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description (Optional)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of this category"
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                                 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white 
                                 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="w-4 h-4" />
                                        <span>{editingId ? 'Update' : 'Create'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">All Categories ({categories.length})</h2>
                </div>

                {categories.length === 0 ? (
                    <div className="p-12 text-center">
                        <FiTag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No categories yet</h3>
                        <p className="text-gray-500 mb-4">Create your first category to get started</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span>Add Category</span>
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <div key={category._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.type === 'fine' ? 'bg-red-100' : 'bg-blue-100'
                                        }`}>
                                        <FiTag className={`w-5 h-5 ${category.type === 'fine' ? 'text-red-600' : 'text-blue-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{category.name}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${category.type === 'fine'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {category.type === 'fine' ? 'Fine' : 'Fee'}
                                            </span>
                                            {category.description && (
                                                <span className="text-xs text-gray-500">{category.description}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCategories;
