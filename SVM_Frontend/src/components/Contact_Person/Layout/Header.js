import { Search, Bell, Clock, Globe, ArrowLeft, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileMenu } from '../../../reducers/uiSlice';

const Header = ({ title }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useSelector(state => state.ui.isMobile);
    const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);

    return (
        <header className="h-24 pt-6 bg-[var(--color-bg-default)]/90 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-10 flex items-center justify-between border-b border-white/[0.05] shadow-2xl">
            <div className="flex items-center gap-4 md:gap-10 flex-1 truncate">
                {isMobile ? (
                    <button
                        onClick={() => dispatch(toggleMobileMenu())}
                        className="p-2.5 text-primary transition-all bg-white/[0.03] border border-white/10 rounded-xl hover:bg-primary/10 active:scale-95 shadow-lg flex-shrink-0"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl text-gray-300 hover:text-white transition-all bg-white/[0.03] border border-white/5 hover:border-white/20 group flex-shrink-0"
                        title="Go Back"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                )}
                <div className="flex flex-col">

                    <h2 className="text-sm md:text-base font-bold tracking-tight text-white uppercase truncate">{title}</h2>
                </div>

                <div className="hidden lg:flex max-w-sm w-full relative group ml-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300/80 group-focus-within:text-primary transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Search matrix..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/5 focus:border-primary/30 focus:bg-white/[0.04] rounded-xl text-[14px] transition-all outline-none text-white placeholder:text-gray-300/30 uppercase tracking-widest"
                    />
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-6 pr-8 border-r border-white/10">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-primary/80 mb-0.5">
                            <Globe size={10} className="animate-pulse" />
                            <span className="text-[12px] font-medium tracking-widest uppercase">NODE: 08_COL</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300/80">
                            <Clock size={10} />
                            <span className="text-[12px] font-medium tracking-widest uppercase">14:18 GMT</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 cursor-pointer group transition-all">
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)] border border-[var(--color-bg-default)]"></div>
                        <Bell size={18} className="text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
