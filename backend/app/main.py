from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import equations

app = FastAPI(title="EDO Solver API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(equations.router, prefix="/api/v1")

@app.get("/health")
def health():
    return {"status": "ok"}
