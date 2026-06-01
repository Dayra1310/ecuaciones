# Ecuaciones

Aplicación web desarrollada con:

- Frontend: React 19 + TypeScript + Vite
- Backend: FastAPI + Python
- Base matemática: SymPy y NumPy

## Ejecutar en local

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Despliegue en Render

La raiz del repositorio incluye `render.yaml`, listo para crear dos servicios con Render Blueprint:

- `ecuaciones-backend`: Web Service Python/FastAPI.
- `ecuaciones-frontend`: Static Site con Vite.

Pasos:

1. Sube el repositorio a GitHub.
2. En Render, crea un nuevo Blueprint desde el repositorio.
3. Render detectara `render.yaml` y configurara backend y frontend.
4. Si cambias los nombres de los servicios, actualiza estas variables:
   - Backend: `CORS_ORIGINS`
   - Frontend: `VITE_API_URL`

Valores importantes:

- Backend start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Frontend build command: `npm ci && npm run build`
- Frontend publish path: `dist`
- API publica esperada: `https://ecuaciones-backend.onrender.com/api/v1`
