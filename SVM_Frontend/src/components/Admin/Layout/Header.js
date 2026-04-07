import { Search, Bell, Settings, User, ArrowLeft, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileMenu } from '../../../reducers/uiSlice';
import ThemeToggleButton from '../../common/ThemeToggleButton';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useSelector(state => state.ui.isMobile);
  const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);
  const user = useSelector(state => state.login.user);
  
  const userEmail = user?.ResultSet?.[0]?.VA_Email || user?.ResultSet?.[0]?.VCP_Email || 'ROOT.ADMIN';

  return (
    <header className="h-16 md:h-20 bg-secondary/95 backdrop-blur sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between border-b border-white/10 shadow-2xl">
      <div className="flex-1 max-w-xl flex items-center gap-3 md:gap-4">
        {isMobile ? (
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="p-2.5 text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 active:scale-95 transition-all shadow-lg"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="p-3 text-gray-300 hover:text-white transition-colors bg-white/5 border border-white/10 group rounded-lg"
            title="Go Back"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        )}
        <div className="relative group w-full hidden sm:block max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-all duration-300"
            size={14}
          />
          <input
            type="text"
            placeholder="Search system nodes..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 focus:border-primary/40 focus:bg-white/[0.05] rounded-xl text-[14px] text-white placeholder:text-gray-500 outline-none transition-all uppercase tracking-widest"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <ThemeToggleButton />
          <button className="relative p-2 text-gray-300 hover:text-white transition-all group">
            <Bell size={18} strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_5px_var(--color-primary)]"></span>
          </button>
          <button className="p-2 text-gray-300 hover:text-white transition-all">
            <Settings size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>

        <button className="flex items-center gap-4 group text-left">
          <div className="hidden md:block">
            <p className="text-white uppercase mb-0.5 max-w-[150px] truncate">{userEmail}</p>
            <p className="text-primary uppercase text-right">ROOT ADMIN</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:bg-primary group-hover:text-white transition-all text-primary">
            <User size={20} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
