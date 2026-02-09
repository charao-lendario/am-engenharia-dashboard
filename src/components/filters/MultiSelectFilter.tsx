import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

export function MultiSelectFilter({ label, options, selected, onToggle, onClear }: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          selected.length > 0
            ? 'bg-gold-500/20 text-gold-400'
            : 'bg-navy-700 text-gray-400 hover:text-white'
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="bg-gold-500 text-navy-900 px-1.5 rounded-full text-[10px]">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-navy-700 border border-navy-600 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
          {selected.length > 0 && (
            <button
              onClick={() => { onClear(); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-400 hover:bg-navy-600 transition-colors"
            >
              <X size={12} />
              Limpar seleção
            </button>
          )}
          {options.map(option => (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                selected.includes(option)
                  ? 'bg-gold-500/10 text-gold-400'
                  : 'text-gray-300 hover:bg-navy-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
