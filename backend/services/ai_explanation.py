import os
from datetime import datetime
from backend.schemas.simulation import ExplanationRequest, ExplanationResponse

def generate_ai_explanation(req: ExplanationRequest) -> ExplanationResponse:
    """
    Generates a human-readable explanation of simulation results using Gemini API.
    Strictly uses Python backend calculation outputs as the truth source.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing.")

    produce_type = req.produce_type or "tomatoes"
    scenario_id = req.scenario_id or "normal_journey"
    initial_qty = req.initial_quantity if req.initial_quantity is not None else 1000.0
    duration_hours = req.duration_hours if req.duration_hours is not None else 12.0
    storage_condition = req.storage_condition or "normal"
    spoilage_rate = req.spoilage_rate if req.spoilage_rate is not None else 0.018
    remaining_qty = req.remaining_quantity if req.remaining_quantity is not None else 800.0
    quantity_lost = req.quantity_lost if req.quantity_lost is not None else 200.0
    percentage_loss = req.percentage_loss if req.percentage_loss is not None else 20.0
    half_life_hours = req.half_life_hours if req.half_life_hours is not None else "N/A"
    equilibrium_qty = req.equilibrium_quantity if req.equilibrium_quantity is not None else "N/A"
    incoming_supply = req.incoming_supply_rate if req.incoming_supply_rate is not None else "N/A"

    prompt = f"""You are an agricultural economist and applied mathematician writing for "FreshFlow PNG", an educational ODE simulation tool.

    Here are the exact simulation outputs calculated by the Python ODE backend:
    - Produce Type: {produce_type}
    - Journey Scenario: {scenario_id}
    - Initial Quantity (Q0): {initial_qty} kg
    - Transport Duration (t): {duration_hours} hours
    - Storage Condition: {storage_condition}
    - Deterioration Rate (k): {spoilage_rate:.4f} hr^-1
    - Remaining Usable Produce: {remaining_qty:.1f} kg ({(100 - percentage_loss):.1f}%)
    - Estimated Produce Lost: {quantity_lost:.1f} kg ({percentage_loss:.1f}% loss)
    - Crop Half-Life (t1/2): {half_life_hours} hours
    - Equilibrium Quantity (Q*): {equilibrium_qty} kg
    - Incoming Supply Rate (S): {incoming_supply} kg/hr

    Please provide a short, plain-English summary (2 to 3 paragraphs max) interpreting these mathematical results.

    STRICT RULES:
    1. Do NOT invent new numbers or change any calculated values. Use ONLY the figures provided above.
    2. Reference that these results are simulated model estimates based on differential equations.
    3. Keep the tone clear, encouraging, educational, and professional.
    """

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            contents=prompt,
        )
        explanation_text = response.text or "No explanation generated."
    except Exception:
        import httpx
        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        res = httpx.post(url, json=payload, timeout=20.0)
        res.raise_for_status()
        data = res.json()
        explanation_text = data["candidates"][0]["content"]["parts"][0]["text"]

    return ExplanationResponse(
        explanation=explanation_text,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
