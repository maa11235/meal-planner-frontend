import React, { useState, useEffect } from "react";

function App() {
  const [mealType, setMealType] = useState("vegetarian"); // default for type
  const [mealTime, setMealTime] = useState("dinner"); // default for time
  const [mealPlan, setMealPlan] = useState("");
  const [isKrogerLoggedIn, setIsKrogerLoggedIn] = useState(false);

  // New state for location search and store selection
  const [locationInput, setLocationInput] = useState(""); // ZIP or City,State
  const [stores, setStores] = useState([]); // List of Kroger stores returned from backend
  const [selectedStore, setSelectedStore] = useState(""); // Kroger locationId chosen by user

  const debug_cart = process.env.DEBUG_CART;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Detect if user is coming back from Kroger login success
  useEffect(() => {
    if (window.location.pathname.includes("/kroger/success")) {
      setIsKrogerLoggedIn(true);
    }
  }, []);

  // Call Kroger login
  const handleKrogerLogin = () => {
    window.location.href = `${backendUrl}/login`;
  };

  // Call /stores to search Kroger locations (GET request)
  const handleSearchStores = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/stores?location=${encodeURIComponent(locationInput)}`,
        {
          method: "GET",
          credentials: "include", // keep session cookies
        }
      );
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setStores(data.stores || []);
      }
    } catch (error) {
      alert(`Error searching stores: ${error.message}`);
    }
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
          location_id: selectedStore, // Pass chosen Kroger store to backend
        }),
        credentials: "include", // important so session cookies are sent
      });

      const data = await response.json();
      setMealPlan(JSON.stringify(data, null, 2));

      if (!data.error) {
        setIsKrogerLoggedIn(true);
      }
    } catch (error) {
      setMealPlan(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Meal Plan Generator</h2>

      {/* Location Search Section */}
      <h3>Choose Kroger Store Location</h3>
      <input
        type="text"
        placeholder="Enter ZIP or City, State"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
      />
      <button onClick={handleSearchStores}>Search Stores</button>

      {/* Store Dropdown (only shows if stores exist) */}
      {stores.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="storeSelect">Select Store: </label>
          <select
            id="storeSelect"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">-- Choose a Store --</option>
            {stores.map((store) => (
              <option key={store.locationId} value={store.locationId}>
                {store.name} - {store.address}, {store.city}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Kroger Login Button */}
      <button
        onClick={handleKrogerLogin}
        style={{ marginBottom: "15px" }}
        disabled={isKrogerLoggedIn}
      >
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

      <button onClick={handleGenerate} disabled={!isKrogerLoggedIn}>
        Generate Meal Plan
      </button>

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

