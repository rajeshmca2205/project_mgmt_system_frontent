import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-transform ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <h1 className="text-lg font-bold text-slate-900">
            Project Manager
          </h1>
        </div>

        <nav className="space-y-2 p-4">

          <NavLink
            to="/"
            onClick={onClose}
            className={linkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            onClick={onClose}
            className={linkClass}
          >
            Projects
          </NavLink>

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;