import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ForgotPasswordPage: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setShowPopup(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-6 min-h-screen relative overflow-hidden">
            {/* Floating Icons */}
            <span className="material-symbols-outlined floating-icon top-[10%] left-[15%] rotate-12 text-primary">science</span>
            <span className="material-symbols-outlined floating-icon top-[20%] right-[10%] -rotate-12 text-secondary">bolt</span>
            <span className="material-symbols-outlined floating-icon bottom-[15%] left-[10%] rotate-45 text-accent-green">biotech</span>
            <span className="material-symbols-outlined floating-icon bottom-[25%] right-[15%] -rotate-[30deg] text-pop-yellow">psychology</span>
            <span className="material-symbols-outlined floating-icon top-[50%] left-[5%] rotate-12 text-pop-purple">experiment</span>

            <main className="relative z-10 w-full max-w-lg">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full shadow-pop">
                        <span className="material-symbols-outlined text-primary fill-1">science</span>
                        <span className="font-black tracking-tighter text-lg uppercase">Noir Labs</span>
                    </div>
                </div>

                <div className="bg-white border-[4px] border-black p-10 md:p-12 rounded-[2.5rem] shadow-chunky-purple text-center relative">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6 italic select-none">
                        <span className="drop-shadow-[4px_4px_0px_#ff71ce]">LOST IN THE LAB?</span>
                    </h1>
                    <p className="text-lg font-bold text-zinc-600 mb-10 leading-snug max-w-sm mx-auto">
                        Don't worry, even our AI forgets things sometimes. Enter your email to find your way back.
                    </p>

                    <form className="space-y-6" onSubmit={handleReset}>
                        <div className="text-left">
                            <label className="block text-sm font-black uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <input
                                className="w-full px-6 py-4 rounded-2xl border-[3px] border-black font-bold text-lg focus:ring-0 focus:border-accent-green focus:outline-none placeholder:text-zinc-300 transition-colors"
                                placeholder="your@email.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-700 font-bold text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            className="w-full h-16 bg-accent-green text-black rounded-full border-[3px] border-black font-black text-xl shadow-pop hover:shadow-pop-hover hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'SENDING...' : 'SEND RECOVERY LINK'}
                            {!loading && <span className="material-symbols-outlined font-black">arrow_forward</span>}
                        </button>
                    </form>

                    <div className="mt-12">
                        <Link to="/login" className="tape-label">
                            Back to Login
                        </Link>
                    </div>

                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-pop-yellow border-2 border-black rounded-xl rotate-12 flex items-center justify-center shadow-pop">
                        <span className="material-symbols-outlined font-black">key</span>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                        © 2024 NOIR LABS. RESEARCH ONLY.
                    </p>
                </div>
            </main>

            {/* Success Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white border-[4px] border-black p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_#05ffa1] max-w-md w-full text-center relative animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-accent-green rounded-full border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-pop">
                            <span className="material-symbols-outlined text-4xl font-black">mark_email_read</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight mb-4">RECOVERY LINK SENT!</h2>
                        <p className="text-zinc-600 font-bold mb-8 leading-snug">
                            Check your inbox. We've sent a magic link to guide you back to the lab.
                        </p>
                        <Link
                            to="/login"
                            className="w-full h-14 bg-black text-white rounded-xl border-2 border-black font-black text-lg hover:bg-zinc-800 transition-all shadow-pop flex items-center justify-center gap-2"
                        >
                            BACK TO LOGIN
                        </Link>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
                        >
                            <span className="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordPage;
