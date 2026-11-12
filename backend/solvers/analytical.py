import numpy as np
from backend.models.deterioration import analytical_deterioration
from backend.models.supply_model import analytical_supply_spoilage

def solve_analytical_deterioration(q0: float, k: float, t_eval: np.ndarray) -> np.ndarray:
    """
    Evaluates analytical deterioration model Q(t) = Q0 * exp(-k*t) across time array.
    """
    return analytical_deterioration(t_eval, q0, k)

def solve_analytical_supply(q0: float, s: float, k: float, t_eval: np.ndarray) -> np.ndarray:
    """
    Evaluates analytical supply model Q(t) across time array.
    """
    return analytical_supply_spoilage(t_eval, q0, s, k)
