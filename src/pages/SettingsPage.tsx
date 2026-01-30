
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Preferences State
    const [preferences, setPreferences] = useState({
        hallucinationMode: true,
        quantumProcessing: false,
        theme: 'light',
        username: '',
        email: ''
    });

    useEffect(() => {
        const getProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }
                setUser(user);

                // Fetch expanded profile data including preferences
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error);
                }

                if (profile) {
                    setPreferences({
                        hallucinationMode: profile.preferences?.hallucinationMode ?? true,
                        quantumProcessing: profile.preferences?.quantumProcessing ?? false,
                        theme: profile.preferences?.theme ?? 'light',
                        username: profile.username || user.user_metadata?.full_name || '',
                        email: user.email || ''
                    });
                } else {
                    setPreferences(prev => ({
                        ...prev,
                        email: user.email || '',
                        username: user.user_metadata?.full_name || ''
                    }));
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [navigate]);

    const saveSettings = async (newPreferences: any) => {
        setSaving(true);
        try {
            if (!user) return;

            const updates = {
                id: user.id,
                username: newPreferences.username, // Assuming username column exists in profiles, otherwise remove
                preferences: {
                    hallucinationMode: newPreferences.hallucinationMode,
                    quantumProcessing: newPreferences.quantumProcessing,
                    theme: newPreferences.theme
                },
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = (key: string) => {
        const newPrefs = { ...preferences, [key]: !preferences[key as keyof typeof preferences] };
        setPreferences(newPrefs);
        saveSettings(newPrefs);
    };

    const handleThemeChange = (theme: string) => {
        const newPrefs = { ...preferences, theme };
        setPreferences(newPrefs);
        saveSettings(newPrefs);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    const handleInputBlur = () => {
        saveSettings(preferences);
    };

    if (loading) return null; // Or a spinner

    return (
        <div className="bg-white font-display text-zinc-900 min-h-screen relative overflow-x-hidden selection:bg-lab-pink/30">
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 z-0" style={{
                backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px' // Smaller pattern
            }}></div>

            {/* Floating Icons - Smaller */}
            <span className="material-symbols-outlined absolute pointer-events-none opacity-40 select-none text-4xl text-lab-pink top-[10%] left-[5%] rotate-12">science</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-40 select-none text-3xl text-secondary top-[40%] right-[5%] -rotate-12">bolt</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-40 select-none text-5xl text-pop-yellow bottom-[10%] left-[8%] rotate-[30deg]">biotech</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-40 select-none text-3xl text-accent-green top-[20%] right-[15%] rotate-12">terminal</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-40 select-none text-4xl text-pop-purple bottom-[15%] right-[12%] -rotate-6">hub</span>

            <header className="fixed top-6 left-0 right-0 z-[100] px-4">
                <nav className="mx-auto max-w-fit bg-white border-2 border-black shadow-pop transition-all hover:-translate-y-0.5 rounded-full px-4 py-2 flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2 pr-4 border-r-2 border-black group">
                        <span className="material-symbols-outlined text-lab-pink font-black text-xl">science</span>
                        <span className="font-black tracking-tighter text-lg uppercase">Noir Labs</span>
                    </Link>
                    <Link to="/profile" className="px-4 py-1 text-xs font-black hover:bg-pop-yellow rounded-full transition-colors border-2 border-transparent hover:border-black uppercase tracking-widest">
                        Return to Profile
                    </Link>
                    <div className="ml-1 flex items-center gap-2">
                        {saving && <span className="text-[10px] font-black uppercase text-accent-green animate-pulse">Saving...</span>}
                        <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] border-2 border-black hidden md:block">
                            V3
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative z-10 pt-32 pb-20 px-4 flex flex-col items-center">
                <div className="max-w-3xl w-full">
                    <div className="bg-white border-4 border-black rounded-[2rem] shadow-neon-pink p-6 md:p-10 relative transition-all duration-300">
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-10 border-b-4 border-black/10">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-black bg-pop-yellow flex items-center justify-center overflow-hidden shadow-pop">
                                    <img
                                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${preferences.email}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute -bottom-1 -right-1 bg-accent-green border-2 border-black p-1.5 rounded-full shadow-pop hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-sm font-black">edit</span>
                                </button>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">User Settings</h1>
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">ID: {user?.id.slice(0, 8)}</p>
                            </div>
                        </div>

                        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                            <section>
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                                    <span className="p-1.5 bg-pop-yellow border-2 border-black rounded-lg">
                                        <span className="material-symbols-outlined block text-lg">person</span>
                                    </span>
                                    Account
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-wide ml-1">Username</label>
                                        <input
                                            name="username"
                                            className="w-full bg-white border-2 border-black p-3 rounded-xl font-bold text-base outline-none focus:ring-2 focus:ring-lab-pink focus:border-black transition-all placeholder:text-zinc-300"
                                            type="text"
                                            value={preferences.username}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-wide ml-1">Email Node</label>
                                        <input
                                            name="email"
                                            className="w-full bg-zinc-100 border-2 border-black p-3 rounded-xl font-bold text-base outline-none text-zinc-500 cursor-not-allowed"
                                            type="email"
                                            value={preferences.email}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                                    <span className="p-1.5 bg-accent-green border-2 border-black rounded-lg">
                                        <span className="material-symbols-outlined block text-lg">psychology</span>
                                    </span>
                                    Preferences
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border-2 border-black rounded-2xl bg-zinc-50">
                                        <div>
                                            <h3 className="text-base font-black">Neural Hallucination</h3>
                                            <p className="font-bold text-xs text-zinc-500">Allow experimental responses</p>
                                        </div>
                                        <button
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full border-2 border-black transition-colors focus:outline-none ${preferences.hallucinationMode ? 'bg-accent-green' : 'bg-gray-200'}`}
                                            type="button"
                                            onClick={() => handleToggle('hallucinationMode')}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform border border-black ${preferences.hallucinationMode ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border-2 border-black rounded-2xl bg-zinc-50">
                                        <div>
                                            <h3 className="text-base font-black">Quantum Processing</h3>
                                            <p className="font-bold text-xs text-zinc-500">Enable faster compute (Pro)</p>
                                        </div>
                                        <button
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full border-2 border-black transition-colors focus:outline-none ${preferences.quantumProcessing ? 'bg-accent-green' : 'bg-gray-200'}`}
                                            type="button"
                                            onClick={() => handleToggle('quantumProcessing')}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform border border-black ${preferences.quantumProcessing ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                                    <span className="p-1.5 bg-secondary border-2 border-black rounded-lg">
                                        <span className="material-symbols-outlined block text-lg">palette</span>
                                    </span>
                                    Theme
                                </h2>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {['light', 'dark', 'high-contrast'].map((themeName) => (
                                        <div
                                            key={themeName}
                                            className={`flex flex-col items-center justify-center gap-2 p-4 bg-white border-2 border-black rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-pop hover:bg-pop-yellow cursor-pointer select-none text-center flex-1 capitalize ${preferences.theme === themeName ? 'bg-accent-green -translate-y-1 shadow-pop-hover' : ''}`}
                                            onClick={() => handleThemeChange(themeName)}
                                        >
                                            <span className="material-symbols-outlined text-2xl">
                                                {themeName === 'light' ? 'light_mode' : themeName === 'dark' ? 'dark_mode' : 'hdr_strong'}
                                            </span>
                                            {themeName.replace('-', ' ')}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                                    <span className="p-1.5 bg-pop-purple border-2 border-black rounded-lg">
                                        <span className="material-symbols-outlined text-white block text-lg">security</span>
                                    </span>
                                    Security
                                </h2>
                                <button className="w-full text-left p-4 border-2 border-black rounded-2xl flex items-center justify-between hover:bg-pop-yellow transition-colors group" type="button">
                                    <div>
                                        <h3 className="text-base font-black">Two-Factor Auth</h3>
                                        <p className="font-bold text-xs text-zinc-500">Recommended for safety</p>
                                    </div>
                                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                                </button>
                            </section>

                            <div className="pt-8 relative">
                                <div className="absolute -top-3 -left-2 bg-pop-yellow border-2 border-black p-2 rounded-xl rotate-[-6deg] shadow-sm z-20 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-danger font-black text-sm">warning</span>
                                    <span className="font-black text-[10px]">CRITICAL</span>
                                </div>
                                <button className="bg-danger text-white border-2 border-black rounded-full font-black text-lg py-4 px-8 shadow-danger-glow hover:-translate-y-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 w-full md:w-auto mt-8" type="button">
                                    DELETE DATA
                                    <span className="material-symbols-outlined text-2xl">delete_forever</span>
                                </button>
                                <p className="text-center mt-4 font-black text-danger uppercase tracking-widest text-[10px]">
                                    Irreversible action.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="pt-8 pb-20 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="p-1.5 bg-black rounded-md">
                        <span className="material-symbols-outlined text-white text-xl fill-1">science</span>
                    </div>
                    <span className="font-black tracking-tighter text-2xl uppercase">Noir Labs</span>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Pop Edition V3 • Secure Node</p>
            </footer>
        </div>
    );
};

export default SettingsPage;
