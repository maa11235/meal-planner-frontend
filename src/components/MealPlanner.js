import React, { useState } from "react";
import { fetchMealPlan } from "./api";

export default function MealPlanner() {
  const [mealType, setMealType] = useState("dinner");
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMealPlan(mealType);
      setMealPlan(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Meal Planner</h1>
      <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
      </select>
      <button onClick={handleGenerate}>Generate Meal Plan</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{color:"red"}}>{error}</p>}
      {mealPlan && (
        <pre>{JSON.stringify(mealPlan, null, 2)}</pre>
      )}
    </div>
  );
}