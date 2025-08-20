import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [mealType, setMealType] = useState("vegetarian"); // default for type
  const [mealTime, setMealTime] = useState("dinner"); // default for time
  const [mealPlan, setMealPlan] = useState("");
  const [isKrogerLoggedIn, setIsKrogerLoggedIn] = useState(false);
  const [loginStatusMessage, setLoginStatusMessage] = useState(""); // NEW

  // New state for location search and store selection
  const [locationInput, setLocationInput] = useState(""); // ZIP or City,State
  const [stores, setStores] = useState([]); // List of Kroger stores returned from backend
  const [selectedStore, setSelectedStore] = useState(""); // Kroger locationId chosen by user

  // New state for number of meals
  const [numMeals, setNumMeals] = useState(4); // default is 4

  // New state for PDF download link
  const [pdfUrl, setPdfUrl] = useState(null);

  // New state for loading spinner
  const [loading, setLoading] = useState(false);

  const debug_cart = process.env.DEBUG_CART;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // 🔄 Always check backend /status for Kroger login
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/status`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.logged_in) {
          setIsKrogerLoggedIn(true);
          setLoginStatusMessage("✅ You are logged in to Kroger.");
        } else {
          setIsKrogerLoggedIn(false);
          setLoginStatusMessage("❌ Not logged in to Kroger.");
        }
      } catch (err) {
        setLoginStatusMessage(`⚠️ Error checking login: ${err.message}`);
      }
    };
    checkStatus();
  }, [backendUrl]);

  // Call Kroger login
  const handleKrogerLogin = () => {
    window.location.href = `${backendUrl}/login`;
  };

  // Call /stores to search Kroger locations (GET request)
  const handleSearchStores = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/stores?zip=${encodeURIComponent(locationInput)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setStores(Array.isArray(data) ? data : data.stores || []);
      }
    } catch (error) {
      alert(`Error searching stores: ${error.message}`);
    }
  };

  // Call /plan-and-cart
  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/plan-and-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: mealTime,
          type: mealType,
          num_meals: numMeals,
          debug_cart: debug_cart,
          location_id: selectedStore,
        }),
        credentials: "include",
      });

      const data = await response.json();
      setMealPlan(JSON.stringify(data, null, 2));

      if (!data.error) {
        setIsKrogerLoggedIn(true);

        if (data.pdf) {
          const pdfResponse = await fetch(`${backendUrl}${data.pdf}`, {
            method: "GET",
            credentials: "include",
          });
          const blob = await pdfResponse.blob();
          const url = window.URL.createObjectURL(blob);
          setPdfUrl(url);
        }
      }
    } catch (error) {
      setMealPlan(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(`${backendUrl}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: mealPlan,
        credentials: "include",
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "meal_plan_report.pdf";
      a.click();
      console.log("Revoking object URL:", url);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error downloading PDF: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Meal Plan Generator</h2>

      {/* Kroger Login */}
      <button
        onClick={handleKrogerLogin}
        style={{ marginBottom: "15px" }}
        disabled={isKrogerLoggedIn}
      >
        Login to Kroger
      </button>
      <div style={{ marginBottom: "15px" }}>{loginStatusMessage}</div>
      <br />

      {/* Location Search Section */}
      <h3>Choose Kroger Store Location</h3>
      <input
        type="text"
        placeholder="Enter ZIP or City, State"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
      />
      <button onClick={handleSearchStores}>Search Stores</button>

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
                {store.name} - {store.address.addressLine1},{" "}
                {store.address.city}, {store.address.state}{" "}
                {store.address.zipCode}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Meal Type */}
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="mealType">Select Meal Type: </label>
        <input
          type="text"
          id="mealType"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
      </div>

      <br />

      {/* Meal Time */}
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

      {/* Number of Meals */}
      <label htmlFor="numMeals">Select number of meals: </label>
      <select
        id="numMeals"
        value={numMeals}
        onChange={(e) => setNumMeals(parseInt(e.target.value))}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <br />
      <br />

      <button onClick={handleGenerate} disabled={!isKrogerLoggedIn || loading}>
        {loading ? "Generating..." : "Generate Meal Plan"}
      </button>

      {loading && (
        <div className="spinner-row" role="status" aria-live="polite">
          <div className="spinner" />
          <span>Generating meal plan...</span>
        </div>
      )}

      {pdfUrl && (
        <div style={{ marginTop: "10px" }}>
          <a href={pdfUrl} download="meal_plan_report.pdf">
            <button>Download PDF Report</button>
          </a>
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleDownloadPdf}>Download PDF Report</button>
      </div>

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
