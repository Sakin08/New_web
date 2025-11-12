import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { user } = useAuth();

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const res = await axios.get(`${API_URL}/jobs`);
            setJobs(res.data);
        } catch (err) {
            console.error('Failed to load jobs:', err);
        }
        setLoading(false);
    };

    const filteredJobs = jobs.filter(job => {
        if (filter === 'all') return true;
        return job.type === filter;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">💼 Jobs & Internships</h1>
                        <p className="text-gray-600 mt-1">Find opportunities to grow your career</p>
                    </div>
                    {user && (
                        <Link
                            to="/jobs/create"
                            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition shadow-lg"
                        >
                            + Post Job
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: 'all', label: 'All Jobs', icon: '📋' },
                            { value: 'full-time', label: 'Full-Time', icon: '💼' },
                            { value: 'part-time', label: 'Part-Time', icon: '⏰' },
                            { value: 'internship', label: 'Internship', icon: '🎓' },
                            { value: 'freelance', label: 'Freelance', icon: '💻' },
                            { value: 'work-study', label: 'Work-Study', icon: '📚' }
                        ].map(({ value, label, icon }) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filter === value
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Jobs List */}
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                        <div className="text-6xl mb-3">💼</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
                        <p className="text-gray-600">Check back later for new opportunities!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map(job => (
                            <Link
                                key={job._id}
                                to={`/jobs/${job._id}`}
                                className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.type === 'full-time' ? 'bg-blue-100 text-blue-700' :
                                                    job.type === 'part-time' ? 'bg-yellow-100 text-yellow-700' :
                                                        job.type === 'internship' ? 'bg-purple-100 text-purple-700' :
                                                            job.type === 'freelance' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-700'
                                                }`}>
                                                {job.type.replace('-', ' ').toUpperCase()}
                                            </span>
                                        </div>

                                        <p className="text-lg text-indigo-600 font-semibold mb-3">{job.company}</p>

                                        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {job.location}
                                            </span>
                                            {job.salary && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {job.salary}
                                                </span>
                                            )}
                                            {job.duration && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {job.duration}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {job.views || 0} views
                                            </span>
                                        </div>

                                        {job.skills && job.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {job.skills.slice(0, 5).map((skill, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right ml-4">
                                        {job.applicationDeadline && (
                                            <div className="text-sm text-gray-500 mb-2">
                                                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-400">
                                            Posted {new Date(job.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
