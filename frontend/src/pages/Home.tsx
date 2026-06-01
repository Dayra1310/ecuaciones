import { useState } from "react";
import { EquationMenu } from "../components/EquationMenu";
import type { EquationOption } from "../components/EquationMenu";
import { ModelExplanation } from "../components/ModelExplanation";
import { PopulationForm } from "../components/PopulationForm";
import { PopulationResult } from "../components/PopulationResult";
import { DecayForm } from "../components/DecayForm";
import { DecayResult } from "../components/DecayResult";
import { NewtonForm } from "../components/NewtonForm";
import { NewtonResult } from "../components/NewtonResult";
import { C14Form } from "../components/C14Form";
import { C14Result } from "../components/C14Result";
import { Quiz } from "../components/Quiz";
import { Quiz2 } from "../components/Quiz2";
import { SympyPanel } from "../components/SympyPanel";
import { usePopulationGrowth } from "../hooks/usePopulationGrowth";
import { useRadioactiveDecay } from "../hooks/useRadioactiveDecay";
import { useNewtonCooling } from "../hooks/useNewtonCooling";
import { useC14Dating } from "../hooks/useC14Dating";
import type { PopulationGrowthResponse, RadioactiveDecayResponse, NewtonCoolingResponse, C14DatingResponse } from "../types/equation";

const options: EquationOption[] = [
  {
    id: "crecimiento",
    title: "Crecimiento proporcional",
    formula: "dP/dt = k·P",
    description: "Modela poblaciones, inversiones y fenómenos de crecimiento continuo",
    M: "k*y",
    N: "-1",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
  {
    id: "decaimiento",
    title: "Decaimiento radiactivo",
    formula: "dA/dt = -k·A",
    description: "Describe la desintegración de núcleos inestables con el tiempo",
    M: "-l*y",
    N: "-1",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    id: "newton",
    title: "Ley de Newton",
    formula: "dT/dt = k·(T - Tₘ)",
    description: "Modela el enfriamiento de un cuerpo en un medio ambiente",
    M: "k*(y - Tm)",
    N: "-1",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    id: "c14",
    title: "Carbono-14",
    formula: "dN/dt = -k·N,   k = ln(2)/5730",
    description: "Método de datación basado en la desintegración del ¹⁴C",
    M: "-l*y",
    N: "-1",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  },
];

export function Home() {
  const popMutation = usePopulationGrowth();
  const decayMutation = useRadioactiveDecay();
  const newtonMutation = useNewtonCooling();
  const c14Mutation = useC14Dating();

  const [popResult, setPopResult] = useState<PopulationGrowthResponse | null>(null);
  const [decayResult, setDecayResult] = useState<RadioactiveDecayResponse | null>(null);
  const [newtonResult, setNewtonResult] = useState<NewtonCoolingResponse | null>(null);
  const [c14Result, setC14Result] = useState<C14DatingResponse | null>(null);
  const [popP0, setPopP0] = useState<number>(0);
  const [newtonParams, setNewtonParams] = useState({ Tm: 0, T0: 0 });
  const [popT2, setPopT2] = useState<number>(0);
  const [popAtT2, setPopAtT2] = useState<number | null>(null);
  const [newtonT2, setNewtonT2] = useState<number>(0);
  const [newtonAtT2, setNewtonAtT2] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<EquationOption | null>(null);
  const [showExplanation, setShowExplanation] = useState(true);
  const [mostrandoEvaluacion, setMostrandoEvaluacion] = useState(false);
  const [mostrandoEvaluacion2, setMostrandoEvaluacion2] = useState(false);
  const [mostrandoSympy, setMostrandoSympy] = useState(false);

  const handleSelect = (opt: EquationOption) => {
    setSelected(opt);
    setShowExplanation(true);
    setPopResult(null);
    setDecayResult(null);
    setNewtonResult(null);
    setC14Result(null);
    setPopAtT2(null);
    setNewtonAtT2(null);
    setError(null);
  };

  const handlePopulationSolve = (P0: number, P: number, t: number, t2: number) => {
    setPopP0(P0);
    setPopT2(t2);
    setError(null);
    popMutation.mutate(
      { P0, P, t, t2 },
      {
        onSuccess: (data) => {
          setPopResult(data);
          setPopAtT2(data.popAtT2);
        },
        onError: (err) => setError((err.response?.data as { detail?: string })?.detail ?? err.message),
      }
    );
  };

  const handleDecaySolve = (A1: number, A2: number, t: number) => {
    setError(null);
    decayMutation.mutate(
      { A1, A2, t },
      {
        onSuccess: (data) => setDecayResult(data),
        onError: (err) => setError((err.response?.data as { detail?: string })?.detail ?? err.message),
      }
    );
  };

  const handleC14Solve = (N: number) => {
    setError(null);
    c14Mutation.mutate(
      { N0: 100, N },
      {
        onSuccess: (data) => setC14Result(data),
        onError: (err) => setError((err.response?.data as { detail?: string })?.detail ?? err.message),
      }
    );
  };

  const handleNewtonSolve = (Tm: number, T0: number, t: number, T: number, t2: number) => {
    setNewtonParams({ Tm, T0 });
    setNewtonT2(t2);
    setError(null);
    newtonMutation.mutate(
      { Tm, T0, t, T, t2 },
      {
        onSuccess: (data) => {
          setNewtonResult(data);
          setNewtonAtT2(data.tempAtT2);
        },
        onError: (err) => setError((err.response?.data as { detail?: string })?.detail ?? err.message),
      }
    );
  };

  const handleBack = () => {
    setSelected(null);
    setShowExplanation(true);
    setPopResult(null);
    setDecayResult(null);
    setNewtonResult(null);
    setC14Result(null);
    setNewtonParams({ Tm: 0, T0: 0 });
    setPopAtT2(null);
    setNewtonAtT2(null);
    setError(null);
  };

  const handleVolverDeEvaluacion = () => {
    setMostrandoEvaluacion(false);
    setMostrandoEvaluacion2(false);
    setMostrandoSympy(false);
    setSelected(null);
  };

  if (mostrandoEvaluacion) {
    return (
      <div className="container">
        <button className="back-btn" onClick={handleVolverDeEvaluacion}>← Volver al menú</button>
        <Quiz />
      </div>
    );
  }

  if (mostrandoEvaluacion2) {
    return (
      <div className="container">
        <button className="back-btn" onClick={handleVolverDeEvaluacion}>← Volver al menú</button>
        <Quiz2 />
      </div>
    );
  }

  if (mostrandoSympy) {
    return (
      <div className="container">
        <button className="back-btn" onClick={handleVolverDeEvaluacion}>← Volver al menú</button>
        <SympyPanel />
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="container">
        <div className="landing">
          <h1>Ecuaciones diferenciales</h1>
          <p className="subtitle">Bienvenido, selecciona qué ecuación quieres resolver</p>
          <EquationMenu options={options} onSelect={handleSelect} />
          <div className="evaluacion-section">
            <div className="evaluacion-card" onClick={() => setMostrandoEvaluacion(true)}>
              <div className="evaluacion-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <div className="evaluacion-body">
                <h3>Evaluación 1</h3>
                <p className="evaluacion-desc">5 ejercicios aleatorios. Ingresa el valor de k y la proyección. Nota de 0 a 5.</p>
              </div>
            </div>
            <div className="evaluacion-card" onClick={() => setMostrandoEvaluacion2(true)} style={{ marginTop: "1rem" }}>
              <div className="evaluacion-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><path d="M15 5l4 4"/></svg>
              </div>
              <div className="evaluacion-body">
                <h3>Evaluación 2 — Paso a paso</h3>
                <p className="evaluacion-desc">Identifica si la ecuación es lineal, el orden y completa los espacios en blanco del proceso de solución.</p>
              </div>
            </div>
            <div className="evaluacion-card" onClick={() => setMostrandoSympy(true)} style={{ marginTop: "1rem" }}>
              <div className="evaluacion-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/><path d="M8 15h4"/></svg>
              </div>
              <div className="evaluacion-body">
                <h3>Sympy: Motor Simbólico</h3>
                <p className="evaluacion-desc">Explora cómo Sympy construye cada modelo, preserva variables indeterminadas y genera fórmulas trazables.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showExplanation) {
    return (
      <div className="container">
        <ModelExplanation
          option={selected}
          onContinue={() => setShowExplanation(false)}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <button className="back-btn" onClick={handleBack}>← Volver al menú</button>
      <div className="main-layout solver-layout">
        {selected.id === "crecimiento" ? (
          <PopulationForm
            onSolve={handlePopulationSolve}
            isLoading={popMutation.isPending}
            defaultP0="500"
            defaultT="4"
            defaultP="900"
            defaultT2="8"
          />
        ) : selected.id === "decaimiento" ? (
          <DecayForm
            onSolve={handleDecaySolve}
            isLoading={decayMutation.isPending}
            defaultA1="100"
            defaultT="5"
            defaultA2="60"
          />
        ) : selected.id === "newton" ? (
          <NewtonForm
            onSolve={handleNewtonSolve}
            isLoading={newtonMutation.isPending}
            defaultTm="20"
            defaultT0="80"
            defaultT="10"
            defaultTFinal="50"
            defaultT2="20"
          />
        ) : (
          <C14Form
            onSolve={handleC14Solve}
            isLoading={c14Mutation.isPending}
            defaultN="25"
          />
        )}
        <div className="output">
          {error && <div className="error">{error}</div>}
          {popResult && <PopulationResult result={popResult} P0={popP0} t2={popT2} popAtT2={popAtT2} />}
          {decayResult && <DecayResult result={decayResult} />}
          {newtonResult && <NewtonResult result={newtonResult} Tm={newtonParams.Tm} T0={newtonParams.T0} t2={newtonT2} tempAtT2={newtonAtT2} />}
          {c14Result && <C14Result result={c14Result} />}
          {!popResult && !decayResult && !newtonResult && !c14Result && !error && (
            <div className="placeholder">Completa los datos y presiona "Resolver" para ver la solución</div>
          )}
        </div>
      </div>
    </div>
  );
}
