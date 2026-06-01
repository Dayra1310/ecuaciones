import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import equations, quiz

app = FastAPI(title="EDO Solver API", version="1.0.0")

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=os.getenv("CORS_ORIGIN_REGEX"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(equations.router, prefix="/api/v1")
app.include_router(quiz.router, prefix="/api/v1")

@app.get("/health")
def health():
    return {"status": "ok"}
