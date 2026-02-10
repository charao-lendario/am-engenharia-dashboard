import { Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-navy-800 border-b border-navy-600 flex items-center px-4 gap-4 shrink-0">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden text-gray-400 hover:text-gold-400 transition-colors"
      >
        <Menu size={24} />
      </button>
      <img src="/logo.webp" alt="AM Engenharia" className="h-16 w-auto" />
    </header>
  );
}
