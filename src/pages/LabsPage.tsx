
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';

const LabsPage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        // Fetch initial logs
        const fetchLogs = async () => {
            const { data } = await supabase
                .from('system_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (data) {
                // Format initial logs
                const formatted = data.reverse().map(log => ({
                    id: log.id,
                    time: new Date(log.created_at).toLocaleTimeString('en-US', { hour12: false }),
                    type: log.type || 'SYS',
                    message: log.message
                }));
                setLogs(formatted);
            } else {
                // Fallback if DB empty
                setLogs([
                    { time: '08:42:11', type: 'SYS', message: 'INITIALIZING_SYNAPSE' },
                    { time: '08:42:12', type: 'SYS', message: 'LOADING_WEIGHTS... 100%' },
                    { time: '08:42:16', type: 'SYS', message: 'READY_FOR_REQ' }
                ]);
            }
        };
        fetchLogs();
    }, []);

    useRealtimeSubscription({
        table: 'system_logs',
        event: 'INSERT',
        onData: (payload) => {
            const newLog = payload.new as any;
            const formattedLog = {
                id: newLog.id,
                time: new Date(newLog.created_at).toLocaleTimeString('en-US', { hour12: false }),
                type: newLog.type || 'SYS',
                message: newLog.message
            };
            setLogs(prev => [...prev.slice(-4), formattedLog]);
        }
    });

    const updateProduct = async (product: string) => {
        if (!user) return;

        console.log(`User ${user.id} accessed ${product}`);

        const { error } = await supabase
            .from('profiles')
            .update({ active_product: product })
            .eq('id', user.id);

        if (error) console.error('Error updating product activity:', error);

        // Real-time logging
        let logMessage = '';
        if (product === 'Noir AI') logMessage = `NEURAL_LINK: ${user.email} accessing NOIR AI.`;
        if (product === 'Noir Code') logMessage = `SYNTH_INIT: ${user.email} generating code.`;

        if (logMessage) {
            await supabase.from('system_logs').insert([{
                message: logMessage,
                type: 'USAGE'
            }]);
        }
    };

    return (
        <div className="bg-white font-display text-black min-h-screen pb-20 overflow-x-hidden" style={{
            backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)',
            backgroundSize: '32px 32px'
        }}>
            {/* Floating Icons */}
            <span className="material-symbols-outlined text-[80px] fixed pointer-events-none z-0 text-black opacity-[0.08] top-20 left-10 -rotate-12 select-none">science</span>
            <span className="material-symbols-outlined text-[60px] fixed pointer-events-none z-0 text-black opacity-[0.08] top-1/2 right-10 rotate-45 select-none">bolt</span>
            <span className="material-symbols-outlined text-[70px] fixed pointer-events-none z-0 text-black opacity-[0.08] bottom-20 left-1/4 -rotate-6 select-none">star</span>
            <span className="material-symbols-outlined text-[50px] fixed pointer-events-none z-0 text-black opacity-[0.08] top-1/4 left-1/3 rotate-12 select-none">experiment</span>
            <span className="material-symbols-outlined text-[55px] fixed pointer-events-none z-0 text-black opacity-[0.08] bottom-1/3 right-1/4 -rotate-45 select-none">biotech</span>
            <span className="material-symbols-outlined text-[65px] fixed pointer-events-none z-0 text-black opacity-[0.08] top-10 right-1/3 rotate-12 select-none">auto_awesome</span>

            <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-6 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="bg-lab-lime p-2 border-2 border-black shadow-neobrutal rotate-[-2deg] transition-transform group-hover:rotate-0">
                        <span className="material-symbols-outlined font-black text-2xl">science</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none">NOIR LABS</h1>
                        <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-60">AI Research Facility</span>
                    </div>
                </Link>
                <div className="hidden xl:flex items-center gap-8 font-black uppercase text-xs tracking-widest">
                    <a className="hover:bg-lab-lime px-3 py-1 border-b-2 border-transparent hover:border-black transition-all" href="#">Research</a>
                    <a className="hover:bg-lab-lime px-3 py-1 border-b-2 border-transparent hover:border-black transition-all" href="#">Models</a>
                    <a className="hover:bg-lab-lime px-3 py-1 border-b-2 border-transparent hover:border-black transition-all" href="#">Neural Net</a>
                    <a className="hover:bg-lab-lime px-3 py-1 border-b-2 border-transparent hover:border-black transition-all" href="#">Console</a>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-black text-lab-lime text-[10px] font-black px-3 py-1 border-2 border-black rotate-[1deg] hidden sm:block">V3 POP</div>
                    <button className="bg-noir-pink text-white px-5 py-2 border-2 border-black shadow-neobrutal font-black text-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">TERMINAL ACCESS</button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                <aside className="lg:col-span-1 hidden lg:flex flex-col items-center gap-8 py-4">
                    <div className="flex flex-col gap-6 sticky top-40">
                        <button className="w-12 h-12 bg-lab-lime border-2 border-black shadow-neobrutal flex items-center justify-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <span className="material-symbols-outlined font-black text-xl">labs</span>
                        </button>
                        <button className="w-12 h-12 bg-white border-2 border-black shadow-neobrutal flex items-center justify-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <span className="material-symbols-outlined font-black text-xl">terminal</span>
                        </button>
                        <button className="w-12 h-12 bg-white border-2 border-black shadow-neobrutal flex items-center justify-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <span className="material-symbols-outlined font-black text-xl">database</span>
                        </button>
                        <button className="w-12 h-12 bg-white border-2 border-black shadow-neobrutal flex items-center justify-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <span className="material-symbols-outlined font-black text-xl">settings_input_component</span>
                        </button>
                    </div>
                </aside>

                <section className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex items-end gap-3">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">The Lab<br />Console</h2>
                        <div className="flex gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full bg-lab-lime border-2 border-black"></div>
                            <div className="w-3 h-3 rounded-full bg-noir-pink border-2 border-black"></div>
                        </div>
                    </div>
                    <div className="bg-white border-4 border-black p-6 relative shadow-[8px_8px_0px_0px_#9df425]">
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="bg-noir-pink text-white px-4 py-2 border-2 border-black font-black text-xs uppercase -rotate-2 cursor-pointer hover:rotate-0 transition-transform shadow-[3px_3px_0px_0px_#000,6px_6px_0px_0px_#ff2ec7]">
                                MODEL: NOIR-ULTRA-V3
                            </div>
                            <div className="bg-lab-lime text-black px-4 py-2 border-2 border-black font-black text-xs uppercase rotate-3 cursor-pointer hover:rotate-0 transition-transform shadow-[3px_3px_0px_0px_#000,6px_6px_0px_0px_#9df425]">
                                TOKENS: 4k MAX
                            </div>
                        </div>
                        <textarea className="w-full h-60 bg-[#fdfdfd] border-2 border-black p-4 text-xl font-bold placeholder:text-gray-200 focus:ring-0 focus:outline-none resize-none shadow-inner" placeholder="INITIATE NEURAL SYNTHESIS..."></textarea>
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex gap-2">
                                <button className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-lab-lime transition-colors"><span className="material-symbols-outlined font-bold text-lg">attachment</span></button>
                                <button className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-lab-lime transition-colors"><span className="material-symbols-outlined font-bold text-lg">image</span></button>
                                <button className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-lab-lime transition-colors"><span className="material-symbols-outlined font-bold text-lg">keyboard_voice</span></button>
                            </div>
                            <div className="text-[9px] font-black uppercase bg-black text-white px-2 py-1">SECURE_LINK</div>
                        </div>
                    </div>
                    <div className="py-2">
                        <button
                            onClick={() => updateProduct('Noir AI')}
                            className="group relative w-full flex items-center justify-center gap-4 bg-lab-lime border-4 border-black py-4 px-8 shadow-neobrutal transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[0_0_20px_#9df425] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                            <span className="material-symbols-outlined text-4xl font-black">bolt</span>
                            <span className="text-3xl font-black uppercase italic tracking-tighter">GENERATE</span>
                            <span className="material-symbols-outlined text-4xl font-black">auto_fix_high</span>
                        </button>
                    </div>
                    <div className="p-4 bg-black border-4 border-black shadow-neobrutal">
                        <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                            <p className="font-black uppercase text-lab-lime text-[10px] tracking-widest">Env_Logs_v3.0</p>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <div className="text-[10px] font-mono space-y-1 text-green-400">
                            {logs.map((log, i) => (
                                <p key={i} className={`flex gap-2 ${i === logs.length - 1 ? 'animate-pulse' : ''}`}>
                                    <span>[{log.time}]</span>
                                    <span className={log.type === 'USAGE' ? 'text-noir-pink' : 'text-white'}>{log.type}:</span>
                                    {log.message}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-4 flex flex-col gap-6">
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Result<br />Canvas</h2>
                        <div className="bg-black text-lab-lime text-[10px] font-black px-3 py-1 border-2 border-black rotate-[-3deg]">LIVE</div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_#000000] relative">
                            <div className="absolute -top-3 -right-3 w-12 h-12 bg-noir-pink border-2 border-black flex items-center justify-center rotate-12">
                                <span className="material-symbols-outlined text-white font-black text-xl">verified</span>
                            </div>
                            <div className="border-2 border-black p-[8px] bg-white mb-4 shadow-lg" style={{ borderRadius: '155px 15px 125px 15px/15px 125px 15px 155px' }}>
                                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border border-black/10">
                                    <img alt="Abstract synthesis" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgbfQ0WiFpVpEWCQ6JeVJy4_HvBUhVKyeiqPNXerv9K36ScanDINZ8Vua4FW0bWDGqO0NVFA5jl3We2cAFj9dbvfYRMGU3qFfJTag6cQcaXwiDdMSXLaY815QkP0e9ZBkOfEuTtlvsAdi5QI8Ijg-TjXTEM00N_074VEbpwTjlR-SPLWSkFCJhhaAGSderewB0djHrVhxzPpSrCg7Z0Hd6BZaTJKVmhUaMnRp6ajApelYF-jUJ2H7H6fQtH64JntXvI6UK9EpbXII" />
                                </div>
                            </div>
                            <p className="text-sm font-bold leading-tight mb-4 italic">
                                "THE SYNTHESIS YIELDED A VIBRANT INTERSECTION OF NEON AESTHETICS AND FUNCTIONAL MINIMALISM."
                            </p>
                            <div className="flex justify-between items-center border-t-2 border-black pt-4">
                                <span className="text-[10px] font-black uppercase bg-lab-lime px-2">REF: #NOIR-9921-X</span>
                                <div className="flex gap-2">
                                    <button className="material-symbols-outlined font-black text-lg hover:text-noir-pink">favorite</button>
                                    <button className="material-symbols-outlined font-black text-lg hover:text-lab-lime">download</button>
                                    <button className="material-symbols-outlined font-black text-lg hover:text-blue-400">share</button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_#000000] relative">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-red-500 border-2 border-black rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-400 border-2 border-black rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
                                <span className="text-xs font-black uppercase ml-2 tracking-widest">NEURAL_SCRIPT.JS</span>
                            </div>
                            <div className="bg-black mb-4 border-2 border-black p-[8px]" style={{ borderRadius: '15px 155px 15px 125px/125px 15px 155px 15px' }}>
                                <pre className="text-lab-lime font-mono text-xs overflow-x-auto py-1">
                                    {`function createMagic() {
  const neon = noir.get('aesthetic');
  return synth(neon.intensity(11));
}`}
                                </pre>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <div className="flex gap-2">
                                    <span className="bg-lab-lime/20 text-[9px] font-black px-2 py-0.5 border border-black rounded-full">CLEAN_CODE</span>
                                    <span className="bg-noir-pink/20 text-[9px] font-black px-2 py-0.5 border border-black rounded-full">REACT_CORE</span>
                                </div>
                                <button
                                    onClick={() => updateProduct('Noir Code')}
                                    className="px-3 py-1 bg-black text-white border-2 border-black font-black text-[10px] uppercase hover:bg-noir-pink hover:text-white transition-colors"
                                >
                                    GENERATE CODE
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-2">
                    <div className="sticky top-40 flex flex-col gap-6 p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                        <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                            <span className="material-symbols-outlined font-black text-2xl">tune</span>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Settings</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>Creativity</span>
                                    <span className="bg-noir-pink text-white px-1.5 py-0 border border-black">0.85</span>
                                </div>
                                <input className="w-full appearance-none cursor-pointer bg-transparent [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:border-[2px] [&::-webkit-slider-runnable-track]:border-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:mt-[-10px] [&::-webkit-slider-thumb]:shadow-[2px_0px_0px_#9df425]" type="range" defaultValue={85} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>Complexity</span>
                                    <span className="bg-lab-lime text-black px-1.5 py-0 border border-black">0.42</span>
                                </div>
                                <input className="w-full appearance-none cursor-pointer bg-transparent [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:border-[2px] [&::-webkit-slider-runnable-track]:border-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:mt-[-10px] [&::-webkit-slider-thumb]:shadow-[2px_0px_0px_#9df425]" type="range" defaultValue={42} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>Chaos</span>
                                    <span className="bg-black text-white px-1.5 py-0 border border-black">STABLE</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-6 bg-gray-200 border-2 border-black relative cursor-pointer group">
                                        <div className="absolute left-0 top-0 w-4 h-full bg-black transition-transform"></div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase opacity-40 italic">OFF</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>Quantum</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-6 bg-lab-lime/20 border-2 border-black relative cursor-pointer">
                                        <div className="absolute left-0 top-0 w-4 h-full bg-black translate-x-7 bg-lab-lime"></div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-lab-lime italic">ACTIVE</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <button className="w-full py-3 bg-black text-white border-2 border-black font-black uppercase text-xs hover:bg-lab-lime hover:text-black transition-all shadow-[3px_3px_0px_0px_rgba(157,244,37,1)]">
                                RESET PARAMS
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-0 w-full bg-black text-white border-t-8 border-black py-2 px-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-10 whitespace-nowrap overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-lab-lime animate-pulse border border-black"></div>
                        <span className="text-[11px] font-black uppercase tracking-widest">SYSTEM_STATUS: OPTIMIZED</span>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">LATENCY: 14MS</span>
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">CORE_LOAD: 22%</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-lab-lime">V3_POP_AESTHETIC_READY</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[11px] font-black uppercase tracking-widest hidden md:block">© 2024 NOIR LABS RESEARCH FACILITY</span>
                    <div className="flex gap-2">
                        <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[10px]">X</div>
                        <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[10px]">G</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LabsPage;
