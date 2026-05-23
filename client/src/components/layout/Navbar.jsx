import { useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Sales overview & performance' },
  '/leads': { title: 'Leads', subtitle: 'Manage and assign prospects' },
  '/pipeline': { title: 'Pipeline', subtitle: 'Kanban board for deal stages' },
  '/team': { title: 'Team', subtitle: 'BDA members & performance' },
  '/activities': { title: 'Activities', subtitle: 'Workspace timeline' },
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const page =
    location.pathname.startsWith('/leads/') && location.pathname !== '/leads'
      ? { title: 'Lead details', subtitle: 'View and edit lead' }
      : pageTitles[location.pathname] || pageTitles['/dashboard'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 hover:bg-surface-100 lg:hidden"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-surface-900">{page.title}</h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">{page.subtitle}</p>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 px-4 md:block">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search leads..."
              className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/leads?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-surface-100"
            aria-label="Notifications"
          >
            <FiBell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
          </button>

          <div className="flex items-center gap-2 border-l border-surface-200 pl-2 sm:gap-3 sm:pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-surface-900">{user?.name}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
              title="Logout"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
