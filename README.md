# FreshFlow PNG V2

### Python FastAPI Engine & Interactive ODE Simulation for Produce Logistics

FreshFlow PNG V2 is an Applied Mathematics, Python numerical engineering, and interactive web application that models how the quantity of usable fresh produce changes over time during transport and storage.

Inspired by agricultural supply chain corridors in Papua New Guinea (such as the Highlands Highway from Mount Hagen to Lae Port), the project uses first-order ordinary differential equations (ODEs) to simulate rate-based deterioration and continuous market supply dynamics.

V2 upgrades the mathematical engine from TypeScript into a **Python FastAPI backend** powered by **NumPy** and **SciPy**, featuring analytical solvers, custom 4th-Order Runge-Kutta (RK4) numerical solvers, SciPy `solve_ivp` numerical integration, error metric evaluation, and an optional Gemini AI explanation layer.

---

## The Problem

Fresh agricultural produce deteriorates continuously post-harvest. In Papua New Guinea, produce travels long distances across rugged mountain passes and unpaved roads. Transport delays, vehicle breakdowns, and ambient heat in unchilled storage accelerate physical and enzymatic degradation.

---

## Project Objectives

1. Demonstrate how first-order differential equations model real-world continuous deterioration processes.
2. Provide an authoritative Python mathematical backend using FastAPI, NumPy, and SciPy.
3. Compare exact analytical ODE solutions against custom RK4 numerical algorithms and SciPy numerical solvers.
4. Maintain a clean, human-centered React frontend connected seamlessly to Python API endpoints.
5. Offer an optional AI explanation layer using Gemini to convert backend numerical results into plain-English agricultural insights.

---

## Mathematical Models

### Model 1: Basic Deterioration Model

The core model uses the autonomous first-order differential equation:

$$\frac{dQ}{dt} = -k Q$$

Where:
- **Q** represents the remaining quantity of usable produce (in kg).
- **t** represents elapsed transport time (in hours).
- **k** represents the effective deterioration rate parameter ($hr^{-1}$).

#### Analytical Solution

Solving by separation of variables with initial condition $Q(0) = Q_0$:

$$Q(t) = Q_0 e^{-kt}$$

The produce half-life is calculated as $t_{1/2} = \frac{\ln(2)}{k}$.

---

### Model 2: Supply and Deterioration Model

When new produce arrives at a continuous supply rate $S$ while existing produce deteriorates:

$$\frac{dQ}{dt} = S - k Q$$

Where:
- **S** represents incoming produce supply rate (in kg/hr).
- **kQ** represents produce loss rate (in kg/hr).

#### Analytical Solution

For $k > 0$:

$$Q(t) = \frac{S}{k} + \left(Q_0 - \frac{S}{k}\right) e^{-kt}$$

For $k = 0$ (no spoilage):

$$Q(t) = Q_0 + S t$$

#### Equilibrium State

As $t \to \infty$, the system converges exponentially to a stable equilibrium $Q^*$:

$$Q^* = \frac{S}{k}$$

At equilibrium, incoming supply matches spoilage loss ($\frac{dQ}{dt} = 0$).

---

## Connection to AM224 (Ordinary Differential Equations)

- **First-Order Differential Equations:** Tracks continuous rate of change of produce quantity over time.
- **Separable Equations:** $\frac{dQ}{dt} = -kQ \implies \frac{1}{Q}dQ = -k dt$.
- **Autonomous Systems:** $\frac{dQ}{dt} = -kQ$ depends directly on current state $Q$ rather than time $t$.
- **Initial Value Problems (IVPs):** Solved subject to initial harvested quantity $Q(0) = Q_0$.
- **First-Order Linear ODEs:** $\frac{dQ}{dt} + kQ = S$ solved using the Integrating Factor $I(t) = e^{kt}$.
- **Equilibrium Analysis:** Identification and steady-state stability evaluation of $Q^* = \frac{S}{k}$.

---

## Numerical Methods & Solvers

FreshFlow PNG V2 implements three distinct mathematical solving strategies in Python:

1. **Analytical Exact Solvers:** Closed-form mathematical equations ($Q_0 e^{-kt}$).
2. **Custom 4th-Order Runge-Kutta (RK4):**
   Explicit step integration using intermediate slope evaluations:
   $$k_1 = f(t_n, Q_n)$$
   $$k_2 = f(t_n + \frac{h}{2}, Q_n + \frac{h}{2}k_1)$$
   $$k_3 = f(t_n + \frac{h}{2}, Q_n + \frac{h}{2}k_2)$$
   $$k_4 = f(t_n + h, Q_n + hk_3)$$
   $$Q_{n+1} = Q_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$
3. **SciPy `solve_ivp`:** Adaptive explicit RK45 solver from `scipy.integrate`.

The Python backend computes maximum absolute error ($\max |Q_{numerical} - Q_{analytical}|$) and mean absolute error across all time points to quantify numerical approximation accuracy.

---

## Python Backend Architecture

Built using **FastAPI**, **NumPy**, **SciPy**, and **Pydantic**:

- `POST /api/simulate/deterioration`: Accepts initial quantity, deterioration rate, duration, and step size $h$. Returns analytical, RK4, and SciPy time series plus numerical error metrics.
- `POST /api/simulate/supply`: Accepts initial quantity, supply rate, deterioration rate, duration, and step size. Returns supply trajectory and equilibrium quantity $Q^*$.
- `POST /api/gemini/explain`: Accepts numerical backend outputs and invokes Gemini API to generate plain-English narrative interpretations.
- `GET /api/health`: Health status check.

---

## Frontend Integration

The frontend is built with **React**, **TypeScript**, **Vite**, **Recharts**, and **KaTeX**:

- Communicates with Python FastAPI endpoints via REST API calls.
- Displays multi-trace visualizations comparing Analytical Exact, Custom RK4, and SciPy `solve_ivp` curves.
- Includes fallback execution if the backend server is initializing.

---

## AI Explanation Feature

- **Python calculates; Gemini explains.**
- The Gemini API receives actual numerical simulation results generated by the Python backend.
- The AI does not compute mathematics, invent numbers, or alter calculated values.

---

## Technology Stack

- **Python 3.11**
- **FastAPI / Uvicorn**
- **NumPy & SciPy**
- **pytest & httpx**
- **TypeScript & React (Vite)**
- **Recharts & KaTeX**
- **@google/genai & google-genai**

---

## Project Structure

```text
FreshFlow-PNG/
├── server.ts                       # Express dev proxy & Python subprocess launcher
├── backend/
│   ├── main.py                     # FastAPI entry point & REST endpoints
│   ├── requirements.txt            # Python backend dependencies
│   ├── models/
│   │   ├── deterioration.py       # Basic ODE dQ/dt = -kQ
│   │   └── supply_model.py        # Linear ODE dQ/dt = S - kQ & k=0 handler
│   ├── solvers/
│   │   ├── analytical.py          # Exact solution evaluator
│   │   └── numerical.py           # Custom RK4 solver & SciPy solve_ivp wrapper
│   ├── services/
│   │   ├── simulation.py          # Simulation orchestration & error metrics
│   │   └── ai_explanation.py      # Gemini API integration service
│   ├── schemas/
│   │   └── simulation.py          # Pydantic request/response schemas
│   └── tests/
│       ├── test_models.py         # Analytical model tests
│       ├── test_solvers.py        # Custom RK4 & step-size convergence tests
│       └── test_api.py            # FastAPI REST endpoint tests
├── src/
│   ├── App.tsx                     # React application component
│   ├── math_engine/               # Frontend API client and types
│   └── components/                # React UI components
├── package.json                    # Node dependencies and scripts
└── README.md                       # Project documentation
```

---

## Running Locally

### 1. Setup Python Virtual Environment & Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables

Create `.env` in root:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
PYTHON_PORT=8000
```

### 3. Start Development Server

```bash
npm install
npm run dev
```

The Express server will automatically launch the Python FastAPI server on `http://127.0.0.1:8000` and proxy `/api/*` requests while serving the React frontend on `http://localhost:3000`.

---

## Testing

Run Python automated test suite with `pytest`:

```bash
PYTHONPATH=. ./venv/bin/pytest backend/tests -v
```

### Verified Test Results (12 Passed):
- `test_health_endpoint`: PASSED
- `test_simulate_deterioration_endpoint`: PASSED
- `test_simulate_supply_endpoint`: PASSED
- `test_invalid_input_validation`: PASSED
- `test_analytical_deterioration_decay`: PASSED
- `test_deterioration_invalid_inputs`: PASSED
- `test_half_life`: PASSED
- `test_supply_model_k_zero_edge_case`: PASSED
- `test_supply_model_equilibrium`: PASSED
- `test_rk4_accuracy_against_analytical`: PASSED
- `test_rk4_step_size_convergence`: PASSED
- `test_scipy_solve_ivp_comparison`: PASSED

---

## Learning Outcomes

This project demonstrates:
- Translation of mathematical differential equations into Python solvers.
- Implementation and error convergence verification of numerical methods (RK4 vs. SciPy `solve_ivp`).
- RESTful API design using FastAPI and Pydantic.
- Full-stack web integration connecting React/TypeScript frontends with Python calculation backends.
- Safe AI architecture separating deterministic math solvers from natural language explanations.

---

## Limitations

- Deterioration rates ($k$) are illustrative parameters designed for mathematical exploration.
- Real-world food deterioration depends on microclimate fluctuations (temperature, humidity, ventilation, physical bruising).
- Results should be interpreted as educational ODE simulations rather than field-validated predictions.

---

## Disclaimer

> FreshFlow PNG V2 is an educational Applied Mathematics simulation. Parameters and outputs are illustrative unless supported by verified agricultural field data.
