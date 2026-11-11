from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class DeteriorationRequest(BaseModel):
    produce_type: str = Field("tomatoes", description="Produce type ID or name")
    initial_quantity: float = Field(1000.0, gt=0, description="Initial produce quantity Q0 in kg")
    deterioration_rate: float = Field(0.018, ge=0, description="Rate parameter k in hr^-1")
    duration_hours: float = Field(24.0, gt=0, description="Simulation time horizon in hours")
    step_size: float = Field(0.5, gt=0, description="Numerical RK4 step size h in hours")
    storage_condition: Optional[str] = Field("normal", description="Storage condition: poor, normal, or improved")
    scenario_id: Optional[str] = Field("normal_journey", description="Scenario identifier")

class SupplyRequest(BaseModel):
    produce_type: str = Field("tomatoes", description="Produce type ID or name")
    initial_quantity: float = Field(1000.0, ge=0, description="Initial produce quantity Q0 in kg")
    supply_rate: float = Field(40.0, ge=0, description="Incoming supply rate S in kg/hr")
    deterioration_rate: float = Field(0.018, ge=0, description="Deterioration rate parameter k in hr^-1")
    duration_hours: float = Field(24.0, gt=0, description="Simulation duration in hours")
    step_size: float = Field(0.5, gt=0, description="Numerical RK4 step size h in hours")
    storage_condition: Optional[str] = Field("normal", description="Storage condition")
    scenario_id: Optional[str] = Field("normal_journey", description="Scenario identifier")

class TimePoint(BaseModel):
    time_hours: float
    analytical_quantity: float
    rk4_quantity: float
    scipy_quantity: float
    quantity_lost: float
    spoilage_rate_k: float
    equilibrium_quantity: Optional[float] = None

class ErrorMetrics(BaseModel):
    max_absolute_error_rk4: float
    max_absolute_error_scipy: float
    mean_absolute_error_rk4: float
    mean_absolute_error_scipy: float
    step_size: float

class SimulationResponse(BaseModel):
    produce_type: str
    scenario_id: str
    storage_condition: str
    starting_quantity: float
    remaining_quantity_analytical: float
    remaining_quantity_rk4: float
    remaining_quantity_scipy: float
    quantity_lost: float
    percentage_loss: float
    half_life_hours: Optional[float] = None
    time_to_90_pct_loss_hours: Optional[float] = None
    equilibrium_quantity: Optional[float] = None
    effective_k: float
    time_series: List[TimePoint]
    error_metrics: ErrorMetrics

class ExplanationRequest(BaseModel):
    produce_type: str
    initial_quantity: float
    duration_hours: float
    storage_condition: str
    scenario_id: str
    spoilage_rate: float
    remaining_quantity: float
    quantity_lost: float
    percentage_loss: float
    half_life_hours: Optional[float] = None
    equilibrium_quantity: Optional[float] = None
    incoming_supply_rate: Optional[float] = None

class ExplanationResponse(BaseModel):
    explanation: str
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    engine: str
    version: str
