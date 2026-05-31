from pydantic import BaseModel


class StepDetail(BaseModel):
    title: str
    substeps: list[str]


class DifferentialEquationRequest(BaseModel):
    M: str
    N: str
    variable: str = "x"


class DifferentialEquationResponse(BaseModel):
    exact: bool
    solution: str | None = None
    integrating_factor: str | None = None
    method: str | None = None
    steps: list[StepDetail]


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
