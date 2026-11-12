import os
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from backend.schemas.simulation import (
    DeteriorationRequest,
    SupplyRequest,
    ExplanationRequest,
    SimulationResponse,
    ExplanationResponse,
    HealthResponse
)
from backend.services.simulation import (
    run_deterioration_simulation,
    run_supply_simulation
)
from backend.services.ai_explanation import generate_ai_explanation

app = FastAPI(
    title="FreshFlow PNG V2 - Applied Mathematics API",
    description="FastAPI engine for first-order ODE simulations and numerical solver comparisons.",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok",
        engine="Python NumPy/SciPy ODE Solver",
        version="2.0.0"
    )

@router.post("/simulate/deterioration", response_model=SimulationResponse)
def simulate_deterioration(req: DeteriorationRequest):
    try:
        return run_deterioration_simulation(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/simulate/supply", response_model=SimulationResponse)
def simulate_supply(req: SupplyRequest):
    try:
        return run_supply_simulation(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/gemini/explain", response_model=ExplanationResponse)
def explain_simulation(req: ExplanationRequest):
    try:
        return generate_ai_explanation(req)
    except ValueError as ve:
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI explanation generation failed: {str(e)}")

# Mount router under both '/api' and root to guarantee compatibility with all Vercel rewrite patterns
app.include_router(router, prefix="/api")
app.include_router(router, prefix="")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
