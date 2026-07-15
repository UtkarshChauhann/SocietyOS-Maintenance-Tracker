import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Command,
  Gauge,
  LogOut,
  Menu,
  Megaphone,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Search,
  Settings,
  Sun,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const pageNames = {
  '/admin/dashboard': 'Dashboard',
  '/admin/complaints': 'Complaints',
  '/admin/notices/new': 'Post notice',
  '/complaints': 'My complaints',
  '/complaints/new': 'New complaint',
  '/notices': 'Notice board'
};

const adminNav = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: Gauge },
  { label: 'Complaints', to: '/admin/complaints', icon: ClipboardList },
  { label: 'Notice board', to: '/notices', icon: Megaphone },
  { label: 'Post notice', to: '/admin/notices/new', icon: PlusCircle }
];

const residentNav = [
  { label: 'My complaints', to: '/complaints', icon: ClipboardList },
  { label: 'New complaint', to: '/complaints/new', icon: PlusCircle },
  { label: 'Notice board', to: '/notices', icon: Megaphone }
];

const SidebarContent = ({ collapsed, navItems, onNavigate, onToggle, mobile = false }) => (
  <div className="flex h-full flex-col">
    <div className={`flex h-16 items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3`}>
      <Logo compact={collapsed} />
      {!collapsed && !mobile ? (
        <button
          className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800"
          onClick={onToggle}
          type="button"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={19} />
        </button>
      ) : null}
    </div>

    <nav className="mt-5 grid gap-1.5 px-2" aria-label="Primary navigation">
      {navItems.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          title={collapsed ? label : undefined}
          aria-label={collapsed ? label : undefined}
          className={({ isActive }) =>
            `focus-ring relative flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition ${
              collapsed ? 'justify-center' : 'gap-3'
            } ${
              isActive
                ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/70 dark:text-teal-200'
                : 'text-muted hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <motion.span
                  layoutId={mobile ? 'mobile-nav-active' : 'desktop-nav-active'}
                  className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-brand"
                />
              ) : null}
              <Icon size={19} strokeWidth={2} aria-hidden="true" />
              {!collapsed ? <span>{label}</span> : null}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    <div className="mt-auto px-2 pb-2">
      {collapsed && !mobile ? (
        <button
          className="focus-ring flex min-h-11 w-full items-center justify-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800"
          onClick={onToggle}
          type="button"
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <PanelLeftOpen size={19} />
        </button>
      ) : (
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            All systems operational
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">Services are running normally.</p>
        </div>
      )}
    </div>
  </div>
);

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNav : residentNav;
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
        setProfileOpen(false);
        setNoticesOpen(false);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const filteredActions = useMemo(
    () => navItems.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    [navItems, search]
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const currentPage = location.pathname.startsWith('/complaints/')
    ? 'Complaint details'
    : pageNames[location.pathname] || 'Workspace';

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen shrink-0 p-3 lg:block" aria-label="Application sidebar">
          <motion.div
            animate={{ width: collapsed ? 72 : 256 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="surface h-full overflow-hidden"
          >
            <SidebarContent
              collapsed={collapsed}
              navItems={navItems}
              onToggle={() => setCollapsed((current) => !current)}
            />
          </motion.div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-line bg-panel/85 backdrop-blur-xl">
            <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-panel text-ink lg:hidden"
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>
              <div className="lg:hidden">
                <Logo compact />
              </div>

              <div className="hidden min-w-0 sm:block">
                <p className="text-xs font-medium text-muted">{user?.society?.name || 'SocietyOS'}</p>
                <p className="truncate text-sm font-bold text-ink">{currentPage}</p>
              </div>

              <button
                className="focus-ring ml-auto hidden h-10 w-full max-w-xs items-center gap-3 rounded-lg border border-line bg-slate-50 px-3 text-left text-sm text-muted transition hover:border-slate-300 hover:bg-panel dark:bg-slate-900 dark:hover:border-slate-600 sm:flex"
                type="button"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={17} />
                <span className="flex-1">Search workspace</span>
                <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 text-[10px] font-semibold">Ctrl K</kbd>
              </button>

              <button
                className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-panel text-muted transition hover:bg-slate-50 hover:text-ink dark:hover:bg-slate-800"
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
                title={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="relative">
                <button
                  className="focus-ring relative grid h-10 w-10 place-items-center rounded-lg border border-line bg-panel text-muted transition hover:bg-slate-50 hover:text-ink dark:hover:bg-slate-800"
                  type="button"
                  onClick={() => {
                    setNoticesOpen((current) => !current);
                    setProfileOpen(false);
                  }}
                  aria-label="Open notifications"
                  aria-expanded={noticesOpen}
                >
                  <Bell size={18} />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-panel bg-amber-500" />
                </button>
                <AnimatePresence>
                  {noticesOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="surface absolute right-0 top-12 w-72 p-2 shadow-lift"
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-bold text-ink">Notifications</p>
                        <p className="text-xs text-muted">Community updates in one place.</p>
                      </div>
                      <Link
                        className="focus-ring flex items-start gap-3 rounded-lg p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                        to="/notices"
                        onClick={() => setNoticesOpen(false)}
                      >
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          <Megaphone size={16} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">View community notices</span>
                          <span className="mt-0.5 block text-xs leading-5 text-muted">Important announcements stay pinned.</span>
                        </span>
                      </Link>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  className="focus-ring flex h-10 items-center gap-2 rounded-lg border border-line bg-panel p-1.5 pr-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  type="button"
                  onClick={() => {
                    setProfileOpen((current) => !current);
                    setNoticesOpen(false);
                  }}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-xs font-bold text-white dark:text-slate-950">
                    {initials || 'U'}
                  </span>
                  <span className="hidden max-w-28 truncate text-xs font-semibold text-ink xl:block">{user?.name}</span>
                  <ChevronDown className="hidden text-muted xl:block" size={14} />
                </button>
                <AnimatePresence>
                  {profileOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="surface absolute right-0 top-12 w-60 p-2 shadow-lift"
                    >
                      <div className="border-b border-line px-3 py-2.5">
                        <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
                        <p className="mt-0.5 text-xs capitalize text-muted">{user?.role} · {user?.society?.name || 'Society'}</p>
                      </div>
                      <button
                        className="focus-ring mt-1 flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted transition hover:bg-slate-50 hover:text-ink dark:hover:bg-slate-800"
                        type="button"
                        onClick={toggleTheme}
                      >
                        <Settings size={17} /> Appearance
                      </button>
                      <button
                        className="focus-ring flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                        type="button"
                        onClick={handleLogout}
                      >
                        <LogOut size={17} /> Log out
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="surface fixed inset-y-3 left-3 z-50 w-[min(280px,calc(100vw-24px))] overflow-hidden shadow-lift lg:hidden"
            >
              <button
                className="focus-ring absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X size={19} />
              </button>
              <SidebarContent mobile collapsed={false} navItems={navItems} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-950/50 px-4 pt-[12vh] backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Search workspace"
            onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className="surface w-full max-w-xl overflow-hidden shadow-lift"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search className="text-muted" size={19} />
                <input
                  autoFocus
                  className="h-14 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                  placeholder="Search pages and actions..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button
                  className="focus-ring rounded-md px-2 py-1 text-xs text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
                  type="button"
                  onClick={() => setSearchOpen(false)}
                >
                  Esc
                </button>
              </div>
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-muted">Quick navigation</p>
                {filteredActions.length ? (
                  filteredActions.map(({ label, to, icon: Icon }) => (
                    <Link
                      key={to}
                      className="focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      to={to}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearch('');
                      }}
                    >
                      <Icon size={18} className="text-muted" />
                      <span className="flex-1">{label}</span>
                      <Command size={14} className="text-muted" />
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-8 text-center text-sm text-muted">No matching pages.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
