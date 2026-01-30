
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const JoinPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            console.log("Attempting signup with:", { email, hasPassword: !!password, fullName });

            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (signUpError) {
                console.error("Supabase Signup Error:", signUpError);
                throw signUpError;
            }

            // Redirect or show success
            alert("Registration successful! Please check your email for confirmation.");
            navigate('/login');

        } catch (err: any) {
            console.error("Catch Error:", err);
            setError(err.message || "An unknown error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex items-center justify-center py-20 px-6 relative overflow-x-hidden">
            {/* Background Blobs & Doodles */}
            <div className="fixed filter blur-[80px] z-[-1] opacity-30 bg-lab-pink w-[30rem] h-[30rem] -top-20 -left-20 rounded-full"></div>
            <div className="fixed filter blur-[80px] z-[-1] opacity-30 bg-accent-green w-[25rem] h-[25rem] bottom-0 -right-10 rounded-full"></div>

            <div className="absolute inset-0 z-[-2]" style={{
                backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}></div>

            <main className="w-full max-w-5xl relative z-10">
                {/* Doodles */}
                <span className="material-symbols-outlined absolute text-pop-yellow text-4xl select-none pointer-events-none top-0 -left-12 rotate-12">star</span>
                <span className="material-symbols-outlined absolute text-pop-yellow text-4xl select-none pointer-events-none bottom-20 -right-8 -rotate-12">auto_awesome</span>
                <span className="material-symbols-outlined absolute text-black text-5xl select-none pointer-events-none top-[20%] -right-16 rotate-[140deg]">south_east</span>
                <span className="material-symbols-outlined absolute text-black text-5xl select-none pointer-events-none bottom-[30%] -left-20 -rotate-45">north_east</span>

                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Left Side: Headlines */}
                    <div className="flex-1 text-center md:text-left">
                        {/* Use inline styling for text stroke as Tailwind arbitrary values can be tricky with specific chromium versions sometimes */}
                        <h1 className="text-7xl md:text-[10rem] font-black leading-none tracking-tighter mb-4" style={{ WebkitTextStroke: '3px #ff71ce', color: 'transparent' }}>
                            JOIN
                        </h1>
                        <div className="inline-block px-6 py-2 bg-black text-white font-black text-xl uppercase tracking-widest -rotate-1 mb-6">
                            THE LAB.
                        </div>
                        <p className="text-2xl font-bold text-zinc-600 max-w-sm leading-tight mx-auto md:mx-0">
                            Gain exclusive access to experimental AI research and early-stage neural nodes.
                        </p>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex-1 w-full max-w-lg">
                        <div className="bg-white border-8 border-black p-10 shadow-purple-heavy relative">
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-accent-green border-4 border-black rounded-full flex items-center justify-center rotate-12 shadow-pop z-10">
                                <span className="font-black text-xs text-center">BETA ACCESS</span>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-8">
                                <div className="space-y-2 relative">
                                    <label className="block font-black text-sm uppercase tracking-wider ml-1">Research Name</label>
                                    <input
                                        className="w-full px-6 py-4 bg-white border-4 border-black text-xl font-bold placeholder:text-zinc-300 focus:ring-4 focus:ring-accent-green focus:outline-none transition-all"
                                        placeholder="Dr. Alan Turing"
                                        required
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-black text-sm uppercase tracking-wider ml-1">Direct Interface (Email)</label>
                                    <input
                                        className="w-full px-6 py-4 bg-white border-4 border-black text-xl font-bold placeholder:text-zinc-300 focus:ring-4 focus:ring-accent-green focus:outline-none transition-all"
                                        placeholder="access@noir.labs"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="block font-black text-sm uppercase tracking-wider ml-1">Secure Key (Password)</label>
                                    <input
                                        className="w-full px-6 py-4 bg-white border-4 border-black text-xl font-bold placeholder:text-zinc-300 focus:ring-4 focus:ring-accent-green focus:outline-none transition-all"
                                        placeholder="••••••••••••"
                                        required
                                        type="password"
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <p className="text-xs font-bold text-zinc-400 mt-1 ml-1 uppercase leading-tight">
                                        Must be 6+ chars with uppercase, lowercase, number & symbol
                                    </p>
                                    <span className="material-symbols-outlined absolute -right-16 top-1/2 translate-y-[-50%] text-4xl rotate-180 hidden lg:block select-none">subdirectory_arrow_left</span>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button
                                        className="w-full h-24 bg-accent-green border-4 border-black rounded-full text-3xl font-black uppercase tracking-tighter hover:bg-lab-pink transition-all active:scale-95 shadow-pop hover:shadow-pop-hover disabled:opacity-50"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Sign Up'}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-12 text-center">
                                <Link to="/login" className="relative inline-block px-4 py-2 bg-white border-2 border-black font-bold text-sm uppercase tracking-widest -rotate-2 shadow-sm hover:rotate-0 transition-transform cursor-pointer before:content-[''] before:absolute before:-left-2 before:top-0 before:h-full before:w-4 before:bg-white/40 before:backdrop-blur-sm before:-skew-x-12">
                                    Already have an account? Login
                                </Link>
                            </div>
                        </div>
                        <div className="mt-12 flex items-center justify-between text-xs font-black uppercase tracking-widest text-zinc-400">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                                Encrypted Connection
                            </div>
                            <div>v0.4.12-POP</div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-8 left-8 hidden lg:block">
                <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <span className="material-symbols-outlined text-lab-pink fill-1">science</span>
                    <span className="font-black tracking-tighter text-lg uppercase">Noir Labs</span>
                </Link>
            </div>
        </div>
    );
};

export default JoinPage;

