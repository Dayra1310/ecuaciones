import { useState, useEffect } from "react";

interface Props {
  onSolve: (M: string, N: string) => void;
  isLoading: boolean;
  initialM?: string;
  initialN?: string;
  title?: string;
}

function preprocessExpr(s: string): string {
  return s
    .replace(/(\d)([a-zA-Z]+)/g, (_, d, l) => d + "*" + l.split("").join("*"))
    .replace(/\^/g, "**");
}

export function EquationForm({ onSolve, isLoading, initialM = "", initialN = "", title }: Props) {
  const [M, setM] = useState(initialM);
  const [N, setN] = useState(initialN);

  useEffect(() => {
    setM(initialM);
    setN(initialN);
  }, [initialM, initialN]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!M.trim() || !N.trim()) return;
    onSolve(preprocessExpr(M.trim()), preprocessExpr(N.trim()));
  };

  return (
    <form onSubmit={handleSubmit} className="equation-form">
      <h2>{title || "Resolver Ecuación Diferencial"}</h2>
      <p className="form-subtitle">Forma: M(x,y) dx + N(x,y) dy = 0</p>

      <div className="input-group">
        <label htmlFor="M">M(x, y)</label>
        <input
          id="M"
          type="text"
          value={M}
          onChange={(e) => setM(e.target.value)}
          placeholder="Ej: 2*x*y"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="N">N(x, y)</label>
        <input
          id="N"
          type="text"
          value={N}
          onChange={(e) => setN(e.target.value)}
          placeholder="Ej: x**2"
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Resolviendo..." : "Resolver"}
      </button>
    </form>
  );
}
