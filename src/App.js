import React, { useState } from "react";

function App() {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to call the backend
  async function fetchMealPlan(mealType) {
    try {
      const response = await fetch("/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal_type: mealType }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meal plan");
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  }

  // Handler for button click
  async function handleMealPlanFetch(mealType) {
    setLoading(true);
    setError(null);
    setMealPlan(null);

    try {
      const plan = await fetchMealPlan(mealType);
      setMealPlan(plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Meal Planner</h1>
      <p>Click below to generate a weekly meal plan.</p>

      <button onClick={() => handleMealPlanFetch("breakfast")}>
        Generate Breakfast Plan
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mealPlan && (
        <pre style={{ background: "#f4f4f4", padding: "10px" }}>
          {JSON.stringify(mealPlan, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
