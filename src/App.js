import React, { useState } from "react";

function App() {
  const [mealType, setMealType] = useState("dinner");

  const handleGenerate = async () => {
    try {
      const response = await fetch("https://api.meal-planner.techexamprep.com/generate-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meal_type: mealType }),
      });

      const data = await response.json();
      console.log("Meal Plan:", data);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Meal Plan Generator</h2>

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
    </div>
  );
}

export default App;
