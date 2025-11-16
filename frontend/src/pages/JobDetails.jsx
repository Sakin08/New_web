import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentsSection from '../components/CommentsSection';
import PosterInfo from '../components/PosterInfo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Icon placeholders
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const SalaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.419c.16-.28.28-.584.364-.904l.115-.458a1 1 0 00-.895-1.125l-.15-.022A4.5 4.5 0 003 6.942V15a1 1 0 102 0V9.077h.03c.404-.002.812-.004 1.222-.006l.044-.002c.8-.003 1.6.143 2.378.412.395.14.792.274 1.185.41.092.032.184.067.276.102.046.018.092.036.138.056l.06.027c.224.09.444.184.66.28.106.048.21.098.314.148.05.025.1.05.15.074.13.06.255.122.38.188.03.016.06.032.09.048l.058.03A3.755 3.755 0 0016 12v-1.5a1 1 0 00-1-1h-1.025a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H15a1 1 0 001-1V5.5a1 1 0 00-1-1h-1.025a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H15a1 1 0 001-1V2.5a1 1 0 00-1-1H5a1 1 0 00-1 1V4.5a1 1 0 001 1h1.025a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H5a1 1 0 00-1 1V9.94a4.502 4.502 0 004.433-2.521z" /></svg>;
const DurationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const ViewsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 3.697a1 1 0 01-.292.868L3.242 13.91a1 1 0 00-.232 1.022l1.374 2.155a1 1 0 001.494.135l2.327-2.327c.304-.304.767-.354 1.144-.121a12.004 12.004 0 004.834 1.652c.813.047 1.63.03 2.443-.054.455-.048.89.231 1.018.683l.835 3.66a1 1 0 01-.84 1.189h-2.923c-5.465 0-9.882-4.417-9.882-9.882A1 1 0 011.12 3a1 1 0 011-1z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>;
const ApplyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


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
            // Check if user is in the applicants array (assuming it's populated for the current user)
            setHasApplied(res.data.applicants?.includes(user?._id));
        } catch (err) {
            console.error('Failed to load job:', err);
        }
        setLoading(false);
    };

    const handleApply = async () => {
        if (!user) {
            alert('You must be logged in to apply for a job.');
            navigate('/login');
            return;
        }

        try {
            // Optimistic update
            setHasApplied(true);
            await axios.post(`${API_URL}/jobs/${id}/apply`, {}, {
                withCredentials: true
            });
            alert('Application submitted successfully!');
            // Reload job to get updated applicant count if necessary, but keep hasApplied true.
        } catch (err) {
            // Revert on failure
            setHasApplied(false);
            alert(err.response?.data?.message || 'Failed to apply. Make sure you are logged in and haven\'t applied already.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) return;

        try {
            await axios.delete(`${API_URL}/jobs/${id}`, {
                withCredentials: true
            });
            navigate('/jobs');
        } catch (err) {
            alert('Failed to delete job. You may not have permission.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-10 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found 🧐</h2>
                    <Link to="/jobs" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block font-medium transition duration-300">
                        ← Back to Jobs Listings
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = job.poster && user && job.poster._id === user._id;

    const jobTypeClasses = (type) => {
        switch (type) {
            case 'full-time': return 'bg-blue-600 text-white';
            case 'part-time': return 'bg-yellow-500 text-gray-900';
            case 'internship': return 'bg-purple-600 text-white';
            case 'freelance': return 'bg-teal-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <Link to="/jobs" className="text-indigo-600 hover:text-indigo-700 font-semibold mb-8 inline-flex items-center gap-2 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to All Jobs
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-200">
                    {/* Header and Action Buttons */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 border-b pb-8">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider ${jobTypeClasses(job.type)} shadow-md`}>
                                    {job.type.replace('-', ' ').toUpperCase()}
                                </span>
                                {job.applicationDeadline && (
                                    <span className="text-sm text-gray-600 flex items-center gap-1 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-4 4h.01M12 7v14M3 17h18M3 10h18M3 14h18" /></svg>
                                        Deadline: <span className="font-semibold">{formatDate(job.applicationDeadline)}</span>
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">{job.title}</h1>
                            <p className="text-xl text-indigo-600 font-semibold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 4v10M8 4v10m-4-6h16" /></svg>
                                {job.company}
                            </p>
                        </div>

                        <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {user && !isOwner && !hasApplied ? (
                                <button
                                    onClick={handleApply}
                                    className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
                                >
                                    <ApplyIcon />
                                    Apply Now
                                </button>
                            ) : user && !isOwner && hasApplied ? (
                                <button
                                    disabled
                                    className="w-full sm:w-auto px-8 py-3 bg-green-500 text-white rounded-xl font-bold text-lg cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                                >
                                    <ApplyIcon />
                                    Applied
                                </button>
                            ) : null}

                            {user && isOwner && (
                                <button
                                    onClick={handleDelete}
                                    className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition duration-300 shadow-md flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete Job
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <InfoPill icon={<LocationIcon />} label="Location" value={job.location} />
                        {job.salary && <InfoPill icon={<SalaryIcon />} label="Salary" value={job.salary} />}
                        {job.duration && <InfoPill icon={<DurationIcon />} label="Duration" value={job.duration} />}
                        <InfoPill icon={<ViewsIcon />} label="Views" value={job.views || 0} />
                    </div>

                    {/* Images Gallery */}
                    {job.images && job.images.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-3xl font-extrabold text-gray-900 border-l-4 border-indigo-500 pl-4 mb-6">
                                Images ({job.images.length})
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {job.images.map((image, idx) => (
                                    <a
                                        key={idx}
                                        href={image}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition duration-500 block transform hover:-translate-y-1"
                                    >
                                        <img
                                            src={image}
                                            alt={`${job.company} - Image ${idx + 1}`}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                                            onError={(e) => {
                                                console.error('Image failed to load:', image);
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                            <span className="text-white text-lg font-bold">View</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description Section */}
                    <Section title="Job Description">
                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{job.description}</p>
                    </Section>

                    {/* Requirements Section */}
                    {job.requirements && (
                        <Section title="Requirements">
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{job.requirements}</p>
                        </Section>
                    )}

                    {/* Skills Section */}
                    {job.skills && job.skills.length > 0 && (
                        <Section title="Required Skills">
                            <div className="flex flex-wrap gap-3">
                                {job.skills.map((skill, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-base font-medium border border-indigo-200 shadow-sm transition hover:bg-indigo-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Poster Info */}
                    <div className="mb-12 pt-8 border-t border-gray-200">
                        <PosterInfo user={job.poster} createdAt={job.createdAt} />
                    </div>

                    {/* Contact & Apply Section */}
                    <div className="border-t border-gray-200 pt-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-l-4 border-indigo-500 pl-4">Contact Information</h2>

                        {/* Contact Information Card */}
                        <div className="bg-white rounded-2xl p-6 lg:p-8 mb-8 border border-indigo-100 shadow-xl">
                            <div className="grid md:grid-cols-2 gap-8">
                                <ContactDetail icon={<EmailIcon />} label="Email" value={job.contactEmail} href={`mailto:${job.contactEmail}`} />
                                {job.contactPhone && <ContactDetail icon={<PhoneIcon />} label="Phone" value={job.contactPhone} href={`tel:${job.contactPhone}`} />}
                            </div>

                            {job.applicationLink && (
                                <div className="mt-8 pt-6 border-t border-indigo-100">
                                    <ContactDetail icon={<LinkIcon />} label="External Application Link" value={job.applicationLink} href={job.applicationLink} isLink={true} />
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 text-center mt-6">
                            This job was initially posted on <span className="font-semibold">{formatDate(job.createdAt)}</span>.
                        </p>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-200">
                    <CommentsSection postType="job" postId={id} />
                </div>
            </div>
        </div>
    );
};

export default JobDetails;

// --- Helper Components for Clean UI Structure ---

const InfoPill = ({ icon, label, value }) => (
    <div className="flex items-center bg-white rounded-xl p-5 shadow-lg border border-gray-100 transform transition hover:shadow-xl hover:-translate-y-0.5">
        <div className="p-3 bg-indigo-50 rounded-full mr-4 shadow-inner border border-indigo-100">
            {icon}
        </div>
        <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
            <div className="font-extrabold text-gray-900 text-lg">{value}</div>
        </div>
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 border-l-4 border-indigo-500 pl-4 pb-1 mb-6">{title}</h2>
        {children}
    </div>
);

const ContactDetail = ({ icon, label, value, href, isLink = false }) => (
    <div className="flex items-start">
        <div className="mt-1 mr-4 p-2 bg-indigo-100 rounded-full shadow-md">
            {icon}
        </div>
        <div>
            <div className="text-sm text-gray-600 mb-1 font-semibold uppercase tracking-wider">{label}</div>
            {isLink ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-bold break-all text-base transition duration-300 hover:underline"
                >
                    {value}
                </a>
            ) : (
                <a href={href} className="text-indigo-600 hover:text-indigo-700 font-bold text-base transition duration-300 hover:underline">
                    {value}
                </a>
            )}
        </div>
    </div>
);