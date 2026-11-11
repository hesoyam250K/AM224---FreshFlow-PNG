import numpy as np
from scipy.integrate import solve_ivp
from typing import Callable, Tuple, Dict, Any

def runge_kutta_4(
    func: Callable[[float, float], float],
    q0: float,
    t_eval: np.ndarray
) -> np.ndarray:
    """
    Custom 4th-Order Runge-Kutta (RK4) numerical ODE solver.
    
    Given dQ/dt = func(t, Q) and initial condition Q(t[0]) = q0:
    For step h = t[i+1] - t[i]:
      k1 = func(t[i], q[i])
      k2 = func(t[i] + h/2, q[i] + (h/2)*k1)
      k3 = func(t[i] + h/2, q[i] + (h/2)*k2)
      k4 = func(t[i] + h, q[i] + h*k3)
      q[i+1] = q[i] + (h/6) * (k1 + 2*k2 + 2*k3 + k4)
    """
    n = len(t_eval)
    q_sol = np.zeros(n, dtype=float)
    q_sol[0] = float(q0)

    for i in range(n - 1):
        t_i = float(t_eval[i])
        h = float(t_eval[i + 1] - t_i)
        q_i = q_sol[i]

        k1 = func(t_i, q_i)
        k2 = func(t_i + 0.5 * h, q_i + 0.5 * h * k1)
        k3 = func(t_i + 0.5 * h, q_i + 0.5 * h * k2)
        k4 = func(t_i + h, q_i + h * k3)

        q_next = q_i + (h / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4)
        q_sol[i + 1] = max(0.0, q_next)

    return q_sol

def scipy_solve_ivp(
    func: Callable[[float, float], float],
    q0: float,
    t_eval: np.ndarray,
    rtol: float = 1e-6,
    atol: float = 1e-8
) -> np.ndarray:
    """
    Solves ODE using SciPy's scipy.integrate.solve_ivp (RK45 explicit Runge-Kutta method).
    """
    t_span = (float(t_eval[0]), float(t_eval[-1]))
    
    # Wrap function for SciPy: func(t, y) where y is 1D array
    def scipy_func(t: float, y: np.ndarray) -> np.ndarray:
        return np.array([func(t, y[0])], dtype=float)

    sol = solve_ivp(
        scipy_func,
        t_span,
        [float(q0)],
        t_eval=t_eval,
        method='RK45',
        rtol=rtol,
        atol=atol
    )

    if not sol.success:
        raise RuntimeError(f"SciPy solve_ivp failed: {sol.message}")

    return np.maximum(0.0, sol.y[0])
