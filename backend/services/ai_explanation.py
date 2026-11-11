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

    prompt = f"""You are an agricultural economist and applied mathematician writing for "FreshFlow PNG", an educational ODE simulation tool.

    Here are the exact simulation outputs calculated by the Python ODE backend:
    - Produce Type: {req.produce_type}
    - Journey Scenario: {req.scenario_id}
    - Initial Quantity (Q0): {req.initial_quantity} kg
    - Transport Duration (t): {req.duration_hours} hours
    - Storage Condition: {req.storage_condition}
    - Deterioration Rate (k): {req.spoilage_rate:.4f} hr^-1
    - Remaining Usable Produce: {req.remaining_quantity:.1f} kg ({(100 - req.percentage_loss):.1f}%)
    - Estimated Produce Lost: {req.quantity_lost:.1f} kg ({req.percentage_loss:.1f}% loss)
    - Crop Half-Life (t1/2): {req.half_life_hours if req.half_life_hours else 'N/A'} hours
    - Equilibrium Quantity (Q*): {req.equilibrium_quantity if req.equilibrium_quantity else 'N/A'} kg
    - Incoming Supply Rate (S): {req.incoming_supply_rate if req.incoming_supply_rate else 'N/A'} kg/hr

    Please provide a short, plain-English summary (2 to 3 paragraphs max) interpreting these mathematical results.

    STRICT RULES:
    1. Do NOT invent new numbers or change any calculated values. Use ONLY the figures provided above.
    2. Reference that these results are simulated model estimates based on differential equations.
    3. Keep the tone clear, encouraging, educational, and professional.
    """

    # Try importing google.genai
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
        )
        explanation_text = response.text or "No explanation generated."
    except Exception as e:
        # Fallback using httpx to call Gemini REST API directly if SDK call fails
        import httpx
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={api_key}"
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
