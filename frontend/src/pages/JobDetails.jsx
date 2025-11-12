import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentsSection from '../components/CommentsSection';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        loadJob();
    }, [id]);

    const loadJob = async () => {
        try {
            const res = await axios.get(`${API_URL}/jobs/${id}`);
            setJob(res.data);
            setHasApplied(res.data.applicants?.includes(user?._id));
        } catch (err) {
            console.error('Failed to load job:', err);
        }
        setLoading(false);
    };

    const handleApply = async () => {
        try {
            await axios.post(`${API_URL}/jobs/${id}/apply`, {}, {
                withCredentials: true
            });
            setHasApplied(true);
            alert('Application submitted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this job posting?')) return;

        try {
            await axios.delete(`${API_URL}/jobs/${id}`, {
                withCredentials: true
            });
            navigate('/jobs');
        } catch (err) {
            alert('Failed to delete job');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
                    <Link to="/jobs" className="text-green-600 hover:text-green-700 mt-4 inline-block">
                        ← Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = job.poster._id === user?._id;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/jobs" className="text-green-600 hover:text-green-700 font-medium mb-6 inline-block">
                    ← Back to Jobs
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${job.type === 'full-time' ? 'bg-blue-100 text-blue-700' :
                                        job.type === 'part-time' ? 'bg-yellow-100 text-yellow-700' :
                                            job.type === 'internship' ? 'bg-purple-100 text-purple-700' :
                                                job.type === 'freelance' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                    }`}>
                                    {job.type.replace('-', ' ').toUpperCase()}
                                </span>
                                {job.applicationDeadline && (
                                    <span className="text-sm text-gray-600">
                                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
                            <p className="text-2xl text-green-600 font-semibold">{job.company}</p>
                        </div>

                        {user && isOwner && (
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">📍 Location</div>
                            <div className="font-semibold text-gray-900">{job.location}</div>
                        </div>

                        {job.salary && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">💰 Salary</div>
                                <div className="font-semibold text-gray-900">{job.salary}</div>
                            </div>
                        )}

                        {job.duration && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">⏱️ Duration</div>
                                <div className="font-semibold text-gray-900">{job.duration}</div>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">👁️ Views</div>
                            <div className="font-semibold text-gray-900">{job.views || 0}</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact & Apply */}
                    <div className="border-t border-gray-200 pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Apply</h2>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">📧 Email</div>
                                    <a href={`mailto:${job.contactEmail}`} className="text-green-600 hover:text-green-700 font-semibold">
                                        {job.contactEmail}
                                    </a>
                                </div>

                                {job.contactPhone && (
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">📱 Phone</div>
                                        <a href={`tel:${job.contactPhone}`} className="text-green-600 hover:text-green-700 font-semibold">
                                            {job.contactPhone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {job.applicationLink && (
                                <div className="mt-4">
                                    <div className="text-sm text-gray-600 mb-1">🔗 Application Link</div>
                                    <a
                                        href={job.applicationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 font-semibold break-all"
                                    >
                                        {job.applicationLink}
                                    </a>
                                </div>
                            )}
                        </div>

                        {user && !isOwner && (
                            <button
                                onClick={handleApply}
                                disabled={hasApplied}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition ${hasApplied
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg'
                                    }`}
                            >
                                {hasApplied ? '✓ Application Submitted' : 'Apply Now'}
                            </button>
                        )}

                        <p className="text-sm text-gray-500 text-center mt-4">
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Comments */}
                <div className="mt-6">
                    <CommentsSection postType="job" postId={id} />
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
