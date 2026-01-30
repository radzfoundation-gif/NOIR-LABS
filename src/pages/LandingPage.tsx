
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { CountUp } from '../components/CountUp';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';

const LandingPage: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [showModelList, setShowModelList] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const [waitlistCount, setWaitlistCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            const { count } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
            if (count !== null) setWaitlistCount(count);
        };
        fetchCount();
    }, []);

    useRealtimeSubscription({
        table: 'waitlist',
        event: 'INSERT',
        onData: () => setWaitlistCount(prev => prev + 1)
    });

    return (
        <div className="font-display text-zinc-900 bg-white selection:bg-lab-pink/30 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="blob-pop bg-lab-pink w-[40rem] h-[40rem] -top-40 -left-20 rounded-full"></div>
            <div className="blob-pop bg-accent-green w-[30rem] h-[30rem] top-[40%] -right-20 rounded-full"></div>
            <div className="blob-pop bg-secondary w-[50rem] h-[50rem] -bottom-40 left-1/2 -translate-x-1/2 rounded-full"></div>

            <header className="fixed top-8 left-0 right-0 z-[100] px-6">
                <ScrollReveal mode="fade-in" width="100%" className='flex justify-center'>
                    <nav className="mx-auto max-w-fit nav-glass rounded-full px-4 py-2 flex items-center gap-2">
                        <div className="flex items-center gap-2 pl-2 pr-4 border-r-2 border-black mr-2">
                            <span className="material-symbols-outlined text-lab-pink fill-1">science</span>
                            <span className="font-bold tracking-tighter text-lg uppercase">Noir Labs</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/labs" className="px-4 py-2 text-sm font-bold hover:bg-pop-yellow rounded-full transition-colors border-2 border-transparent hover:border-black">Experiments</Link>
                            <Link to="/pricing" className="px-4 py-2 text-sm font-bold hover:bg-accent-green rounded-full transition-colors border-2 border-transparent hover:border-black">Pricing</Link>
                            <div className="relative group">
                                <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold bg-white border-2 border-black rounded-full hover:bg-accent-green transition-all shadow-sticker">
                                    Platforms
                                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                </button>
                                <div className="dropdown-menu absolute left-1/2 -translate-x-1/2 top-full pt-6 w-[640px]">
                                    <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] grid grid-cols-2 gap-6">
                                        <a className="group/card relative p-8 rounded-2xl bg-lab-pink/10 border-2 border-black hover:bg-lab-pink/20 transition-all" href="#">
                                            <div className="tape-label absolute -top-3 left-4 bg-lab-pink text-white border-black">AI CORE</div>
                                            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-black flex items-center justify-center mb-6 shadow-pop">
                                                <span className="material-symbols-outlined text-black text-3xl fill-1">psychology</span>
                                            </div>
                                            <h3 className="text-2xl font-black mb-2">NOIR AI</h3>
                                            <p className="text-sm font-medium text-zinc-700 leading-snug">
                                                Experimental AI models and inference infrastructure playground.
                                            </p>
                                        </a>
                                        <a className="group/card relative p-8 rounded-2xl bg-accent-green/10 border-2 border-black hover:bg-accent-green/20 transition-all" href="#">
                                            <div className="tape-label absolute -top-3 left-4 bg-accent-green text-black border-black">DEV TOOLS</div>
                                            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-black flex items-center justify-center mb-6 shadow-pop">
                                                <span className="material-symbols-outlined text-black text-3xl">terminal</span>
                                            </div>
                                            <h3 className="text-2xl font-black mb-2">NOIR CODE</h3>
                                            <p className="text-sm font-medium text-zinc-700 leading-snug">
                                                SDKs and APIs optimized for autonomous software engineering.
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <Link to="/survey" className="px-4 py-2 text-sm font-bold hover:bg-secondary/20 rounded-full transition-colors border-2 border-transparent hover:border-black">Research</Link>
                        </div>
                        <div className="ml-4 flex items-center gap-3">
                            {session ? (
                                <Link to="/profile">
                                    <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden shadow-pop hover:scale-110 transition-transform cursor-pointer bg-white" title={session.user.email}>
                                        <img
                                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${session.user.email}`}
                                            alt="User Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full text-sm font-black hover:bg-lab-pink hover:text-black transition-all border-2 border-black">
                                    SIGN IN
                                </Link>
                            )}
                        </div>
                    </nav>
                </ScrollReveal>
            </header>

            <main className="relative z-10 pt-48 pb-24">
                <section className="max-w-7xl mx-auto px-6 text-center mb-40">
                    <ScrollReveal mode="scale-up" duration={0.6} className="mb-12 inline-flex items-center gap-3">
                        <div className="px-6 py-2 rounded-full bg-pop-yellow border-2 border-black shadow-pop font-black text-xs uppercase tracking-[0.2em] -rotate-1">
                            <span className="flex h-3 w-3 rounded-full bg-lab-pink animate-ping inline-block mr-2"></span>
                            Public Beta v0.4
                        </div>
                    </ScrollReveal>

                    <div className="relative">
                        <ScrollReveal mode="fade-up" delay={0.2} width="100%">
                            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-none mb-12 select-none">
                                <span className="inline-block hover:-rotate-3 transition-transform">NOIR</span><br />
                                <span className="text-lab-pink italic inline-block hover:rotate-3 transition-transform drop-shadow-[4px_4px_0px_#000]">LABS</span>
                            </h1>
                        </ScrollReveal>
                        <div className="absolute -top-10 left-[15%] w-24 h-24 bg-secondary/20 rounded-full blur-xl -z-10 animate-pulse"></div>
                        <div className="absolute top-20 right-[20%] material-symbols-outlined text-6xl text-accent-green rotate-12 select-none opacity-50">auto_awesome</div>
                    </div>

                    <ScrollReveal mode="fade-up" delay={0.4} width="100%">
                        <p className="text-2xl md:text-3xl font-bold text-zinc-600 max-w-3xl mx-auto mb-16 leading-tight">
                            Experimental AI research that's <span className="bg-accent-green px-2 border-b-4 border-black">boldly curious</span> and radically open.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal mode="fade-up" delay={0.6} width="100%" className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
                        <Link to="/labs" className="px-12 h-20 bg-black text-white rounded-2xl font-black text-xl hover:bg-lab-pink hover:text-black hover:shadow-pop transition-all border-2 border-black flex items-center gap-3">
                            EXPLORE EXPERIMENTS
                            <span className="material-symbols-outlined">bolt</span>
                        </Link>
                        <Link to="/waitlist" className="px-12 h-20 bg-white border-2 border-black rounded-2xl font-black text-xl hover:bg-pop-yellow transition-all flex items-center gap-2 shadow-pop justify-center">
                            JOIN WAITLIST
                        </Link>
                    </ScrollReveal>
                </section>

                <section className="max-w-7xl mx-auto px-6 mb-40">
                    <div className="flex items-end justify-between mb-16 px-4">
                        <ScrollReveal mode="slide-right">
                            <div>
                                <div className="tape-label mb-4 bg-pop-purple text-white border-black">LATEST DROPS</div>
                                <h2 className="text-6xl font-black tracking-tight">Recent Experiments</h2>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal mode="slide-left">
                            <Link to="/labs" className="bg-white border-2 border-black px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-accent-green transition-all shadow-pop">
                                VIEW ALL LABS
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                        </ScrollReveal>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                            <div className="card-pop relative group aspect-[4/5]">
                                <video
                                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 rounded-3xl outline-none"
                                    src="/video_noir_ai.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent rounded-3xl"></div>
                                <div className="absolute top-6 left-6">
                                    <div className="tape-label bg-lab-pink text-white border-black">FULL STACK</div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                                    <h3 className="text-4xl font-black mb-3">Noir Ai</h3>
                                    <p className="text-lg font-bold text-white/80 leading-snug">Experimental AI models and inference infrastructure playground.</p>
                                    <a href="https://www.rlabs-studio.web.id/" target="_blank" rel="noopener noreferrer" className="block text-center mt-6 w-full py-4 bg-white text-black font-black rounded-xl border-2 border-black shadow-pop opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        LAUNCH PROJECT
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal mode="fade-up" delay={0.3} width="100%">
                            <div className="card-pop relative group aspect-[4/5]">
                                <video
                                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 rounded-3xl outline-none"
                                    src="/video_noir.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent rounded-3xl"></div>
                                <div className="absolute top-6 left-6">
                                    <div className="tape-label bg-accent-green text-black border-black">LOCAL LAB</div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                                    <h3 className="text-4xl font-black mb-3">Noir Code</h3>
                                    <p className="text-lg font-bold text-white/80 leading-snug">SDKs and APIs optimized for autonomous software engineering.</p>
                                    <a href="https://noircode.vercel.app/" target="_blank" rel="noopener noreferrer" className="block text-center mt-6 w-full py-4 bg-white text-black font-black rounded-xl border-2 border-black shadow-pop opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        LAUNCH PROJECT
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal mode="fade-up" delay={0.5} width="100%">
                            <div className="card-pop relative group aspect-[4/5]">
                                <img alt="Language AI" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3doK7DXHyhhQDj9CVi_eryVJqvG36UqL1U2kFg8JJtKTr3tX9bwlaGUs97nmdiupSio62dsrmAlj4Gla0WFfYoFAdBZhx3d5O24XPR3usLqRaNjDA85o4Udo26VB80PZTnJoYmM235TYJkmCHnpFe_jWpMwFZwukFR6qug-WprzhDCjLefyTN8YJJwL2_RFEhHDe0snVT-PNAY2F9c35bFjCO580GxDDE9-sEBYK49oUVsrztyWe5soK7UdBVIZXJI63pRyFtZ7M" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
                                <div className="absolute top-6 left-6">
                                    <div className="tape-label bg-secondary text-white border-black">LANGUAGE</div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                                    <h3 className="text-4xl font-black mb-3">Lexicon Flux</h3>
                                    <p className="text-lg font-bold text-white/80 leading-snug">Real-time multilingual semantic translation layer.</p>
                                    <button className="mt-6 w-full py-4 bg-white text-black font-black rounded-xl border-2 border-black shadow-pop opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        LAUNCH PROJECT
                                    </button>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 mb-40">
                    <ScrollReveal mode="scale-up" duration={0.8} width="100%">
                        <div className="grid lg:grid-cols-2 gap-20 items-center bg-white border-4 border-black p-12 rounded-[4rem] shadow-[24px_24px_0px_0px_#05ffa1]">
                            <div>
                                <div className="tape-label bg-pop-yellow text-black border-black mb-6">OPEN RESEARCH</div>
                                <h2 className="text-6xl font-black tracking-tight mb-8">Building the future, <br /><span className="text-lab-pink italic">together.</span></h2>
                                <p className="text-xl font-bold text-zinc-600 mb-12 leading-relaxed">
                                    We believe that the most powerful intelligence is shared. Our labs focus on safety, interpretability, and the democratization of compute.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-14 h-14 bg-lab-pink rounded-full border-2 border-black flex items-center justify-center shadow-pop">
                                            <span className="material-symbols-outlined text-white font-black">verified</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl">Privacy First</h4>
                                            <p className="text-zinc-500 font-bold">End-to-end encrypted inference environments.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-14 h-14 bg-secondary rounded-full border-2 border-black flex items-center justify-center shadow-pop">
                                            <span className="material-symbols-outlined text-white font-black">model_training</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl">Transparent Training</h4>
                                            <p className="text-zinc-500 font-bold">Open source datasets and weight distributions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="aspect-square bg-white border-2 border-black rounded-3xl p-8 flex flex-col justify-end shadow-pop hover:bg-pop-yellow transition-colors cursor-default">
                                    <span className="text-5xl font-black mb-2"><CountUp end={94} suffix="%" /></span>
                                    <p className="text-sm font-black uppercase text-zinc-400">Inference Boost</p>
                                </div>
                                <div className="aspect-square bg-black text-white rounded-3xl p-8 flex flex-col justify-end shadow-pop hover:bg-lab-pink transition-colors cursor-default">
                                    <span className="text-5xl font-black mb-2"><CountUp end={0.03} decimals={2} suffix="s" /></span>
                                    <p className="text-sm font-black uppercase text-zinc-500">Latency</p>
                                </div>
                                <div className="aspect-square bg-accent-green text-black rounded-3xl p-8 flex flex-col justify-end shadow-pop hover:scale-105 transition-transform cursor-default">
                                    <span className="text-5xl font-black mb-2"><CountUp end={waitlistCount} /></span>
                                    <p className="text-sm font-black uppercase text-black/60">Joined Waitlist</p>
                                </div>
                                <div onClick={() => setShowModelList(true)} className="aspect-square bg-white border-2 border-black rounded-3xl p-8 flex flex-col justify-end shadow-pop hover:bg-secondary transition-all cursor-pointer hover:scale-105 active:scale-95">
                                    <span className="text-5xl font-black mb-2"><CountUp end={5} suffix="+" /></span>
                                    <p className="text-sm font-black uppercase text-zinc-400">Flagship Models</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>

                <section className="max-w-4xl mx-auto px-6 text-center">
                    <ScrollReveal mode="fade-up" width="100%">
                        <div className="relative bg-white border-4 border-black p-16 rounded-[4rem] shadow-[16px_16px_0px_0px_rgba(185,103,255,1)]">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pop-yellow border-2 border-black rounded-full flex items-center justify-center rotate-12 shadow-pop">
                                <span className="font-black text-xs">JOIN THE LAB</span>
                            </div>
                            <h2 className="text-7xl font-black mb-8">Ready to explore?</h2>
                            <p className="text-2xl font-bold text-zinc-600 mb-12">Sign up for new experimental models and developer preview tools.</p>
                            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                                <input className="flex-1 px-8 h-16 rounded-2xl border-4 border-black font-bold text-lg focus:ring-0 focus:outline-none placeholder:text-zinc-400" placeholder="Email address" type="email" />
                                <button className="px-10 h-16 bg-black text-white rounded-2xl font-black text-xl hover:bg-lab-pink hover:text-black transition-all border-2 border-black">
                                    SUBSCRIBE
                                </button>
                            </form>
                        </div>
                    </ScrollReveal>
                </section>
            </main>

            <footer className="bg-white pt-24 pb-12 border-t-4 border-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-8">
                                <span className="material-symbols-outlined text-lab-pink text-3xl fill-1">science</span>
                                <span className="font-black text-3xl tracking-tighter uppercase">Noir Labs</span>
                            </div>
                            <p className="text-zinc-600 font-bold max-w-sm leading-tight mb-8">
                                The experimental laboratory for advanced AI research and next-generation neural architectures.
                            </p>
                            <div className="flex gap-4">
                                <a className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center hover:bg-pop-yellow transition-all shadow-pop" href="#">
                                    <span className="material-symbols-outlined font-black">terminal</span>
                                </a>
                                <a className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center hover:bg-accent-green transition-all shadow-pop" href="#">
                                    <span className="material-symbols-outlined font-black">alternate_email</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-[0.2em] mb-8 bg-zinc-100 inline-block px-2">Research</h5>
                            <ul className="space-y-4 font-bold text-zinc-500">
                                <li><a className="hover:text-black hover:underline" href="#">Models</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Datasets</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Safety</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Papers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-[0.2em] mb-8 bg-zinc-100 inline-block px-2">Platforms</h5>
                            <ul className="space-y-4 font-bold text-zinc-500">
                                <li><a className="hover:text-black hover:underline" href="#">Noir AI</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Noir Code</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">API Docs</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Cloud</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-[0.2em] mb-8 bg-zinc-100 inline-block px-2">Company</h5>
                            <ul className="space-y-4 font-bold text-zinc-500">
                                <li><a className="hover:text-black hover:underline" href="#">About Us</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Careers</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Press</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-[0.2em] mb-8 bg-zinc-100 inline-block px-2">Legal</h5>
                            <ul className="space-y-4 font-bold text-zinc-500">
                                <li><a className="hover:text-black hover:underline" href="#">Privacy</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Terms</a></li>
                                <li><a className="hover:text-black hover:underline" href="#">Ethics</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t-2 border-black/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                        <p>© 2024 NOIR LABS. RESEARCH ONLY.</p>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 bg-accent-green/20 text-black px-3 py-1 rounded-full border border-black">
                                <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                                Status: Live
                            </span>
                            <span>v0.4.12-pop</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Model List Modal */}
            {showModelList && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModelList(false)}>
                    <div className="bg-white border-4 border-black shadow-pop p-8 rounded-3xl max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowModelList(false)} className="absolute top-4 right-4 text-2xl font-black hover:text-lab-pink">&times;</button>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Available Models</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Gemini 3 Pro', tag: 'NEW' },
                                { name: 'GPT-5', tag: 'PREVIEW' },
                                { name: 'Gemini 2.5 Flash Lite', tag: 'FAST' },
                                { name: 'Claude Sonnet 4.5', tag: 'LATEST' },
                                { name: 'GPT-4o', tag: 'STABLE' }
                            ].map((model, idx) => (
                                <li key={idx} className="flex items-center justify-between border-2 border-black rounded-xl p-3 hover:bg-zinc-50 transition-colors">
                                    <span className="font-bold">{model.name}</span>
                                    <span className="text-[10px] font-black bg-black text-white px-2 py-1 rounded-md">{model.tag}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
