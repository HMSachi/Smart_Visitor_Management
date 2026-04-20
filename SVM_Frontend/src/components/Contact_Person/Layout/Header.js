import { Search, Bell, Clock, Globe, ArrowLeft, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileMenu } from '../../../reducers/uiSlice';
import ThemeToggleButton from '../../common/ThemeToggleButton';

const Header = ({ title }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useSelector(state => state.ui.isMobile);
    const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);
    const user = useSelector(state => state.login.user);
    
    // Improved detection to ensure userEmail survives a page refresh via direct session check fallback
    const getIdentity = () => {
        const currentUser = user?.ResultSet?.[0] || user?.data?.ResultSet?.[0];
        if (currentUser?.VCP_Email) return currentUser.VCP_Email;
        if (currentUser?.VA_Email) return currentUser.VA_Email;
        
        // Fallback to direct session parsing
        const persisted = localStorage.getItem('user_session');
        if (persisted) {
            try {
                const sessionData = JSON.parse(persisted);
                const sessionUser = sessionData?.ResultSet?.[0] || sessionData?.data?.ResultSet?.[0];
                return sessionUser?.VCP_Email || sessionUser?.VA_Email || 'ACCOUNT.ACTIVE';
            } catch (e) { return 'ACCOUNT.ACTIVE'; }
        }
        return 'ACCOUNT.ACTIVE';
    };

    const userEmail = getIdentity();

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

            </div>

            <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-6 pr-8 border-r border-white/10">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-primary/80 mb-0.5">
                            <span className="text-[12px] font-medium tracking-widest uppercase">{userEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300/80">
                            <Globe size={10} className="animate-pulse" />
                            <span className="text-[10px] font-medium tracking-[0.1em] uppercase">SYSTEM CONNECTED</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggleButton />
                </div>
            </div>
        </header>
    );
};

export default Header;
