import os
from fastapi import FastAPI, HTTPException
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
    description="Python FastAPI engine for first-order ODE simulations and numerical solver comparisons.",
    version="2.0.0"
)

# Enable CORS for local development and Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok",
        engine="Python NumPy/SciPy ODE Solver",
        version="2.0.0"
    )

@app.post("/api/simulate/deterioration", response_model=SimulationResponse)
def simulate_deterioration(req: DeteriorationRequest):
    try:
        return run_deterioration_simulation(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/simulate/supply", response_model=SimulationResponse)
def simulate_supply(req: SupplyRequest):
    try:
        return run_supply_simulation(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/gemini/explain", response_model=ExplanationResponse)
def explain_simulation(req: ExplanationRequest):
    try:
        return generate_ai_explanation(req)
    except ValueError as ve:
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI explanation generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
