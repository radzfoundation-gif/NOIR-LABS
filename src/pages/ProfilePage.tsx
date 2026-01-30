import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [isPro, setIsPro] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
            } else {
                setUser(user);
            }
        };
        getUser();

        // Check for payment success
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('payment') === 'success') {
            const activatePro = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // 1. Update Database (Centralized Source of Truth)
                    const { error } = await supabase
                        .from('user_subscriptions')
                        .upsert({
                            user_id: user.id,
                            status: 'active',
                            tier: 'researcher',
                            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 days
                        }, { onConflict: 'user_id' });

                    if (error) {
                        console.error("DEBUG: DB Sync Error:", error);
                        console.log("DEBUG: Error details:", error.message, error.details);
                        alert("Database Error: " + error.message + ". Please verify you ran the SQL script.");
                    } else {
                        console.log("DEBUG: DB Sync SUCCESS! User ID:", user.id);
                        alert("DEBUG: Database Updated Successfully!");
                    }

                    // 2. Update Local State & Storage
                    setIsPro(true);
                    localStorage.setItem('nevara_is_pro', 'true');
                    window.history.replaceState({}, '', '/profile');
                }
            };
            activatePro();
        } else {
            // Check Database for existing subscription
            const checkSubscription = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from('user_subscriptions')
                        .select('status, tier')
                        .eq('user_id', user.id)
                        .single();

                    if (data?.status === 'active') {
                        setIsPro(true);
                        localStorage.setItem('nevara_is_pro', 'true');
                    } else if (localStorage.getItem('nevara_is_pro') === 'true') {
                        // Fallback for demo/testing without DB
                        setIsPro(true);
                    }
                }
            };
            checkSubscription();
        }
    }, [navigate, location]);

    useRealtimeSubscription({
        table: 'user_subscriptions',
        event: '*',
        filter: user ? `user_id=eq.${user.id}` : undefined,
        enabled: !!user,
        onData: (payload) => {
            const newData = payload.new as any;
            if (newData && newData.status === 'active') {
                setIsPro(true);
                localStorage.setItem('nevara_is_pro', 'true');
            } else {
                setIsPro(false);
                localStorage.setItem('nevara_is_pro', 'false');
            }
        }
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center font-display">
            <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="font-display text-zinc-900 bg-white selection:bg-lab-pink/30 min-h-screen relative overflow-x-hidden" style={{
            backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px'
        }}>
            {/* Floating Icons */}
            <span className="material-symbols-outlined floating-icon text-6xl text-primary top-[10%] left-[20%] rotate-12">star</span>
            <span className="material-symbols-outlined floating-icon text-5xl text-secondary top-[40%] right-[5%] -rotate-12">science</span>
            <span className="material-symbols-outlined floating-icon text-7xl text-pop-yellow bottom-[10%] left-[25%] rotate-[30deg]">flare</span>
            <span className="material-symbols-outlined floating-icon text-5xl text-accent-green top-[15%] right-[15%] rotate-12">auto_awesome</span>
            <span className="material-symbols-outlined floating-icon text-6xl text-pop-purple bottom-[15%] right-[10%] -rotate-6">rocket_launch</span>

            <div className="flex min-h-screen">
                <aside className="w-80 p-8 hidden lg:flex flex-col fixed h-full bg-white border-r-[6px] border-black z-50">
                    <Link to="/" className="flex items-center gap-3 mb-12">
                        <div className="p-2 bg-black rounded-xl">
                            <span className="material-symbols-outlined text-white text-3xl fill-1">science</span>
                        </div>
                        <span className="font-black tracking-tighter text-3xl uppercase">Noir Labs</span>
                    </Link>
                    <nav className="flex-1">
                        <Link to="/profile" className="sidebar-item active">
                            <span className="material-symbols-outlined font-black text-2xl">person</span>
                            Profile
                        </Link>
                        <Link to="/labs" className="sidebar-item">
                            <span className="material-symbols-outlined font-black text-2xl">biotech</span>
                            Experiments
                        </Link>
                        <Link to="/settings" className="sidebar-item">
                            <span className="material-symbols-outlined font-black text-2xl">settings</span>
                            Settings
                        </Link>
                    </nav>
                    <button onClick={handleLogout} className="sidebar-item bg-zinc-100 mt-auto w-full justify-start">
                        <span className="material-symbols-outlined font-black text-2xl">logout</span>
                        Logout
                    </button>
                </aside>

                {/* Mobile Header */}
                <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-4 border-black z-50 flex items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-black text-2xl fill-1">science</span>
                        <span className="font-black tracking-tighter text-xl uppercase">Noir Labs</span>
                    </Link>
                    <button onClick={handleLogout} className="text-black">
                        <span className="material-symbols-outlined font-black text-2xl">logout</span>
                    </button>
                </header>

                {/* Mobile Bottom Nav */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-4 border-black z-50 flex justify-around items-center px-2">
                    <Link to="/profile" className="flex flex-col items-center gap-1 p-2 text-black">
                        <span className="material-symbols-outlined font-black text-2xl">person</span>
                        <span className="text-[10px] font-black uppercase">Profile</span>
                    </Link>
                    <Link to="/labs" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-black transition-colors">
                        <span className="material-symbols-outlined font-black text-2xl">biotech</span>
                        <span className="text-[10px] font-black uppercase">Labs</span>
                    </Link>
                    <Link to="/settings" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-black transition-colors">
                        <span className="material-symbols-outlined font-black text-2xl">settings</span>
                        <span className="text-[10px] font-black uppercase">Settings</span>
                    </Link>
                </nav>

                <main className="flex-1 lg:ml-80 p-4 pt-20 md:p-12 md:ml-80 pb-20 lg:pb-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-20 bg-white border-[6px] border-black p-10 rounded-[3rem] shadow-neon-green">
                            <div className="relative">
                                <div className="w-48 h-48 rounded-full border-[8px] border-black overflow-hidden shadow-[12px_12px_0px_0px_#05ffa1] bg-white">
                                    <img
                                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email}`}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isPro && (
                                    <div className="absolute -bottom-4 -right-2">
                                        <div className="badge-sticker bg-pop-yellow text-black border-2 border-black font-black uppercase tracking-widest px-4 py-1 text-sm shadow-pop rotate-[-4deg]">
                                            PRO MEMBER
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left pt-4">
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4 uppercase">
                                    DR. <span className="text-lab-pink drop-shadow-[6px_6px_0px_#000]">
                                        {user.user_metadata?.full_name?.toUpperCase() || user.email?.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').toUpperCase()}
                                    </span>
                                </h1>
                                <p className="text-2xl font-bold text-zinc-500 mb-6 italic">{user.email}</p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <span className="px-4 py-2 bg-pop-yellow border-2 border-black rounded-full font-black text-sm uppercase tracking-widest">Tensor Flow Mastery</span>
                                    <span className="px-4 py-2 bg-secondary/20 border-2 border-black rounded-full font-black text-sm uppercase tracking-widest">Chaos Theory</span>
                                    <span className="px-4 py-2 bg-pop-purple/20 border-2 border-black rounded-full font-black text-sm uppercase tracking-widest">Generative Art</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-20">
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
                                <span className="w-12 h-2 bg-black"></span>
                                Your Lab Stats
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="stat-card bg-pop-yellow relative">
                                    <div className="text-5xl font-black mb-2">142</div>
                                    <div className="text-xs font-black uppercase tracking-widest text-zinc-600">Experiments Run</div>
                                    <span className="material-symbols-outlined absolute top-4 right-4 text-black/20 text-4xl">query_stats</span>
                                </div>
                                <div className="stat-card bg-accent-green relative">
                                    <div className="text-5xl font-black mb-2">8.4k</div>
                                    <div className="text-xs font-black uppercase tracking-widest text-zinc-600">Models Trained</div>
                                    <span className="material-symbols-outlined absolute top-4 right-4 text-black/20 text-4xl">memory</span>
                                </div>
                                <div className="stat-card bg-lab-pink relative">
                                    <div className="text-5xl font-black mb-2">12</div>
                                    <div className="text-xs font-black uppercase tracking-widest text-zinc-600">Active Nodes</div>
                                    <span className="material-symbols-outlined absolute top-4 right-4 text-black/20 text-4xl">hub</span>
                                </div>
                                <div className="stat-card bg-secondary relative">
                                    <div className="text-5xl font-black mb-2">99.9</div>
                                    <div className="text-xs font-black uppercase tracking-widest text-zinc-600">Accuracy %</div>
                                    <span className="material-symbols-outlined absolute top-4 right-4 text-black/20 text-4xl">target</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2">
                                <h2 className="text-4xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
                                    <span className="w-12 h-2 bg-black"></span>
                                    Recent Activities
                                </h2>
                                <div className="activity-frame">
                                    <div className="flex gap-6 items-start">
                                        <div className="bg-pop-purple p-4 border-4 border-black rounded-2xl shadow-pop">
                                            <span className="material-symbols-outlined text-3xl font-black">brush</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black">Generated image in Neural Canvas</h3>
                                            <p className="text-zinc-600 font-bold mt-1">Prompt: "Cybernetic dreams of a neon desert"</p>
                                            <div className="mt-4 text-xs font-black text-zinc-400 uppercase tracking-widest italic">2 hours ago</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="activity-frame">
                                    <div className="flex gap-6 items-start">
                                        <div className="bg-accent-green p-4 border-4 border-black rounded-2xl shadow-pop">
                                            <span className="material-symbols-outlined text-3xl font-black">terminal</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black">Deployed 'Project Ghost' to Production</h3>
                                            <p className="text-zinc-600 font-bold mt-1">Latency reduced by 40% across all nodes</p>
                                            <div className="mt-4 text-xs font-black text-zinc-400 uppercase tracking-widest italic">Yesterday</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="activity-frame">
                                    <div className="flex gap-6 items-start">
                                        <div className="bg-secondary p-4 border-4 border-black rounded-2xl shadow-pop">
                                            <span className="material-symbols-outlined text-3xl font-black">database</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black">Refined Lexicon Flux Dataset</h3>
                                            <p className="text-zinc-600 font-bold mt-1">Added 2.4 million tokens of research data</p>
                                            <div className="mt-4 text-xs font-black text-zinc-400 uppercase tracking-widest italic">3 days ago</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white border-[6px] border-black p-8 rounded-[2.5rem] shadow-pop">
                                    <h4 className="text-2xl font-black uppercase mb-6">Lab Level</h4>
                                    <div className="relative h-12 bg-zinc-100 border-4 border-black rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-accent-green border-r-4 border-black" style={{ width: '75%' }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center font-black">LVL 42 (75%)</div>
                                    </div>
                                </div>
                                <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-neon-pink">
                                    <h4 className="text-2xl font-black uppercase mb-4">Transmission Status</h4>
                                    <div className="flex items-center gap-4 text-accent-green">
                                        <span className="relative flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-green"></span>
                                        </span>
                                        <span className="font-black tracking-widest uppercase">Live Link Active</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-bold">
                                        Your lab nodes are currently syncing with the NOIR central architecture.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <footer className="lg:ml-80 py-20 text-center border-t-[6px] border-black/5 pb-24 lg:pb-20">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="font-black tracking-tighter text-3xl uppercase">Noir Labs</span>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Pop Edition V3 • Secure Lab Environment</p>
            </footer>
        </div>
    );
};

export default ProfilePage;
