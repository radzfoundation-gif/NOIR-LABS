
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const PricingPage = () => {
    const [session, setSession] = useState<any>(null);
    const [isIndo, setIsIndo] = useState(true); // Default to Indo
    const [isPro, setIsPro] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [showSubDetails, setShowSubDetails] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Detect User Location
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country_code !== 'ID') {
                    setIsIndo(false);
                }
            })
            .catch(err => console.error("Failed to detect location:", err));

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            // Check Database for Pro Status
            if (session?.user) {
                supabase.from('user_subscriptions')
                    .select('status, valid_until')
                    .eq('user_id', session.user.id)
                    .single()
                    .then(({ data }) => {
                        if (data) {
                            setSubscriptionData(data);
                            const isValid = data.status === 'active' && new Date(data.valid_until) > new Date();
                            setIsPro(isValid);
                        } else {
                            // Fallback
                            setIsPro(localStorage.getItem('nevara_is_pro') === 'true');
                        }
                    });
            } else {
                setIsPro(localStorage.getItem('nevara_is_pro') === 'true');
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsPro(localStorage.getItem('nevara_is_pro') === 'true');
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleStart = () => {
        if (session) {
            navigate('/labs');
        } else {
            navigate('/login');
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!session) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/create-invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    external_id: `invoice-researcher-${Date.now()}`,
                    amount: isIndo ? 70000 : 5, // Rp 70.000 or $5 USD
                    payer_email: session.user.email,
                    description: "Noir Labs Researcher Plan - Monthly Subscription",
                    currency: isIndo ? 'IDR' : 'USD'
                }),
            });

            const data = await response.json();

            if (data.invoice_url) {
                window.location.href = data.invoice_url;
            } else {
                console.error('Invoice creation failed:', data);
                alert('Failed to initiate payment. Please try again.');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment service connection failed. Please check your network connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContact = () => {
        window.location.href = "mailto:research@noirlabs.ai?subject=Enterprise%20Inquiry";
    };

    return (
        <div className="font-display text-zinc-900 bg-white selection:bg-lab-pink/30 relative overflow-hidden min-h-screen">
            <div className="blob-pop bg-lab-pink w-[40rem] h-[40rem] -top-40 -left-20 rounded-full"></div>
            <div className="blob-pop bg-accent-green w-[30rem] h-[30rem] top-[40%] -right-20 rounded-full"></div>
            <div className="blob-pop bg-secondary w-[50rem] h-[50rem] -bottom-40 left-1/2 -translate-x-1/2 rounded-full"></div>

            <header className="fixed top-4 left-0 right-0 z-[100] px-4 md:px-6">
                <nav className="mx-auto max-w-fit nav-glass rounded-full px-3 py-2 md:px-4 md:py-2 flex items-center gap-2">
                    <div className="flex items-center gap-2 pl-2 pr-4 border-r-2 border-black mr-2">
                        <span className="material-symbols-outlined text-lab-pink fill-1 text-xl md:text-2xl">science</span>
                        <span className="font-bold tracking-tighter text-base md:text-lg uppercase hidden sm:inline">Noir Labs</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-3">
                        <Link to="/labs" className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold hover:bg-pop-yellow rounded-full transition-colors border-2 border-transparent hover:border-black">Experiments</Link>
                        <Link to="/pricing" className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold bg-white border-2 border-black rounded-full hover:bg-accent-green transition-all shadow-sticker">Pricing</Link>
                        <Link to="/survey" className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold hover:bg-secondary/20 rounded-full transition-colors border-2 border-transparent hover:border-black hidden sm:inline-block">Research</Link>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                        {session ? (
                            <Link to="/profile" className="relative group">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-black overflow-hidden shadow-pop group-hover:scale-110 transition-transform cursor-pointer bg-white" title={session.user.email}>
                                    <img
                                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${session.user.email}`}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isPro && (
                                    <div className="absolute -bottom-1 -right-1 bg-pop-yellow text-[8px] md:text-[10px] font-black border border-black px-1 rounded-sm rotate-12 shadow-sm">
                                        PRO
                                    </div>
                                )}
                            </Link>
                        ) : (
                            <Link to="/login" className="bg-black text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-black hover:bg-lab-pink hover:text-black transition-all border-2 border-black">
                                SIGN IN
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            <main className="relative z-10 pt-32 md:pt-48 pb-12 md:pb-24">
                <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20 md:mb-32 relative">
                    <span className="material-symbols-outlined doodle-accent text-5xl md:text-7xl top-0 left-0 -rotate-12">biotech</span>
                    <span className="material-symbols-outlined doodle-accent text-6xl md:text-8xl bottom-0 right-10 rotate-12">fluid_med</span>
                    <div className="text-center mb-12 md:mb-20">
                        <div className="tape-label mb-4 md:mb-6 bg-pop-yellow text-black border-black">COMPUTE ALLOCATION</div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">Choose your <span className="text-lab-pink italic drop-shadow-[4px_4px_0px_#000]">access.</span></h1>
                        <p className="text-lg md:text-xl font-bold text-zinc-500 max-w-2xl mx-auto px-4">Scale your AI research with flexible tiers designed for discovery and production-grade inference.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
                        <div className="card-pricing shadow-[12px_12px_0px_0px_#05ffa1]">
                            <div className="mb-8">
                                <span className="text-sm font-black uppercase tracking-widest text-zinc-400">Entry Tier</span>
                                <h3 className="text-4xl font-black mt-2">Hobbyist</h3>
                            </div>
                            <div className="mb-8">
                                <span className="text-5xl font-black">$0</span>
                                <span className="text-zinc-500 font-bold">/month</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-grow">
                                <li className="flex items-center gap-3 font-bold text-zinc-600">
                                    <span className="material-symbols-outlined text-accent-green font-black">check_circle</span>
                                    Public models access
                                </li>
                                <li className="flex items-center gap-3 font-bold text-zinc-600">
                                    <span className="material-symbols-outlined text-accent-green font-black">check_circle</span>
                                    100 daily inferences
                                </li>
                                <li className="flex items-center gap-3 font-bold text-zinc-600">
                                    <span className="material-symbols-outlined text-accent-green font-black">check_circle</span>
                                    Community support
                                </li>
                                <li className="flex items-center gap-3 font-bold text-zinc-400">
                                    <span className="material-symbols-outlined">block</span>
                                    Custom training
                                </li>
                            </ul>
                            <button onClick={handleStart} className="btn-pill bg-white hover:bg-accent-green">START EXPLORING</button>
                        </div>
                        <div className="card-pricing shadow-[12px_12px_0px_0px_#ff71ce] relative">
                            <div className="absolute -top-4 -right-4 rotate-6 z-20">
                                <div className="bg-pop-yellow border-2 border-black px-4 py-2 font-black text-sm shadow-pop">POPULAR</div>
                            </div>
                            <div className="mb-8">
                                <span className="text-sm font-black uppercase tracking-widest text-lab-pink">Power User</span>
                                <h3 className="text-4xl font-black mt-2">Researcher</h3>
                            </div>
                            <div className="mb-8">
                                <span className="text-lg font-bold text-zinc-400 line-through decoration-2 decoration-lab-pink">
                                    {isIndo ? 'Rp 150.000' : '$10'}
                                </span>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-black">
                                        {isIndo ? 'Rp 70.000' : '$5'}
                                    </span>
                                    <span className="text-zinc-500 font-bold ml-2">/month</span>
                                </div>
                            </div>
                            <ul className="space-y-4 mb-12 flex-grow">
                                <li className="flex items-center gap-3 font-bold">
                                    <span className="material-symbols-outlined text-lab-pink font-black">check_circle</span>
                                    All experimental models
                                </li>
                                <li className="flex items-center gap-3 font-bold">
                                    <span className="material-symbols-outlined text-lab-pink font-black">check_circle</span>
                                    Unlimited standard inference
                                </li>
                                <li className="flex items-center gap-3 font-bold">
                                    <span className="material-symbols-outlined text-lab-pink font-black">check_circle</span>
                                    10 Custom fine-tunes / mo
                                </li>
                                <li className="flex items-center gap-3 font-bold">
                                    <span className="material-symbols-outlined text-lab-pink font-black">check_circle</span>
                                    Priority queue access
                                </li>
                                <li className="flex items-center gap-3 font-bold">
                                    <span className="material-symbols-outlined text-lab-pink font-black">check_circle</span>
                                    API documentation access
                                </li>
                            </ul>
                            <button
                                onClick={() => {
                                    if (isPro) {
                                        setShowSubDetails(true);
                                    } else {
                                        handleUpgrade();
                                    }
                                }}
                                disabled={isLoading}
                                className={`btn-pill w-full ${isPro
                                    ? 'bg-accent-green text-black hover:bg-accent-green/90 hover:scale-105 active:scale-95 cursor-pointer'
                                    : 'bg-black text-white hover:bg-lab-pink hover:text-black disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {isPro ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">verified</span>
                                        CURRENT PLAN
                                    </span>
                                ) : (
                                    isLoading ? 'PROCESSING...' : 'UPGRADE NOW'
                                )}
                            </button>
                        </div>
                        <div className="card-pricing shadow-[12px_12px_0px_0px_#b967ff]">
                            <div className="mb-8">
                                <span className="text-sm font-black uppercase tracking-widest text-zinc-400">Scale Tier</span>
                                <h3 className="text-4xl font-black mt-2">Enterprise</h3>
                            </div>
                            <div className="mb-8">
                                <span className="text-5xl font-black italic">Custom</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-grow">
                                <li className="flex items-center gap-3 font-bold text-zinc-600">
                                    <span className="material-symbols-outlined text-pop-purple font-black">check_circle</span>
                                    Dedicated GPU clusters
                                </li>
                                <li className="flex items-center gap-3 font-bold text-zinc-600">
                                    <span className="material-symbols-outlined text-pop-purple font-black">check_circle</span>
                                    SLA-backed performance
                                </li>
                                <li className="flex items-center gap-3 font-bold text-zinc-600">
                                    <span className="material-symbols-outlined text-pop-purple font-black">check_circle</span>
                                    On-premise deployment
                                </li>
                                <li className="flex items-center gap-3 font-bold text-zinc-600">
                                    <span className="material-symbols-outlined text-pop-purple font-black">check_circle</span>
                                    24/7 dedicated engineer
                                </li>
                            </ul>
                            <button onClick={handleContact} className="btn-pill bg-white hover:bg-pop-purple hover:text-white">CONTACT US</button>
                        </div>
                    </div>
                </section>
                <section className="max-w-4xl mx-auto px-4 md:px-6 mb-20 md:mb-40">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black tracking-tight">Curious Minds <span className="text-secondary">Ask.</span></h2>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-black p-8 rounded-3xl shadow-pop -rotate-1 hover:rotate-0 transition-transform cursor-help">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xl font-black">What is "Inference Credits"?</h4>
                                <span className="material-symbols-outlined text-secondary">help</span>
                            </div>
                            <p className="font-bold text-zinc-600 leading-relaxed">Each credit represents one call to our advanced neural engine. Hobbyists get plenty for testing, while Researchers get priority bandwidth for high-velocity experimentation.</p>
                        </div>
                        <div className="bg-white border-2 border-black p-8 rounded-3xl shadow-pop rotate-1 hover:rotate-0 transition-transform cursor-help">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xl font-black">Can I cancel my subscription?</h4>
                                <span className="material-symbols-outlined text-lab-pink">event_busy</span>
                            </div>
                            <p className="font-bold text-zinc-600 leading-relaxed">Yes, you can cancel or pause your Researcher plan at any time from your lab dashboard. No contracts, no fuss—just pure science.</p>
                        </div>
                        <div className="bg-white border-2 border-black p-8 rounded-3xl shadow-pop -rotate-1 hover:rotate-0 transition-transform cursor-help">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xl font-black">Is my data used for training?</h4>
                                <span className="material-symbols-outlined text-accent-green">security</span>
                            </div>
                            <p className="font-bold text-zinc-600 leading-relaxed">Only if you opt-in for open-research rewards. Otherwise, your inputs remain private and encrypted within your secure inference container.</p>
                        </div>
                    </div>
                </section>
                <section className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <div className="relative bg-white border-4 border-black p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-[12px_12px_0px_0px_rgba(1,205,254,1)] md:shadow-[16px_16px_0px_0px_rgba(1,205,254,1)]">
                        <div className="absolute -top-8 -right-4 md:-top-10 md:-right-10 w-24 h-24 md:w-32 md:h-32 bg-pop-yellow border-2 border-black rounded-full flex items-center justify-center rotate-12 shadow-pop">
                            <span className="font-black text-[10px] md:text-xs">NEWSLETTER</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8">Stay updated</h2>
                        <p className="text-lg md:text-2xl font-bold text-zinc-600 mb-8 md:mb-12">New model drops every Tuesday. Don't miss the next evolution.</p>
                        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                            <input className="flex-1 px-6 h-14 md:px-8 md:h-16 rounded-2xl border-4 border-black font-bold text-base md:text-lg focus:ring-0 focus:outline-none placeholder:text-zinc-400" placeholder="Email address" type="email" />
                            <button className="px-8 h-14 md:px-10 md:h-16 bg-black text-white rounded-2xl font-black text-lg md:text-xl hover:bg-secondary hover:text-black transition-all border-2 border-black">
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>
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
                    <div className="pt-8 border-t-2 border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 text-center md:text-left">
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

            {/* Subscription Details Modal */}
            {showSubDetails && subscriptionData && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSubDetails(false)}>
                    <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-10 rounded-[2.5rem] max-w-md w-full relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowSubDetails(false)} className="absolute top-6 right-6 text-3xl font-black hover:text-lab-pink transition-colors">&times;</button>

                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-accent-green rounded-full border-4 border-black flex items-center justify-center shadow-pop">
                                <span className="material-symbols-outlined text-4xl font-black">verified</span>
                            </div>
                        </div>

                        <h3 className="text-4xl font-black uppercase tracking-tighter text-center mb-2">Researcher Plan</h3>
                        <p className="text-center font-bold text-zinc-500 mb-8 uppercase tracking-widest">Active Subscription</p>

                        <div className="space-y-4 bg-zinc-50 p-6 rounded-2xl border-2 border-black mb-8">
                            <div className="flex justify-between items-center border-b-2 border-dashed border-zinc-300 pb-3">
                                <span className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Status</span>
                                <span className="font-black text-accent-green bg-black px-3 py-1 rounded-md uppercase text-sm">Active</span>
                            </div>
                            <div className="flex justify-between items-center border-b-2 border-dashed border-zinc-300 pb-3">
                                <span className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Billing</span>
                                <span className="font-black">{isIndo ? 'IDR 70.000' : '$5.00'} / month</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-zinc-500 uppercase text-xs tracking-widest">Valid Until</span>
                                <span className="font-black">
                                    {new Date(subscriptionData.valid_until).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSubDetails(false)}
                            className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-lab-pink hover:text-black border-2 border-black transition-all shadow-pop hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingPage;
