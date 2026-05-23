import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiTarget,
  FiColumns,
  FiActivity,
  FiX,
} from 'react-icons/fi';

const menu = [
  { to: '/dashboard', icon: FiGrid, label: 'Home' },
  { to: '/leads', icon: FiTarget, label: 'Leads' },
  { to: '/pipeline', icon: FiColumns, label: 'Pipeline' },
  { to: '/team', icon: FiUsers, label: 'Team' },
  { to: '/activities', icon: FiActivity, label: 'History' },
];

const SidebarNav = ({ onNavigate }) => (
  <>
    <div className="flex h-16 items-center gap-2.5 border-b border-surface-200 px-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
        BD
      </div>
      <div>
        <p className="text-sm font-semibold text-surface-900">Sales Workspace</p>
        <p className="text-xs text-slate-500">Manufacturing BD</p>
      </div>
    </div>

    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Menu
      </p>
      {menu.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-surface-100'
            }`
          }
        >
          <Icon className="h-5 w-5 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-surface-200 p-4">
      <p className="rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-400">
        Tip: open <strong className="text-slate-200">Pipeline</strong> and drag cards to
        update deal status.
      </p>
    </div>
  </>
);

const Sidebar = ({ mobileOpen, onClose }) => (
  <>
    {mobileOpen && (
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
    )}

    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-surface-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-surface-100 lg:hidden"
      >
        <FiX className="h-5 w-5" />
      </button>
      <SidebarNav onNavigate={onClose} />
    </aside>
  </>
);

export default Sidebar;
