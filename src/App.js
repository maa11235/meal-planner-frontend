import React, { useState } from "react";

function App() {
  const [mealType, setMealType] = useState("dinner");
  const [mealPlan, setMealPlan] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleGenerate = async () => {
    try {
      const response = await fetch(`${backendUrl}/generate-meal-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meal_type: mealType }),
      });

      const data = await response.json();
      setMealPlan(JSON.stringify(data, null, 2)); // pretty-print JSON
    } catch (error) {
      setMealPlan(`Error: ${error.message}`);
    }
  };

  const handleKrogerLogin = () => {
    window.location.href = `${backendUrl}/login`;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Meal Plan Generator</h2>

      {/* Kroger Login Button */}
      <button onClick={handleKrogerLogin} style={{ marginBottom: "15px" }}>
        Login to Kroger
      </button>
      <br />

      <label htmlFor="mealType">Select Meal Type: </label>
      <select
        id="mealType"
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
      >
        <option value="dinner">Dinner</option>
        <option value="lunch">Lunch</option>
        <option value="breakfast">Breakfast</option>
      </select>

      <br />
      <br />

      <button onClick={handleGenerate}>Generate Meal Plan</button>

      <br />
      <br />

      <textarea
        value={mealPlan}
        readOnly
        rows={20}
        cols={80}
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}

export default App;
