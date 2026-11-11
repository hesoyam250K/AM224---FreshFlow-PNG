import numpy as np
from typing import Union

def supply_spoilage_ode(t: float, q: float, s: float, k: float) -> float:
    """
    First-order linear ODE for supply and deterioration:
    dQ/dt = S - k * Q
    """
    return s - k * max(0.0, q)

def analytical_supply_spoilage(
    t: Union[float, np.ndarray],
    q0: float,
    s: float,
    k: float
) -> Union[float, np.ndarray]:
    """
    Analytical solution for dQ/dt = S - kQ.
    For k > 0: Q(t) = (S/k) + (Q0 - S/k) * exp(-k * t)
    For k == 0: Q(t) = Q0 + S * t
    """
    if q0 < 0:
        raise ValueError("Initial quantity q0 must be non-negative.")
    if s < 0:
        raise ValueError("Supply rate s must be non-negative.")
    if k < 0:
        raise ValueError("Deterioration rate k must be non-negative.")

    if k == 0:
        return q0 + s * t
    else:
        equilibrium = s / k
        return equilibrium + (q0 - equilibrium) * np.exp(-k * t)

def calculate_equilibrium(s: float, k: float) -> float:
    """
    Equilibrium quantity Q* = S / k.
    Returns infinity if k == 0.
    """
    if k <= 0:
        return float('inf')
    return s / k
