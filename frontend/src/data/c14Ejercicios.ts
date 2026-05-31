export interface C14Ejercicio {
  id: number;
  N: string;
  contexto: string;
}

export const c14Ejercicios: C14Ejercicio[] = [
  { id: 1, N: "18", contexto: "Un fósil tiene hoy el 18% de ¹⁴C inicial." },
  { id: 2, N: "22", contexto: "Un fósil tiene actualmente el 22% de ¹⁴C inicial." },
  { id: 3, N: "35", contexto: "Una muestra arqueológica conserva el 35% del carbono 14 original." },
  { id: 4, N: "8", contexto: "Un hueso antiguo posee hoy el 8% de ¹⁴C inicial." },
  { id: 5, N: "42", contexto: "Una reliquia encontrada en una excavación conserva el 42% de su carbono 14 inicial." },
  { id: 6, N: "70", contexto: "Un fósil tiene actualmente el 70% del ¹⁴C original." },
  { id: 7, N: "5", contexto: "Una muestra orgánica conserva únicamente el 5% del carbono 14 inicial." },
  { id: 8, N: "28", contexto: "Un objeto arqueológico tiene hoy el 28% de ¹⁴C inicial." },
  { id: 9, N: "62", contexto: "Una pieza de madera antigua conserva el 62% del carbono 14 original." },
  { id: 10, N: "11", contexto: "Un fósil posee actualmente el 11% del ¹⁴C inicial." },
  { id: 11, N: "48", contexto: "Una muestra encontrada en una cueva conserva el 48% del carbono 14 inicial." },
  { id: 12, N: "2", contexto: "Un fósil tiene hoy el 2% de ¹⁴C original." },
  { id: 13, N: "55", contexto: "Una reliquia arqueológica conserva el 55% del carbono 14 inicial." },
  { id: 14, N: "32", contexto: "Un hueso fósil tiene actualmente el 32% del ¹⁴C inicial." },
  { id: 15, N: "14", contexto: "Una muestra orgánica conserva el 14% de carbono 14 original." },
  { id: 16, N: "9", contexto: "Un fósil presenta hoy el 9% del ¹⁴C inicial." },
  { id: 17, N: "80", contexto: "Una pieza arqueológica conserva el 80% del carbono 14 original." },
  { id: 18, N: "25", contexto: "Un fósil tiene actualmente el 25% del ¹⁴C inicial." },
  { id: 19, N: "38", contexto: "Una muestra antigua posee hoy el 38% del carbono 14 inicial." },
  { id: 20, N: "1", contexto: "Un objeto fósil conserva únicamente el 1% del ¹⁴C original." },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomC14Ejercicios(count: number): C14Ejercicio[] {
  return shuffle(c14Ejercicios).slice(0, count);
}
