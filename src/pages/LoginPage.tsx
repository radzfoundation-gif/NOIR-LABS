import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Log successful login
            await supabase.from('system_logs').insert([{
                message: `RELAY_ESTABLISHED: ${email} logged in.`,
                type: 'AUTH'
            }]);

            // Send Welcome Email (async, don't await blocking)
            import('../lib/unosend').then(({ sendWelcomeEmail }) => {
                sendWelcomeEmail(email);
            });

            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }; // Added missing closing brace

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `http://localhost:5173/`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed filter blur-[80px] z-[-1] opacity-40 bg-accent-green w-[40rem] h-[40rem] -top-20 -left-20 rounded-full"></div>
            <div className="fixed filter blur-[80px] z-[-1] opacity-40 bg-lab-pink w-[35rem] h-[35rem] -bottom-20 -right-20 rounded-full"></div>

            {/* Checkered Background Pattern */}
            <div className="absolute inset-0 z-[-2]" style={{
                backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}></div>

            <Link to="/" className="fixed top-8 left-12 flex items-center gap-2 group">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-lab-pink transition-colors">
                    <span className="material-symbols-outlined text-white fill-1">science</span>
                </div>
                <span className="font-black tracking-tighter text-xl uppercase">Noir Labs</span>
            </Link>

            <div className="relative w-full max-w-[500px] z-10">
                <div className="bg-white border-[4px] border-black p-10 md:p-14 rounded-[3rem] shadow-pop-lime">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">WELCOME BACK</h1>
                        <p className="text-lab-pink italic font-bold text-xl">Ready to experiment?</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="block font-black text-xs uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                className="w-full px-6 py-4 rounded-xl border-2 border-black font-bold text-lg focus:ring-4 focus:ring-accent-green/20 focus:border-black outline-none transition-all placeholder:text-zinc-400"
                                placeholder="name@research.lab"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-black text-xs uppercase tracking-widest ml-1">Password</label>
                            <input
                                className="w-full px-6 py-4 rounded-xl border-2 border-black font-bold text-lg focus:ring-4 focus:ring-accent-green/20 focus:border-black outline-none transition-all placeholder:text-zinc-400"
                                placeholder="••••••••"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-700 font-bold text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input className="w-5 h-5 border-2 border-black rounded text-black focus:ring-0" type="checkbox" />
                                <span className="font-bold text-sm">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-bold hover:underline">Forgot password?</Link>
                        </div>
                        <button
                            className="w-full h-16 bg-black text-white rounded-2xl font-black text-xl border-2 border-white hover:bg-zinc-800 transition-all shadow-pop-pink mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'LOGGING IN...' : 'LOGIN'}
                            <span className="material-symbols-outlined font-black">login</span>
                        </button>
                    </form>
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-black/10"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-xs font-black uppercase tracking-widest text-zinc-400">or connect with</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6">
                        <button className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sticker bg-white hover:bg-zinc-100" title="Github">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                        </button>
                        <button className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sticker bg-secondary text-white" title="Discord">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path></svg>
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sticker bg-pop-yellow text-black"
                            title="Google Login"
                        >
                            <span className="material-symbols-outlined font-black">science</span>
                        </button>
                    </div>
                </div>
                <div className="mt-8 text-center flex flex-col gap-2">
                    <p className="font-bold text-zinc-500">Don't have an account? <Link to="/join" className="text-black underline decoration-2 decoration-lab-pink underline-offset-4 font-black">Join the experiment</Link></p>
                    <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-4">
                        <span>© 2024 NOIR LABS</span>
                        <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                        <a className="hover:text-black" href="#">Privacy Policy</a>
                        <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                        <a className="hover:text-black" href="#">Terms of Service</a>
                    </div>
                </div>
            </div>

            <div className="fixed top-1/4 right-[10%] w-24 h-24 bg-pop-purple border-2 border-black rounded-3xl rotate-12 flex items-center justify-center shadow-pop-pink hidden lg:flex">
                <span className="material-symbols-outlined text-white text-4xl">auto_awesome</span>
            </div>
            <div className="fixed bottom-1/4 left-[10%] w-20 h-20 bg-pop-yellow border-2 border-black rounded-full -rotate-12 flex items-center justify-center shadow-pop-lime hidden lg:flex">
                <span className="font-black text-xs text-center px-2">PUBLIC BETA</span>
            </div>
        </div>
    );
};

export default LoginPage;
