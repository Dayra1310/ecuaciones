from pydantic import BaseModel


class StepDetail(BaseModel):
    title: str
    substeps: list[str]


class PopulationGrowthRequest(BaseModel):
    P0: float
    P: float
    t: float


class PopulationGrowthResponse(BaseModel):
    k: float
    solution: str
    steps: list[StepDetail]


class RadioactiveDecayRequest(BaseModel):
    A1: float
    A2: float
    t: float


class RadioactiveDecayResponse(BaseModel):
    k: float
    half_life: float
    solution: str
    steps: list[StepDetail]


class C14DatingRequest(BaseModel):
    N0: float
    N: float


class C14DatingResponse(BaseModel):
    k: float
    age: float
    solution: str
    steps: list[StepDetail]


class NewtonCoolingRequest(BaseModel):
    Tm: float
    T0: float
    t: float
    T: float


class NewtonCoolingResponse(BaseModel):
    k: float
    solution: str
    steps: list[StepDetail]


class QuizExerciseParams(BaseModel):
    tipo: str
    P0: float | None = None
    P: float | None = None
    A1: float | None = None
    A2: float | None = None
    N: float | None = None
    Tm: float | None = None
    T0: float | None = None
    T: float | None = None
    t: float | None = None
    t2: float | None = None


class Quiz1Request(BaseModel):
    exercises: list[QuizExerciseParams]


class Quiz1ResultItem(BaseModel):
    k: float
    valorProyectado: float


class Quiz1Response(BaseModel):
    resultados: list[Quiz1ResultItem]


class Quiz2Blank(BaseModel):
    id: str
    respuesta: str | float


class Quiz2Response(BaseModel):
    blanks: list[Quiz2Blank]
