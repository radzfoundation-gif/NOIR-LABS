
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SurveyPage: React.FC = () => {
    const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
    const [satisfaction, setSatisfaction] = useState(8.4);
    const [feedback, setFeedback] = useState('');

    const experiments = [
        { id: 'neural', icon: 'psychology', label: 'Neural Canvas' },
        { id: 'ghost', icon: 'terminal', label: 'Project Ghost' },
        { id: 'lexicon', icon: 'translate', label: 'Lexicon Flux' },
        { id: 'api', icon: 'add_circle', label: 'Other / API' },
    ];

    return (
        <div className="bg-white font-display text-zinc-900 min-h-screen relative overflow-x-hidden" style={{
            backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px'
        }}>
            {/* Floating Icons */}
            {/* Floating Icons */}
            <span className="material-symbols-outlined absolute pointer-events-none opacity-60 select-none text-3xl text-lab-pink top-[12%] left-[8%] rotate-12">star</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-60 select-none text-2xl text-secondary top-[45%] right-[10%] -rotate-12">auto_awesome</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-60 select-none text-4xl text-pop-yellow bottom-[15%] left-[12%] rotate-[30deg]">flare</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-60 select-none text-2xl text-accent-green top-[15%] right-[18%] rotate-12">science</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-60 select-none text-3xl text-pop-purple bottom-[10%] right-[20%] -rotate-6">rocket_launch</span>
            <span className="material-symbols-outlined absolute pointer-events-none opacity-60 select-none text-xl text-lab-pink bottom-[40%] left-[5%] rotate-45">favorite</span>

            <header className="fixed top-6 left-0 right-0 z-[100] px-6">
                <nav className="mx-auto max-w-fit bg-white border-2 border-black shadow-pop transition-all hover:-translate-y-0.5 rounded-full px-4 py-2 flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2 pr-4 border-r-2 border-black group">
                        <span className="material-symbols-outlined text-lab-pink font-black group-hover:rotate-12 transition-transform text-xl">science</span>
                        <span className="font-black tracking-tighter text-lg uppercase">Noir Labs</span>
                    </Link>
                    <Link to="/" className="px-4 py-1.5 text-xs font-black hover:bg-pop-yellow rounded-full transition-colors border border-transparent hover:border-black uppercase tracking-widest">
                        Back to Lab
                    </Link>
                    <div className="ml-1 flex items-center gap-2">
                        <div className="bg-black text-white px-3 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] border border-black">
                            V3 POP
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative z-10 pt-28 pb-16 px-4 flex flex-col items-center">
                <div className="max-w-2xl w-full">
                    {/* Flask Animation Container - Simplified for React */}
                    <div className="relative w-12 h-16 mx-auto mb-8">
                        <div className="absolute inset-0 border-[3px] border-black z-20" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 70% 35%, 100% 85%, 100% 100%, 0% 100%, 0% 85%, 30% 35%)' }}></div>
                        <div className="absolute bottom-0 left-0 w-full bg-accent-green z-10" style={{
                            height: '65%',
                            maskImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0h40v42l30 58v20H0v-20l30-58z'/%3E%3C/svg%3E\")",
                            WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0h40v42l30 58v20H0v-20l30-58z'/%3E%3C/svg%3E\")",
                            maskSize: 'cover',
                            WebkitMaskSize: 'cover'
                        }}></div>
                        <div className="absolute -right-10 top-1/2 -translate-y-1/2 font-black text-lg italic">
                            65%
                        </div>
                    </div>

                    <div className="bg-white border-[3px] border-black rounded-[1.5rem] shadow-pop-lime p-6 md:p-8 relative transition-all duration-300">
                        <div className="text-center mb-8">
                            <div className="relative inline-block px-3 py-1 bg-pop-purple text-white border-2 border-black font-black text-[10px] uppercase tracking-widest -rotate-2 shadow-pop mb-4">
                                BETA FEEDBACK
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-3 uppercase">
                                THE <br />
                                <span className="text-white inline-block drop-shadow-[2px_2px_0px_#000000] text-stroke-black" style={{ WebkitTextStroke: '1.2px black' }}>FEEDBACK</span>
                                <span className="text-lab-pink italic block md:inline ml-2">LAB</span>
                            </h1>
                            <p className="text-base font-bold text-zinc-700 max-w-md mx-auto mt-4">
                                Help us calibrate the future of experimental AI architectures.
                            </p>
                        </div>

                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-4">
                                <label className="block text-lg md:text-xl font-black tracking-tight text-center md:text-left">
                                    Which lab experiment are you using most?
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {experiments.map((exp) => (
                                        <div
                                            key={exp.id}
                                            onClick={() => setSelectedExperiment(exp.id)}
                                            className={`flex flex-col items-center justify-center gap-2 p-4 bg-white border-2 border-black rounded-xl font-black text-base transition-all hover:scale-[1.02] active:scale-95 shadow-pop hover:bg-pop-yellow cursor-pointer select-none text-center ${selectedExperiment === exp.id ? 'bg-accent-green -translate-y-1 shadow-pop-hover' : ''}`}
                                        >
                                            <span className="material-symbols-outlined text-3xl">{exp.icon}</span>
                                            {exp.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-2">
                                    <label className="block text-lg md:text-xl font-black tracking-tight">
                                        Satisfaction Level
                                    </label>
                                    <span className="text-3xl font-black text-accent-green drop-shadow-[2px_2px_0px_#000]">{satisfaction}</span>
                                </div>
                                <div className="px-1">
                                    <input
                                        className="w-full appearance-none bg-black h-2 rounded-full outline-none border border-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-accent-green [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-pop [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                                        max="10"
                                        min="0"
                                        step="0.1"
                                        type="range"
                                        value={satisfaction}
                                        onChange={(e) => setSatisfaction(parseFloat(e.target.value))}
                                    />
                                    <div className="flex justify-between mt-3 font-black text-[9px] uppercase tracking-widest">
                                        <span className="text-zinc-500 bg-zinc-100 px-2 py-0.5 border border-black rounded-md">Pure Chaos</span>
                                        <span className="text-zinc-900 bg-accent-green px-2 py-0.5 border border-black rounded-md">Absolute Magic</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-lg md:text-xl font-black tracking-tight">
                                    What should we build next?
                                </label>
                                <div className="border-[3px] border-black rounded-[1.5rem] p-4 bg-white relative shadow-pop">
                                    <textarea
                                        className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:text-zinc-300 resize-none min-h-[100px] outline-none"
                                        placeholder="Unleash your wildest ideas here..."
                                        rows={3}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    ></textarea>
                                    <div className="absolute -bottom-3 -right-3 bg-pop-yellow border-2 border-black p-1.5 rounded-lg rotate-12 shadow-pop">
                                        <span className="material-symbols-outlined text-xl text-black">edit</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-center">
                                <button className="bg-accent-green text-black border-2 border-black rounded-full font-black text-lg py-3 px-8 shadow-pop hover:shadow-pop-hover hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full md:w-auto" type="submit">
                                    TRANSMIT FEEDBACK
                                    <span className="material-symbols-outlined text-xl">send</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-12 pt-8 border-t-[3px] border-black/10 flex flex-wrap justify-center gap-8">
                            <div className="text-center group">
                                <div className="text-2xl font-black group-hover:text-lab-pink transition-colors">2.4k</div>
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Responses</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-2xl font-black group-hover:text-accent-green transition-colors">98%</div>
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Constructive</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-2xl font-black group-hover:text-secondary transition-colors">4min</div>
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Avg Time</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="pt-6 pb-16 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="p-1 bg-black rounded-md">
                        <span className="material-symbols-outlined text-white text-lg fill-1">science</span>
                    </div>
                    <span className="font-black tracking-tighter text-xl uppercase">Noir Labs</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Pop Edition V3 • Experimental Research Survey</p>
                <div className="mt-4 flex justify-center gap-3">
                    <span className="material-symbols-outlined text-zinc-300 text-base">star</span>
                    <span className="material-symbols-outlined text-zinc-300 text-base">star</span>
                    <span className="material-symbols-outlined text-zinc-300 text-base">star</span>
                </div>
            </footer>
        </div>
    );
};

export default SurveyPage;
