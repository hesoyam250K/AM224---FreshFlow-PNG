import pytest
import numpy as np
from backend.models.deterioration import (
    analytical_deterioration,
    calculate_half_life,
    calculate_time_to_90_percent_loss
)
from backend.models.supply_model import (
    analytical_supply_spoilage,
    calculate_equilibrium
)

def test_analytical_deterioration_decay():
    q0 = 1000.0
    k = 0.018
    t = 24.0
    
    # Q(24) = 1000 * exp(-0.018 * 24)
    expected = 1000.0 * np.exp(-0.018 * 24.0)
    actual = analytical_deterioration(t, q0, k)
    
    assert np.isclose(actual, expected, rtol=1e-6)
    assert actual < q0

def test_deterioration_invalid_inputs():
    with pytest.raises(ValueError):
        analytical_deterioration(10.0, -100.0, 0.01)
    
    with pytest.raises(ValueError):
        analytical_deterioration(10.0, 1000.0, -0.01)

def test_half_life():
    k = 0.018
    hl = calculate_half_life(k)
    expected = np.log(2) / k
    assert np.isclose(hl, expected, rtol=1e-5)
    
    # At t = t_1/2, Q(t) should equal Q0 / 2
    q0 = 1000.0
    q_half = analytical_deterioration(hl, q0, k)
    assert np.isclose(q_half, 500.0, rtol=1e-5)

def test_supply_model_k_zero_edge_case():
    q0 = 1000.0
    s = 50.0
    k = 0.0
    t = 10.0
    
    # When k = 0, Q(t) = Q0 + S * t
    actual = analytical_supply_spoilage(t, q0, s, k)
    assert np.isclose(actual, 1000.0 + 50.0 * 10.0, rtol=1e-6)

def test_supply_model_equilibrium():
    s = 40.0
    k = 0.02
    eq = calculate_equilibrium(s, k)
    assert eq == 2000.0
    
    # As t -> infinity, Q(t) -> Q*
    q_large_t = analytical_supply_spoilage(1000.0, 1000.0, s, k)
    assert np.isclose(q_large_t, 2000.0, rtol=1e-4)
