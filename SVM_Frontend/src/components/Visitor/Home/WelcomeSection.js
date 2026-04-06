import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const WelcomeSection = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.login);
    const isVisitor = user?.ResultSet?.[0]?.VA_Role === 'Visitor';

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-24 md:pt-0">
            {/* Background Layer with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/main.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 30%',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-black/65"></div>
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            </div>

            <div className="w-full px-6 md:px-16 lg:px-24 xl:px-32 relative z-10">
                <div className="max-w-6xl">
                    <div className="mb-8">
                        <span className="text-primary font-black uppercase tracking-[0.4em] text-sm md:text-base">Facility Intelligence</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-6xl md:text-8xl lg:text-[6vw] font-black text-white leading-tight tracking-[-0.03em] uppercase m-0 p-0 drop-shadow-2xl">
                            Visitor
                        </h1>
                        <h1 className="text-5xl md:text-7xl lg:text-[5vw] font-black leading-tight tracking-[-0.03em] uppercase m-0 p-0 drop-shadow-2xl">
                            <span className="text-primary mr-4">Access</span>
                            <span className="text-white">Portal</span>
                        </h1>
                    </div>

                    <div className="space-y-10 mb-14">
                        <div className="relative">
                            <div className="mt-1">
                                <p className="text-white text-lg md:text-2xl font-medium max-w-4xl leading-relaxed drop-shadow-md">
                                    Secure, streamlined, and enterprise-grade access management <br className="hidden md:block" />
                                    for <span className="text-primary font-black underline underline-offset-4 decoration-2">MAS Holdings</span> world-class manufacturing facilities.
                                </p>
                            </div>
                        </div>

                        <p className="text-white/90 text-lg md:text-2xl font-medium max-w-3xl leading-relaxed drop-shadow-md">
                            Experience the next generation of facility access. A seamless, high-security digital gateway designed for the modern enterprise.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {isVisitor ? (
                            <button
                                onClick={() => navigate('/visitor/my-requests')}
                                className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-black uppercase text-sm md:text-base tracking-[0.2em] border border-primary hover:bg-[var(--color-primary-hover)] transition-all rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group"
                            >
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                My Visit Requests
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/request-step-1')}
                                className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-black uppercase text-sm md:text-base tracking-[0.2em] border border-primary hover:bg-[var(--color-primary-hover)] transition-all rounded-xl shadow-lg shadow-primary/20"
                            >
                                Request a Visit
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/access')}
                            className="w-full sm:w-auto px-12 py-5 bg-transparent text-white font-black uppercase text-sm md:text-base tracking-[0.2em] border border-white/20 hover:bg-white/5 transition-all text-center rounded-xl"
                        >
                            About Access
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;
