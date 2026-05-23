import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, alternate }) => (
  <div className="flex min-h-screen">
    <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-12 text-white lg:flex">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-sm font-bold">
          BD
        </div>
        <span className="text-lg font-semibold">BDA Sales Workspace</span>
      </Link>

      <div>
        <h2 className="text-3xl font-bold leading-tight">
          One place for your manufacturing sales pipeline
        </h2>
        <p className="mt-4 max-w-md text-slate-400">
          I built this dashboard so BD teams can track enquiries, assign owners, and
          move deals from first contact to close — without juggling multiple spreadsheets.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Kanban board for deal stages
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Team workload and conversion stats
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Secure login with JWT
          </li>
        </ul>
      </div>

      <p className="text-sm text-slate-500">Internship project · MERN stack</p>
    </div>

    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-surface-200 bg-white px-6 py-4 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
          BD
        </div>
        <span className="font-semibold text-surface-900">BDA Sales Workspace</span>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:mb-10">
            <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {children}
          {alternate && <div className="mt-6">{alternate}</div>}
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
