import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const WaitlistPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('waitlist').insert([{ email }]);
            if (error) throw error;

            // Send Waitlist Email
            import('../lib/unosend').then(({ sendWaitlistEmail }) => {
                sendWaitlistEmail(email);
            });

            setSubmitted(true);
        } catch (error: any) {
            console.error('Error joining waitlist:', error);
            // If error is 409 (Conflict/Duplicate), treat as success (Idempotent)
            if (error.code === '23505' || error.status === 409) {
                setSubmitted(true);
            } else {
                alert('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="bg-white font-display text-zinc-900 min-h-screen flex items-center justify-center p-6 relative overflow-hidden selection:bg-lab-pink/30">
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 z-0" style={{
                backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}></div>

            {/* Floating Icons */}
            <span className="material-symbols-outlined absolute text-zinc-200 pointer-events-none select-none -z-10 text-8xl top-10 left-10 rotate-12">science</span>
            <span className="material-symbols-outlined absolute text-zinc-200 pointer-events-none select-none -z-10 text-9xl bottom-10 right-10 -rotate-12">biotech</span>
            <span className="material-symbols-outlined absolute text-zinc-200 pointer-events-none select-none -z-10 text-6xl top-[40%] right-[15%] rotate-45">bolt</span>
            <span className="material-symbols-outlined absolute text-zinc-200 pointer-events-none select-none -z-10 text-7xl bottom-[20%] left-[10%] -rotate-6">memory</span>
            <span className="material-symbols-outlined absolute text-zinc-200 pointer-events-none select-none -z-10 text-5xl top-20 right-1/4 rotate-12">hub</span>

            <header className="fixed top-4 left-0 right-0 z-[100] px-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white border-2 border-black p-2 rounded-lg shadow-pop hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        <span className="material-symbols-outlined text-black font-black">arrow_back</span>
                    </div>
                </Link>
            </header>

            <main className="relative w-full max-w-2xl">
                {/* Stickers */}
                <div className="absolute p-3 font-black text-xs border-2 border-black bg-pop-yellow shadow-sticker select-none z-20 top-[-20px] left-[-40px] -rotate-12 uppercase tracking-tighter">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        TOP SECRET
                    </span>
                </div>
                <div className="absolute p-3 font-black text-xs border-2 border-black bg-lab-pink text-white shadow-sticker select-none z-20 bottom-[-10px] right-[-30px] rotate-6 uppercase">
                    BETA TESTER
                </div>
                <div className="absolute p-3 font-black text-xs border-2 border-black bg-secondary text-white shadow-sticker select-none z-20 top-1/4 right-[-50px] rotate-12 uppercase">
                    EXP V.0.4
                </div>

                <div className="bg-white border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-purple-heavy relative z-10 text-center">
                    <header className="mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-lab-pink fill-1 text-lg">science</span>
                            <span className="font-bold tracking-tighter text-lg uppercase">Noir Labs</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-[900] tracking-tight leading-tight mb-4 relative inline-block">
                            <span className="relative z-10">GET EARLY ACCESS</span>
                            <span className="absolute inset-0 text-lab-pink translate-x-1 translate-y-1 -z-10 blur-[1px]">GET EARLY ACCESS</span>
                        </h1>
                        <p className="text-lg md:text-xl font-bold text-zinc-600 max-w-sm mx-auto leading-snug">
                            Be the first to experiment with our latest AI models.
                        </p>
                    </header>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                            <div className="relative group">
                                <input
                                    className="w-full px-5 py-3 rounded-xl border-4 border-black font-bold text-lg focus:ring-0 focus:border-accent-green transition-colors outline-none placeholder:text-zinc-400 bg-white"
                                    placeholder="your@email.com"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button className="w-full h-16 bg-accent-green text-black border-4 border-black rounded-full font-[900] text-xl tracking-tight hover:scale-105 active:scale-95 transition-all shadow-pop flex items-center justify-center gap-3" type="submit">
                                CLAIM MY SPOT
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </button>
                        </form>
                    ) : (
                        <div className="bg-accent-green/10 border-4 border-accent-green p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-accent-green border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-pop">
                                <span className="material-symbols-outlined text-black text-3xl font-black">check</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-2">You're on the list!</h3>
                            <p className="font-bold text-zinc-600">Keep an eye on your inbox for your exclusive access key.</p>
                        </div>
                    )}

                    <div className="mt-8">
                        <div className="relative inline-block px-3 py-1 bg-white border-2 border-black font-bold text-[10px] uppercase tracking-widest rotate-2 shadow-sm group">
                            <div className="absolute -left-2 top-0 h-full w-4 bg-zinc-200/60 backdrop-blur-sm -skew-x-12"></div>
                            Limited slots available per week
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-center gap-8 font-black text-xs uppercase tracking-widest text-zinc-400">
                    <a className="hover:text-black transition-colors" href="#">Twitter</a>
                    <a className="hover:text-black transition-colors" href="#">Documentation</a>
                    <a className="hover:text-black transition-colors" href="#">Status</a>
                </div>
            </main>
        </div>
    );
};

export default WaitlistPage;
