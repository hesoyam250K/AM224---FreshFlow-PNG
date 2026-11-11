# FreshFlow PNG

### Understanding how time and delays can affect fresh produce

FreshFlow PNG is a mini Applied Mathematics and interactive simulation project. The project explores how the quantity and quality of usable fresh produce decreases over time during transportation and storage, inspired by real-world supply chain challenges in Papua New Guinea.

This application is designed as an **educational mathematical simulation**. It uses first-order differential equations to demonstrate rate dynamics and supply deterioration in a clear, interactive way.

---

## The Problem

Fresh agricultural produce does not stay fresh forever. In Papua New Guinea, produce often travels long distances from farm gates in the Highlands to urban markets and coastal ports. Transportation delays, road disruptions, and hot or unchilled storage conditions can cause produce to spoil quickly before reaching consumers.

---

## The Main Question

> What happens to the amount of usable fresh produce when transport time increases or conditions change?

FreshFlow PNG allows users to test different travel durations, produce types, and storage conditions to observe how rate equations predict deterioration.

---

## How It Works

The workflow of the application is straightforward:

```text
User chooses conditions (Produce, Time, Storage)
        │
        ▼
Mathematical model receives inputs (Q₀, k, S)
        │
        ▼
Simulation engine solves differential equations
        │
        ▼
Results and decay curves are displayed visually
        │
        ▼
User compares scenarios and reviews mathematical insights
```

---

## Mathematical Models

### Model 1: Basic Deterioration Model

The core equation used in the simulation is the first-order autonomous differential equation:

$$\frac{dQ}{dt} = -kQ$$

Where:
- **Q** represents the amount of usable produce (in kg).
- **t** represents time (in hours).
- **k** represents the deterioration or spoilage rate parameter ($hr^{-1}$).

This equation states that the rate at which produce deteriorates is proportional to the amount of usable produce remaining at any given time.

#### Analytical Solution

By separating variables and integrating with respect to initial quantity $Q(0) = Q_0$:

$$Q(t) = Q_0 e^{-kt}$$

This equation calculates the exact amount of usable produce remaining after $t$ hours.

---

### Model 2: Supply and Deterioration Model

The project also explores a model where new produce arrives at a continuous supply rate $S$ while existing produce deteriorates:

$$\frac{dQ}{dt} = S - kQ$$

Where:
- **S** represents incoming produce entering the system (in kg/hr).
- **kQ** represents produce lost to spoilage over time.

#### Equilibrium

When the incoming supply rate equals the deterioration loss rate ($\frac{dQ}{dt} = 0$), the system reaches an equilibrium quantity $Q^*$:

$$Q^* = \frac{S}{k}$$

At this equilibrium point, incoming supply matches the rate of loss.

---

## AM224 Connection

This project applies core topics from **AM224: Ordinary Differential Equations**:

- **First-order differential equations:** The model tracks how crop quantity changes continuously with respect to a single independent variable (time).
- **Separable equations:** The basic deterioration model $\frac{dQ}{dt} = -kQ$ is solved by separating variables ($\frac{1}{Q}dQ = -k dt$) and integrating.
- **Autonomous equations:** The basic rate equation $\frac{dQ}{dt} = -kQ$ depends directly on the current quantity $Q$ rather than explicitly on time $t$.
- **Initial value problems:** Each simulation starts with a known initial condition $Q(0) = Q_0$ at the farm gate.
- **First-order linear equations:** The supply model $\frac{dQ}{dt} + kQ = S$ is a first-order linear ODE solved using the integrating factor $I(t) = e^{kt}$.
- **Equilibrium analysis:** The supply model contains a stable steady-state equilibrium $Q^* = \frac{S}{k}$.
- **Rate modelling:** Differential equations are used to represent physical rate dynamics in post-harvest logistics.

---

## User Inputs

Users can adjust several parameters in the simulation control panel:

- **Produce type:** Choose from Tomatoes, Bananas, Kaukau (Sweet Potato), Leafy Greens, or Custom Produce.
- **Starting amount ($Q_0$):** Set the initial harvested batch size (e.g. 1,000 kg).
- **Travel time ($t$):** Adjust the travel duration from 2 to 72 hours using a slider.
- **Storage conditions:** Select *Poor* (faster deterioration), *Normal* (standard example condition), or *Better storage* (slower deterioration).
- **Journey scenario:** Pick quick scenario presets (*Normal journey*, *Delayed journey*, *Long delay*).
- **Deterioration rate ($k$):** Adjust the rate parameter directly for mathematical exploration.

---

## Scenarios

The simulation includes four illustrative scenarios:

- **Normal journey:** Standard transit duration under typical road conditions.
- **Delayed journey:** A longer journey representing moderate transport delays.
- **Long delay:** A multi-day journey representing major road disruptions or breakdowns.
- **Better storage:** The same travel duration as a delay, but using cool or shaded storage to reduce the deterioration rate.

---

## Results

When a simulation is run, the application calculates and displays:

- **Starting amount:** Initial harvest quantity ($Q_0$).
- **Estimated amount remaining:** Usable produce left at destination ($Q(t)$).
- **Estimated amount lost:** Total produce spoiled during travel ($Q_0 - Q(t)$).
- **Percentage lost:** Percentage loss ratio.
- **Interactive decay graph:** A visual curve showing quantity decreasing over time.
- **Scenario comparison:** A multi-trace chart comparing curves for different transport conditions side by side.

---

## Features

- Interactive simulation controls and scenario presets
- Mathematical modelling using first-order differential equations
- Exact analytical solutions and step-by-step numerical solvers
- Interactive charts for decay curves and scenario comparisons
- Simple human-language observations generated from simulation outputs
- Expandable mathematical explanation section with rendered LaTeX notation
- Optional AI explanation layer to summarize results in plain English

---

## Numerical Simulation

In addition to exact analytical solutions, the project uses a 4th-order Runge-Kutta (RK4) numerical method to solve the differential equations step by step.

This allows the application to:
1. Simulate time-series data iteratively.
2. Compare the numerical approximation directly against the exact mathematical solution to confirm solver accuracy.

---

## AI Explanation Layer

The application includes an optional **"Explain this result"** feature powered by Gemini.

- **Role of AI:** The AI only converts the calculated simulation numbers into a short plain-English narrative.
- **Truth Source:** The mathematical engine and numerical solver calculate all numbers. The AI does not compute math, alter results, or invent data.

> AI explains the results. It does not replace the mathematical model.

---

## Technology Used

- **TypeScript & React (Vite):** User interface and interactive controls.
- **Express (Node.js):** Server entry point and Gemini API proxy route.
- **Recharts:** Responsive interactive chart rendering.
- **KaTeX:** Clean mathematical formula rendering.
- **@google/genai:** Server-side Gemini integration for natural language explanation.

---

## Project Structure

```text
FreshFlow-PNG/
├── server.ts                 # Express server & Gemini API proxy
├── src/
│   ├── App.tsx               # Main application layout
│   ├── main.tsx              # React entry point
│   ├── index.css             # Global styles and KaTeX imports
│   ├── math_engine/
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── produceData.ts    # Produce parameters & baseline rates
│   │   ├── scenarios.ts      # Scenario presets
│   │   ├── odeModels.ts      # Analytical & RK4 numerical ODE solvers
│   │   └── insightsEngine.ts # Rule-based insight generator
│   └── components/
│       ├── TopBar.tsx                 # Header navigation
│       ├── HeroSection.tsx            # Hero banner & plain English explanation
│       ├── SimpleQuestion.tsx         # Simple Farm -> Transport -> Market flow
│       ├── SimulationControls.tsx     # Input form and sliders
│       ├── ResultsDashboard.tsx       # KPI metrics summary
│       ├── MainGraph.tsx              # Single interactive decay chart
│       ├── ScenarioComparison.tsx     # Multi-scenario comparison chart
│       ├── ModelSuggestions.tsx       # Plain-language observations
│       ├── MathExplanation.tsx        # Expandable AM224 math breakdown
│       ├── AIExplainer.tsx            # Optional AI result summary
│       ├── Disclaimer.tsx             # Educational disclaimer
│       └── PortfolioDemonstration.tsx # Summary of skills demonstrated
├── package.json              # Project scripts and dependencies
└── README.md                 # Project documentation
```

---

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`.

---

## What I Learned

Building this project helped me understand:

- How first-order differential equations can be applied to model real-world change over time.
- How to connect formal calculus topics (separable equations, integrating factors, initial value problems) to computer simulations.
- How numerical solvers (such as RK4) approximate analytical differential equation solutions.
- How to separate deterministic mathematical engines from user interface and AI interpretation layers.
- How to present technical mathematical concepts in simple, accessible language.

---

## Limitations

- The simulation uses simplified first-order differential equations.
- Spoilage rate parameters ($k$) are illustrative and not based on official PNG agricultural statistics.
- Real-world food loss depends on additional environmental variables such as humidity, airflow, mechanical impact, and bacterial load.
- The output should be viewed as an educational demonstration rather than a real-world scientific prediction.

---

## Future Improvements

- Incorporate temperature and humidity as continuous dynamic variables.
- Integrate validated real-world agricultural transport data from PNG highways.
- Add multi-stage travel routes with varying conditions per leg.
- Compare second-order or non-linear deterioration models.

---

## Disclaimer

> FreshFlow PNG is an educational Applied Mathematics project. The simulation uses simplified mathematical models and illustrative parameters. Results should not be treated as real-world predictions unless validated data and assumptions are used.
