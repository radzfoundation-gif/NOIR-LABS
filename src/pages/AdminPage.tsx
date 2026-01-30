import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';

// CountUp Component
const CountUp = ({ value }: { value: number }) => {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 100, stiffness: 100 });
    const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    return <motion.span>{displayValue}</motion.span>;
};

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [logs, setLogs] = useState<any[]>([]);
    const [stats, setStats] = useState({ users: 0, experiments: 0 });
    const [profiles, setProfiles] = useState<any[]>([]);
    const [experiments, setExperiments] = useState<any[]>([]);
    const [waitlist, setWaitlist] = useState<any[]>([]);
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Auth Check
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
            } else if (user.email !== 'radzfoundation@gmail.com') {
                // Strict Admin Check
                console.warn('Unauthorized admin access attempt:', user.email);
                navigate('/'); // Redirect non-admins to home
            } else {
                setUser(user);
            }
        };

        const fetchData = async () => {
            // Fetch Stats
            const { count: userCount, data: profilesData } = await supabase.from('profiles').select('*', { count: 'exact' });
            const { data: waitlistData } = await supabase.from('waitlist').select('*', { count: 'exact' });
            const { count: expCount, data: expData } = await supabase.from('experiments').select('*', { count: 'exact' });
            // Removed unused deleteWaitlistUser

            // Fetch Initial Logs
            const { data: initialLogs } = await supabase
                .from('system_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            setStats({
                users: userCount || 0,
                experiments: expCount || 0
            });

            if (profilesData) setProfiles(profilesData);
            if (expData) setExperiments(expData);
            if (waitlistData) setWaitlist(waitlistData);

            if (initialLogs) {
                // Formatting logs to match the UI style
                const formattedLogs = initialLogs.reverse().map(log =>
                    `> [${new Date(log.created_at).toLocaleTimeString('en-US', { hour12: false })}] ${log.message}`
                );
                setLogs(formattedLogs);
            }
        };

        checkUser();
        fetchData();
    }, [navigate]);

    // Realtime Subscriptions

    // 1. System Logs
    useRealtimeSubscription({
        table: 'system_logs',
        event: 'INSERT',
        onData: (payload) => {
            const newLog = payload.new as any;
            const time = new Date(newLog.created_at).toLocaleTimeString('en-US', { hour12: false });
            setLogs(prev => [`> [${time}] ${newLog.message}`, ...prev].slice(0, 50)); // Keep last 50
        }
    });

    // 2. Waitlist
    useRealtimeSubscription({
        table: 'waitlist',
        onData: (payload) => {
            if (payload.eventType === 'INSERT') {
                setStats(prev => ({ ...prev, users: prev.users })); // Update count if needed, or just list
                setWaitlist(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'DELETE') {
                setWaitlist(prev => prev.filter(item => item.id !== (payload.old as any).id));
            } else if (payload.eventType === 'UPDATE') {
                setWaitlist(prev => prev.map(item => item.id === (payload.new as any).id ? payload.new : item));
            }
        }
    });

    // 3. Profiles (Users)
    useRealtimeSubscription({
        table: 'profiles',
        onData: (payload) => {
            if (payload.eventType === 'INSERT') {
                setStats(prev => ({ ...prev, users: prev.users + 1 }));
                setProfiles(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
                setProfiles(prev => prev.map(item => item.id === (payload.new as any).id ? payload.new : item));
            }
            // Handle DELETE if necessary
        }
    });

    // 4. Experiments
    useRealtimeSubscription({
        table: 'experiments',
        onData: (payload) => {
            if (payload.eventType === 'INSERT') {
                setStats(prev => ({ ...prev, experiments: prev.experiments + 1 }));
                setExperiments(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
                setExperiments(prev => prev.map(item => item.id === (payload.new as any).id ? payload.new : item));
            }
        }
    });

    if (!user) return null;

    const renderDashboard = () => (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="border-[4px] border-black p-6 bg-white transition-all hover:-translate-x-1 hover:-translate-y-1 shadow-brutal-green">
                    <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Total Users</div>
                    <div className="text-5xl font-black italic"><CountUp value={stats.users} /></div>
                    <div className="mt-4 flex items-center gap-2 text-accent-green font-black">
                        <span className="material-symbols-outlined">trending_up</span>
                        <span>Live</span>
                    </div>
                </div>
                <div className="border-[4px] border-black p-6 bg-white transition-all hover:-translate-x-1 hover:-translate-y-1 shadow-brutal-pink">
                    <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Active Experiments</div>
                    <div className="text-5xl font-black italic"><CountUp value={stats.experiments} /></div>
                    <div className="mt-4 flex items-center gap-2 text-lab-pink font-black">
                        <span className="material-symbols-outlined">science</span>
                        <span>On Network</span>
                    </div>
                </div>
                <div className="border-[4px] border-black p-6 bg-white transition-all hover:-translate-x-1 hover:-translate-y-1 shadow-brutal-blue">
                    <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Feedback Score</div>
                    <div className="text-5xl font-black italic"><CountUp value={9.2} /></div>
                    <div className="mt-4 flex items-center gap-2 text-secondary font-black">
                        <span className="material-symbols-outlined">sentiment_very_satisfied</span>
                        <span>High Praise</span>
                    </div>
                </div>
                <div className="border-[4px] border-black p-6 bg-white transition-all hover:-translate-x-1 hover:-translate-y-1 shadow-brutal">
                    <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">System Load</div>
                    <div className="text-5xl font-black italic"><CountUp value={32} />%</div>
                    <div className="mt-4 flex items-center gap-2 text-black font-black">
                        <span className="material-symbols-outlined">memory</span>
                        <span>Stable</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 border-[4px] border-black bg-white p-4 md:p-8 shadow-brutal-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">System Health</h2>
                        <span className="font-black text-sm text-zinc-400">FLUX_CORE_01</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="relative w-16 h-20 flex-shrink-0 hidden md:block">
                            <div className="absolute inset-0 border-[4px] border-black bg-zinc-100 z-10" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 70% 35%, 100% 85%, 100% 100%, 0% 100%, 0% 85%, 30% 35%)' }}></div>
                            <div className="absolute bottom-0 left-0 w-full bg-accent-green z-20" style={{ height: '78%', clipPath: 'polygon(30% 0%, 70% 0%, 70% 35%, 100% 85%, 100% 100%, 0% 100%, 0% 85%, 30% 35%)' }}></div>
                        </div>
                        <div className="flex-grow w-full">
                            <div className="flex justify-between mb-2">
                                <span className="font-black text-sm uppercase tracking-widest">Research Progress</span>
                                <span className="font-black text-sm">78.4%</span>
                            </div>
                            <div className="w-full h-8 border-[4px] border-black bg-white overflow-hidden p-1">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '78.4%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-accent-green border-0"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                    <div className="border-[4px] border-black bg-black text-accent-green p-4 font-mono text-xs overflow-hidden rounded-none h-48 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="ml-4 text-[10px] text-zinc-500 uppercase tracking-widest">Real-time Logs</span>
                        </div>
                        <div className="space-y-1">
                            {logs.map((log, i) => (
                                <p key={i} className={i === logs.length - 1 ? "text-white animate-pulse" : ""}>{log}</p>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <div className="border-[4px] border-black bg-white p-6 shadow-brutal">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="border-[4px] border-black bg-accent-green p-4 flex flex-col items-center justify-center gap-2 font-black text-xs uppercase tracking-tighter shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                                Deploy
                            </button>
                            <button className="border-[4px] border-black bg-pop-yellow p-4 flex flex-col items-center justify-center gap-2 font-black text-xs uppercase tracking-tighter shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                <span className="material-symbols-outlined text-3xl">file_export</span>
                                Export
                            </button>
                            <button className="border-[4px] border-black bg-lab-pink text-white p-4 flex flex-col items-center justify-center gap-2 font-black text-xs uppercase tracking-tighter shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                <span className="material-symbols-outlined text-3xl">campaign</span>
                                Broadcast
                            </button>
                            <button className="border-[4px] border-black bg-secondary text-white p-4 flex flex-col items-center justify-center gap-2 font-black text-xs uppercase tracking-tighter shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                <span className="material-symbols-outlined text-3xl">add_box</span>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderExperiments = () => (
        <div className="border-[4px] border-black bg-white p-8 shadow-brutal-lg">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Active Experiments</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-4 font-black uppercase tracking-neobrutal">ID</th>
                            <th className="p-4 font-black uppercase tracking-neobrutal">Experiment Name</th>
                            <th className="p-4 font-black uppercase tracking-neobrutal">Status</th>
                            <th className="p-4 font-black uppercase tracking-neobrutal">Created At</th>
                            <th className="p-4 font-black uppercase tracking-neobrutal">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="font-bold border-[4px] border-black">
                        {experiments.map((exp) => (
                            <tr key={exp.id} className="border-b-[2px] border-black hover:bg-zinc-50">
                                <td className="p-4 font-mono text-sm">{exp.id.slice(0, 8)}</td>
                                <td className="p-4">{exp.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 border-2 border-black text-xs font-black uppercase tracking-widest ${exp.status === 'active' ? 'bg-accent-green' : 'bg-pop-yellow'
                                        }`}>
                                        {exp.status}
                                    </span>
                                </td>
                                <td className="p-4 text-zinc-500">{new Date(exp.created_at).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <button className="p-2 bg-black text-white hover:bg-lab-pink hover:text-black transition-colors border-2 border-black">
                                        <span className="material-symbols-outlined text-sm font-black">play_arrow</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const updateProduct = async (userId: string, product: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ active_product: product })
            .eq('id', userId);

        if (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        } else {
            // Optimistic update
            setProfiles(prev => prev.map(p => p.id === userId ? { ...p, active_product: product } : p));
        }
    };


    const renderUserMatrix = () => (
        <div className="border-[4px] border-black bg-white p-8 shadow-brutal-lg">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">User Matrix</h2>
            <motion.div
                className="grid grid-cols-1 gap-4"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                {profiles.map((profile) => (
                    <motion.div
                        key={profile.id}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 }
                        }}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border-[4px] border-black hover:bg-zinc-50 transition-all hover:translate-x-1 hover:translate-y-1 shadow-brutal-sm gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-white shrink-0">
                                <img
                                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.email}`}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-black text-lg uppercase">{profile.full_name || 'Anonymous User'}</h3>
                                <p className="text-sm font-bold text-zinc-500">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-xs uppercase">Product:</span>
                                <select
                                    value={profile.active_product || 'None'}
                                    onChange={(e) => updateProduct(profile.id, e.target.value)}
                                    className="bg-white border-2 border-black px-2 py-1 font-black text-xs uppercase focus:ring-0 focus:outline-none shadow-brutal-sm"
                                >
                                    <option value="None">None</option>
                                    <option value="Noir AI">Noir AI</option>
                                    <option value="Noir Code">Noir Code</option>
                                </select>
                            </div>
                            <span className="font-mono text-xs bg-zinc-100 px-2 py-1 border-2 border-black">{profile.role}</span>
                            <button className="px-4 py-2 bg-red-500 text-white font-black uppercase text-xs border-2 border-black hover:shadow-pop transition-shadow">
                                BAN
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );

    const renderWaitlist = () => (
        <div className="border-[4px] border-black bg-white p-8 shadow-brutal-lg">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 bg-zinc-100 inline-block px-4 py-2 border-2 border-black transform -rotate-1">Waitlist Applicants</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-black text-white px-4">
                        <tr>
                            <th className="p-4 font-black uppercase tracking-neobrutal border-b-4 border-black">Email Node</th>
                            <th className="p-4 font-black uppercase tracking-neobrutal border-b-4 border-black">Requested At</th>
                            <th className="p-4 font-black uppercase tracking-neobrutal border-b-4 border-black">Status</th>
                            <th className="p-4 font-black uppercase tracking-neobrutal border-b-4 border-black text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="font-bold">
                        {waitlist.map((entry) => (
                            <tr key={entry.id} className="border-b-[2px] border-black hover:bg-pop-yellow/10 transition-colors group">
                                <td className="p-4 font-mono text-sm border-r-2 border-black">{entry.email}</td>
                                <td className="p-4 text-zinc-500 border-r-2 border-black">{new Date(entry.created_at).toLocaleString()}</td>
                                <td className="p-4 border-r-2 border-black">
                                    <span className="bg-zinc-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-zinc-400 group-hover:bg-pop-yellow group-hover:border-black transition-colors">Pending</span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="bg-accent-green text-black px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black hover:shadow-pop hover:-translate-y-1 transition-all mr-2">
                                        Invite
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {waitlist.length === 0 && (
                    <div className="p-12 text-center text-zinc-400 font-bold uppercase tracking-widest border-[4px] border-t-0 border-black bg-zinc-50 border-dashed">
                        No applicants yet.
                    </div>
                )}
            </div>
        </div>
    );

    const renderPlaceholder = (title: string) => (
        <div className="border-[4px] border-black bg-white p-12 shadow-brutal-lg flex flex-col items-center justify-center text-center h-96">
            <span className="material-symbols-outlined text-6xl mb-4 animate-bounce">construction</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">{title}</h2>
            <p className="font-bold text-zinc-500">This sector is currently under development.</p>
        </div>
    );

    // Sidebar Item Component for cleaner code
    const SidebarItem = ({ id, icon, label }: { id: string, icon: string, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 px-6 py-4 border-[4px] border-black mb-4 font-black text-sm uppercase tracking-widest transition-all ${activeTab === id
                ? 'bg-accent-green translate-x-2 shadow-brutal'
                : 'bg-white hover:bg-pop-yellow hover:translate-x-1'
                }`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
        </button>
    );

    return (
        <div className="font-display text-black bg-white selection:bg-accent-green/30 min-h-screen overflow-hidden flex" style={{
            backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
        }}>
            {/* Floating Icons */}
            <span className="material-symbols-outlined absolute pointer-events-none opacity-20 select-none z-0 text-7xl text-lab-pink top-10 left-1/4 rotate-12">science</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-20 select-none z-0 text-6xl text-secondary bottom-20 right-1/4 -rotate-12">bolt</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-20 select-none z-0 text-5xl text-pop-yellow top-1/2 left-10 rotate-45">flare</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-20 select-none z-0 text-8xl text-pop-purple top-20 right-10 -rotate-6">auto_awesome</span>

            <aside className="hidden lg:flex w-72 border-r-[4px] border-black bg-white p-6 z-10 flex-col overflow-y-auto h-screen sticky top-0 no-scrollbar">
                <Link to="/" className="flex items-center gap-3 mb-12">
                    <div className="p-2 border-[4px] border-black bg-black">
                        <span className="material-symbols-outlined text-white text-3xl fill-1">science</span>
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase leading-none">NOIR<br />LABS</span>
                </Link>
                <nav className="flex-grow space-y-4">
                    <SidebarItem id="dashboard" icon="dashboard" label="Command Center" />
                    <SidebarItem id="experiments" icon="biotech" label="Experiments" />
                    <SidebarItem id="users" icon="group" label="User Matrix" />
                    <SidebarItem id="waitlist" icon="hourglass_top" label="Waitlist" />
                    <SidebarItem id="data" icon="database" label="Data Vault" />
                    <SidebarItem id="settings" icon="settings" label="System Core" />
                </nav>
                <div className="mt-auto p-4 border-[4px] border-black bg-pop-purple text-white font-black text-center text-xs uppercase tracking-widest shadow-brutal">
                    V3 POP EDITION
                </div>
            </aside>

            {/* Mobile Header with Scrollable Nav */}
            <header className="lg:hidden fixed top-0 w-full bg-white border-b-4 border-black z-50">
                <div className="flex items-center justify-between p-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="p-1 border-[2px] border-black bg-black">
                            <span className="material-symbols-outlined text-white text-xl fill-1">science</span>
                        </div>
                        <span className="font-black text-lg tracking-tighter uppercase leading-none">NOIR LABS</span>
                    </Link>
                    <button onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}>
                        <span className="material-symbols-outlined font-black">logout</span>
                    </button>
                </div>
                <div className="overflow-x-auto no-scrollbar px-4 pb-2 flex gap-4">
                    <button onClick={() => setActiveTab('dashboard')} className={`whitespace-nowrap px-3 py-1 border-[2px] border-black uppercase font-black text-xs ${activeTab === 'dashboard' ? 'bg-accent-green' : 'bg-white'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('experiments')} className={`whitespace-nowrap px-3 py-1 border-[2px] border-black uppercase font-black text-xs ${activeTab === 'experiments' ? 'bg-accent-green' : 'bg-white'}`}>Experiments</button>
                    <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap px-3 py-1 border-[2px] border-black uppercase font-black text-xs ${activeTab === 'users' ? 'bg-accent-green' : 'bg-white'}`}>Users</button>
                    <button onClick={() => setActiveTab('waitlist')} className={`whitespace-nowrap px-3 py-1 border-[2px] border-black uppercase font-black text-xs ${activeTab === 'waitlist' ? 'bg-accent-green' : 'bg-white'}`}>Waitlist</button>
                    <button onClick={() => setActiveTab('data')} className={`whitespace-nowrap px-3 py-1 border-[2px] border-black uppercase font-black text-xs ${activeTab === 'data' ? 'bg-accent-green' : 'bg-white'}`}>Data</button>
                    <button onClick={() => setActiveTab('settings')} className={`whitespace-nowrap px-3 py-1 border-[2px] border-black uppercase font-black text-xs ${activeTab === 'settings' ? 'bg-accent-green' : 'bg-white'}`}>Settings</button>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto p-4 pt-40 md:p-8 md:pt-8 relative z-10 h-screen no-scrollbar">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
                    <div>
                        <div className="inline-block bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            Admin Session / Active
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
                            {activeTab === 'dashboard' && <>Command<br /><span className="text-lab-pink drop-shadow-[4px_4px_0px_#000]">Center</span></>}
                            {activeTab === 'experiments' && <>Lab<br /><span className="text-secondary drop-shadow-[4px_4px_0px_#000]">Experiments</span></>}
                            {activeTab === 'users' && <>User<br /><span className="text-pop-yellow drop-shadow-[4px_4px_0px_#000]">Matrix</span></>}
                            {activeTab === 'waitlist' && <>Access<br /><span className="text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">Requests</span></>}
                            {activeTab === 'data' && <>Data<br /><span className="text-accent-green drop-shadow-[4px_4px_0px_#000]">Vault</span></>}
                            {activeTab === 'settings' && <>System<br /><span className="text-pop-purple drop-shadow-[4px_4px_0px_#000]">Core</span></>}
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="border-[4px] border-black bg-white px-6 py-3 flex items-center gap-3 shadow-brutal">
                            <div className="w-3 h-3 bg-accent-green rounded-full border-2 border-black animate-pulse"></div>
                            <span className="font-black text-sm uppercase tracking-widest">System Online</span>
                        </div>
                        <button className="border-[4px] border-black bg-pop-yellow p-3 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </header>

                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'experiments' && renderExperiments()}
                {activeTab === 'users' && renderUserMatrix()}
                {activeTab === 'waitlist' && renderWaitlist()}
                {activeTab === 'data' && renderPlaceholder('Data Vault')}
                {activeTab === 'settings' && renderPlaceholder('System Core')}

            </main>
            <div className="hidden lg:flex w-16 border-l-[4px] border-black bg-white flex-col items-center py-8 gap-8 h-screen sticky top-0">
                <div className="w-10 h-10 rounded-full border-[4px] border-black bg-lab-pink overflow-hidden">
                    <img
                        alt="avatar"
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.email || 'admin'}`}
                        className="w-full h-full object-cover"
                    />
                </div>
                {['alex', 'felix'].map((seed, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-[4px] border-black overflow-hidden ${i === 0 ? 'bg-secondary' : 'bg-pop-yellow'}`}>
                        <img
                            alt="avatar"
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                            className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                        />
                    </div>
                ))}

                <div className="flex-grow"></div>
                <button
                    onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}
                    className="w-10 h-10 border-[4px] border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminPage;
