import numpy as np
from backend.models.deterioration import (
    deterioration_ode,
    calculate_half_life,
    calculate_time_to_90_percent_loss
)
from backend.models.supply_model import (
    supply_spoilage_ode,
    calculate_equilibrium
)
from backend.solvers.analytical import (
    solve_analytical_deterioration,
    solve_analytical_supply
)
from backend.solvers.numerical import runge_kutta_4, scipy_solve_ivp
from backend.schemas.simulation import (
    DeteriorationRequest,
    SupplyRequest,
    SimulationResponse,
    TimePoint,
    ErrorMetrics
)

def run_deterioration_simulation(req: DeteriorationRequest) -> SimulationResponse:
    """
    Simulates produce deterioration dQ/dt = -kQ.
    Computes analytical, custom RK4, and SciPy numerical solutions.
    """
    q0 = req.initial_quantity
    k = req.deterioration_rate
    duration = req.duration_hours
    h = req.step_size

    # Storage condition multiplier
    storage_mult = 1.0
    if req.storage_condition == 'poor':
        storage_mult = 1.65
    elif req.storage_condition == 'improved':
        storage_mult = 0.48

    effective_k = k * storage_mult

    # Define time steps
    num_steps = max(10, int(round(duration / h)))
    t_eval = np.linspace(0.0, duration, num_steps + 1)

    # 1. Analytical Solution
    y_analytical = solve_analytical_deterioration(q0, effective_k, t_eval)

    # 2. Custom RK4 Solution
    def ode_func(t: float, q: float) -> float:
        return deterioration_ode(t, q, effective_k)

    y_rk4 = runge_kutta_4(ode_func, q0, t_eval)

    # 3. SciPy solve_ivp Solution
    y_scipy = scipy_solve_ivp(ode_func, q0, t_eval)

    # Calculate error metrics against analytical solution
    err_rk4 = np.abs(y_rk4 - y_analytical)
    err_scipy = np.abs(y_scipy - y_analytical)

    error_metrics = ErrorMetrics(
        max_absolute_error_rk4=float(np.max(err_rk4)),
        max_absolute_error_scipy=float(np.max(err_scipy)),
        mean_absolute_error_rk4=float(np.mean(err_rk4)),
        mean_absolute_error_scipy=float(np.mean(err_scipy)),
        step_size=h
    )

    time_series = []
    for i in range(len(t_eval)):
        t_val = float(t_eval[i])
        q_ana = float(y_analytical[i])
        q_rk4 = float(y_rk4[i])
        q_sci = float(y_scipy[i])
        lost = max(0.0, q0 - q_ana)

        time_series.append(TimePoint(
            time_hours=round(t_val, 2),
            analytical_quantity=round(q_ana, 2),
            rk4_quantity=round(q_rk4, 2),
            scipy_quantity=round(q_sci, 2),
            quantity_lost=round(lost, 2),
            spoilage_rate_k=round(effective_k, 4)
        ))

    remaining = float(y_analytical[-1])
    lost_qty = max(0.0, q0 - remaining)
    pct_loss = (lost_qty / q0) * 100.0 if q0 > 0 else 0.0

    return SimulationResponse(
        produce_type=req.produce_type,
        scenario_id=req.scenario_id or "normal_journey",
        storage_condition=req.storage_condition or "normal",
        starting_quantity=q0,
        remaining_quantity_analytical=round(remaining, 2),
        remaining_quantity_rk4=round(float(y_rk4[-1]), 2),
        remaining_quantity_scipy=round(float(y_scipy[-1]), 2),
        quantity_lost=round(lost_qty, 2),
        percentage_loss=round(pct_loss, 2),
        half_life_hours=round(calculate_half_life(effective_k), 2) if effective_k > 0 else None,
        time_to_90_pct_loss_hours=round(calculate_time_to_90_percent_loss(effective_k), 2) if effective_k > 0 else None,
        equilibrium_quantity=None,
        effective_k=round(effective_k, 4),
        time_series=time_series,
        error_metrics=error_metrics
    )

def run_supply_simulation(req: SupplyRequest) -> SimulationResponse:
    """
    Simulates supply + spoilage ODE dQ/dt = S - kQ.
    Computes analytical, custom RK4, and SciPy numerical solutions.
    """
    q0 = req.initial_quantity
    s = req.supply_rate
    k = req.deterioration_rate
    duration = req.duration_hours
    h = req.step_size

    storage_mult = 1.0
    if req.storage_condition == 'poor':
        storage_mult = 1.65
    elif req.storage_condition == 'improved':
        storage_mult = 0.48

    effective_k = k * storage_mult

    num_steps = max(10, int(round(duration / h)))
    t_eval = np.linspace(0.0, duration, num_steps + 1)

    # 1. Analytical
    y_analytical = solve_analytical_supply(q0, s, effective_k, t_eval)

    # 2. Custom RK4
    def ode_func(t: float, q: float) -> float:
        return supply_spoilage_ode(t, q, s, effective_k)

    y_rk4 = runge_kutta_4(ode_func, q0, t_eval)

    # 3. SciPy solve_ivp
    y_scipy = scipy_solve_ivp(ode_func, q0, t_eval)

    err_rk4 = np.abs(y_rk4 - y_analytical)
    err_scipy = np.abs(y_scipy - y_analytical)

    error_metrics = ErrorMetrics(
        max_absolute_error_rk4=float(np.max(err_rk4)),
        max_absolute_error_scipy=float(np.max(err_scipy)),
        mean_absolute_error_rk4=float(np.mean(err_rk4)),
        mean_absolute_error_scipy=float(np.mean(err_scipy)),
        step_size=h
    )

    equilibrium = calculate_equilibrium(s, effective_k)
    eq_val = round(equilibrium, 2) if np.isfinite(equilibrium) else None

    time_series = []
    for i in range(len(t_eval)):
        t_val = float(t_eval[i])
        q_ana = float(y_analytical[i])
        q_rk4 = float(y_rk4[i])
        q_sci = float(y_scipy[i])

        time_series.append(TimePoint(
            time_hours=round(t_val, 2),
            analytical_quantity=round(q_ana, 2),
            rk4_quantity=round(q_rk4, 2),
            scipy_quantity=round(q_sci, 2),
            quantity_lost=round(max(0.0, q0 + s * t_val - q_ana), 2),
            spoilage_rate_k=round(effective_k, 4),
            equilibrium_quantity=eq_val
        ))

    remaining = float(y_analytical[-1])
    lost_qty = max(0.0, (q0 + s * duration) - remaining)
    pct_loss = (lost_qty / (q0 + s * duration)) * 100.0 if (q0 + s * duration) > 0 else 0.0

    return SimulationResponse(
        produce_type=req.produce_type,
        scenario_id=req.scenario_id or "normal_journey",
        storage_condition=req.storage_condition or "normal",
        starting_quantity=q0,
        remaining_quantity_analytical=round(remaining, 2),
        remaining_quantity_rk4=round(float(y_rk4[-1]), 2),
        remaining_quantity_scipy=round(float(y_scipy[-1]), 2),
        quantity_lost=round(lost_qty, 2),
        percentage_loss=round(pct_loss, 2),
        half_life_hours=round(calculate_half_life(effective_k), 2) if effective_k > 0 else None,
        time_to_90_pct_loss_hours=None,
        equilibrium_quantity=eq_val,
        effective_k=round(effective_k, 4),
        time_series=time_series,
        error_metrics=error_metrics
    )
