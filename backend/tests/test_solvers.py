import pytest
import numpy as np
from backend.models.deterioration import deterioration_ode, analytical_deterioration
from backend.solvers.numerical import runge_kutta_4, scipy_solve_ivp

def test_rk4_accuracy_against_analytical():
    q0 = 1000.0
    k = 0.018
    duration = 24.0
    h = 0.5
    
    t_eval = np.linspace(0, duration, int(duration / h) + 1)
    
    def func(t, q):
        return deterioration_ode(t, q, k)
        
    y_rk4 = runge_kutta_4(func, q0, t_eval)
    y_exact = analytical_deterioration(t_eval, q0, k)
    
    max_err = np.max(np.abs(y_rk4 - y_exact))
    # RK4 error for linear ODE should be extremely small (< 1e-4)
    assert max_err < 1e-3

def test_rk4_step_size_convergence():
    q0 = 1000.0
    k = 0.05  # higher decay rate to observe error scaling
    duration = 24.0
    
    def func(t, q):
        return deterioration_ode(t, q, k)

    errors = []
    step_sizes = [2.0, 1.0, 0.5, 0.1]
    
    for h in step_sizes:
        t_eval = np.linspace(0, duration, int(duration / h) + 1)
        y_rk4 = runge_kutta_4(func, q0, t_eval)
        y_exact = analytical_deterioration(t_eval, q0, k)
        max_err = np.max(np.abs(y_rk4 - y_exact))
        errors.append(max_err)

    # Verify error decreases monotonically as step size h decreases
    for i in range(len(errors) - 1):
        assert errors[i + 1] < errors[i]

def test_scipy_solve_ivp_comparison():
    q0 = 1000.0
    k = 0.018
    duration = 24.0
    t_eval = np.linspace(0, duration, 49)
    
    def func(t, q):
        return deterioration_ode(t, q, k)
        
    y_scipy = scipy_solve_ivp(func, q0, t_eval)
    y_exact = analytical_deterioration(t_eval, q0, k)
    
    max_err = np.max(np.abs(y_scipy - y_exact))
    assert max_err < 1e-3
