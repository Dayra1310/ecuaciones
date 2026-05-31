import type { ReactNode } from "react";

export interface EquationOption {
  id: string;
  title: string;
  formula: string;
  description: string;
  M: string;
  N: string;
  icon: ReactNode;
  paramLabel?: string;
  paramDefault?: string;
  paramSymbol?: string;
}

interface Props {
  options: EquationOption[];
  onSelect: (option: EquationOption) => void;
}

export function EquationMenu({ options, onSelect }: Props) {
  return (
    <div className="equation-menu">
      {options.map((opt) => (
        <button key={opt.id} className="menu-card" onClick={() => onSelect(opt)}>
          <div className="menu-icon">{opt.icon}</div>
          <div className="menu-body">
            <h3>{opt.title}</h3>
            <div className="menu-formula">{opt.formula}</div>
            <p className="menu-desc">{opt.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
