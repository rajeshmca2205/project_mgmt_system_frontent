interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:px-6">
      
      <button
        onClick={onMenuClick}
        className="mr-4 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        ☰
      </button>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Project Management
        </h2>

        <p className="hidden text-xs text-slate-500 sm:block">
          Manage your projects and tasks
        </p>
      </div>
    </header>
  );
};

export default Header;