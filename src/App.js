import React, { useState } from "react";

function App() {
  const [mealType, setMealType] = useState("vegetarian"); // default for type
  const [mealTime, setMealTime] = useState("dinner"); // default for time
  const [mealPlan, setMealPlan] = useState("");
  
  const debug_cart = true;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Call Kroger login
  const handleKrogerLogin = () => {
    window.location.href = `${backendUrl}/login`;
  };

  // Call /plan-and-cart
  const handleGenerate = async () => {
    try {
      const response = await fetch(`${backendUrl}/plan-and-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: mealTime, // from dropdown
          type: mealType, // from text box
          debug_cart: debug_cart, // if True, don't add items to cart
        }),
        credentials: "include", // important so session cookies are sent
      });

      const data = await response.json();
      setMealPlan(JSON.stringify(data, null, 2));
    } catch (error) {
      setMealPlan(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Meal Plan Generator</h2>

      {/* Kroger Login Button */}
      <button onClick={handleKrogerLogin} style={{ marginBottom: "15px" }}>
        Login to Kroger
      </button>
      <br />

      {/* Meal Type Textbox */}
      <label htmlFor="mealType">Select Meal Type: </label>
      <input
        type="text"
        id="mealType"
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <br />

      {/* Meal Time Dropdown */}
      <label htmlFor="mealTime">Select Meal Time: </label>
      <select
        id="mealTime"
        value={mealTime}
        onChange={(e) => setMealTime(e.target.value)}
      >
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
      </select>

      <br />
      <br />

      <button onClick={handleGenerate}>Generate Meal Plan</button>

      <br />
      <br />

      {/* Meal Plan Output */}
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

