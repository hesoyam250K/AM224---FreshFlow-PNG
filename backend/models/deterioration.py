import numpy as np
import math
from typing import Union

def deterioration_ode(t: float, q: float, k: float) -> float:
    """
    Autonomous first-order differential equation for produce deterioration:
    dQ/dt = -k * Q
    """
    return -k * max(0.0, q)

def analytical_deterioration(t: Union[float, np.ndarray], q0: float, k: float) -> Union[float, np.ndarray]:
    """
    Exact analytical solution:
    Q(t) = Q0 * exp(-k * t)
    """
    if q0 < 0:
        raise ValueError("Initial quantity q0 must be non-negative.")
    if k < 0:
        raise ValueError("Deterioration rate k must be non-negative.")
    
    return q0 * np.exp(-k * t)

def calculate_half_life(k: float) -> float:
    """
    Calculate crop half-life t_1/2 = ln(2) / k in hours.
    Returns infinity if k == 0.
    """
    if k <= 0:
        return float('inf')
    return math.log(2) / k

def calculate_time_to_90_percent_loss(k: float) -> float:
    """
    Calculate time t for 90% loss (10% remaining): Q(t) = 0.1 * Q0 => t = ln(10) / k.
    """
    if k <= 0:
        return float('inf')
    return math.log(10) / k
