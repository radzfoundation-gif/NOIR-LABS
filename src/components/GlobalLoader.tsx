
import React, { useEffect, useState } from 'react';

const GlobalLoader: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 6 ? prev + 1 : 0));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
            <div className="corner-gradient-pink"></div>
            <div className="corner-gradient-cyan"></div>

            <span className="material-symbols-outlined floating-doodle text-pop-yellow text-7xl top-[10%] left-[15%] rotate-12" style={{ animationDelay: '0s' }}>star</span>
            <span className="material-symbols-outlined floating-doodle text-secondary text-5xl top-[15%] right-[20%] -rotate-12" style={{ animationDelay: '1s' }}>blur_on</span>
            <span className="material-symbols-outlined floating-doodle text-primary text-6xl bottom-[15%] left-[20%] rotate-45" style={{ animationDelay: '0.5s' }}>bolt</span>
            <span className="material-symbols-outlined floating-doodle text-accent-green text-8xl bottom-[25%] right-[10%] -rotate-6" style={{ animationDelay: '1.5s' }}>auto_awesome</span>
            <span className="material-symbols-outlined floating-doodle text-pop-purple text-4xl top-[45%] left-[5%]" style={{ animationDelay: '0.2s' }}>emergency</span>
            <span className="material-symbols-outlined floating-doodle text-secondary text-4xl bottom-[10%] right-[30%]" style={{ animationDelay: '1.2s' }}>cyclone</span>
            <span className="material-symbols-outlined floating-doodle text-primary text-3xl top-[30%] right-[5%]" style={{ animationDelay: '0.8s' }}>grade</span>

            <div className="flex flex-col items-center gap-16 relative z-10">
                <h1 className="font-handwritten text-6xl md:text-8xl tracking-wider text-pop-title text-white transform -rotate-2 select-none">
                    CONDUCTING EXPERIMENTS...
                </h1>

                <div className="flask-container">
                    <div className="flask-rim"></div>
                    <div className="flask-neck"></div>
                    <div className="flask-body">
                        <div className="liquid-vibrant"></div>
                        <div className="absolute top-8 left-6 w-6 h-16 bg-white/40 rounded-full blur-[1px]"></div>
                        <div className="absolute bottom-8 right-6 w-4 h-4 bg-white/30 rounded-full blur-[1px]"></div>
                        <div className="absolute bottom-[40%] left-[30%] w-3 h-3 bg-white/60 rounded-full"></div>
                        <div className="absolute bottom-[55%] right-[40%] w-2 h-2 bg-white/60 rounded-full"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-8">
                    <div className="flex gap-3">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className={`progress-block ${i <= progress ? 'active' : 'bg-white'}`}></div>
                        ))}
                    </div>

                    <div className="flex gap-12">
                        <div className="flex items-center gap-3 neobrutal-card !py-2 !px-4 transform -rotate-1">
                            <div className="w-4 h-4 bg-accent-green border-2 border-black rounded-full shadow-[2px_2px_0px_black]"></div>
                            <span className="font-black text-sm uppercase italic">Reactants: Pure</span>
                        </div>
                        <div className="flex items-center gap-3 neobrutal-card !py-2 !px-4 transform rotate-1">
                            <div className="w-4 h-4 bg-pop-purple border-2 border-black rounded-full shadow-[2px_2px_0px_black]"></div>
                            <span className="font-black text-sm uppercase italic">Yield: 98.4%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-10 left-10 hidden md:block">
                <div className="neobrutal-card flex items-center gap-4">
                    <div className="w-14 h-14 bg-pop-yellow border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_black]">
                        <span className="material-symbols-outlined font-black text-3xl">terminal</span>
                    </div>
                    <div>
                        <div className="font-black text-sm uppercase tracking-wider">System Initialized</div>
                        <div className="font-bold text-xs text-primary bg-black px-2 py-0.5 inline-block mt-1">v3.0.0-NOIR</div>
                    </div>
                </div>
            </div>

            <div className="fixed top-10 right-10 hidden md:block">
                <div className="neobrutal-card !bg-black !text-white transform -rotate-1">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse shadow-[0_0_10px_#05ffa1]"></div>
                        <span className="font-black text-sm tracking-[0.2em] uppercase">Lab Status: Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
