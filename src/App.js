function MainApp() {
  const [upc, setUpc] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [modality, setModality] = useState("PICKUP");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); // For cart only

  const [mealType, setMealType] = useState("dinner");
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMealPlan, setLoadingMealPlan] = useState(false); // For meal plan only

  const handleConnect = () => {
    window.location.href = `${API_BASE}/login`;
  };

  // Fetch meal plan from backend
  async function handleMealPlanFetch(type) {
    try {
      setLoadingMealPlan(true);
      setError(null);
      const data = await fetchMealPlan(type);
      setMealPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMealPlan(false);
    }
  }

  // Add item to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!upc) {
      setMessage("Please enter a UPC code.");
      setLoading(false);
      return;
    }

    const payload = {
      items: [
        {
          upc: upc.trim(),
          quantity: Number(quantity) || 1,
          modality,
        },
      ],
    };

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setMessage(JSON.stringify(json, null, 2));
      } catch {
        setMessage(text);
      }

      if (!res.ok) {
        console.error("Add-to-cart failed", res.status, text);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Meal Planner — Kroger Integration (Frontend)</h1>

      {/* Connect to Kroger */}
      <section style={{ marginBottom: 24 }}>
        <button onClick={handleConnect} style={{ padding: "8px 14px", fontSize: 16 }}>
          Connect to Kroger
        </button>
      </section>

      {/* Add to cart */}
      <section style={{ marginBottom: 24 }}>
        <h2>Add item to cart (test)</h2>
        <form onSubmit={handleAddToCart} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
          <label>
            UPC:
            <input value={upc} onChange={(e) => setUpc(e.target.value)} placeholder="e.g. 0001111002824" />
          </label>
          <label>
            Quantity:
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </label>
          <label>
            Modality:
            <select value={modality} onChange={(e) => setModality(e.target.value)}>
              <option value="PICKUP">PICKUP</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Adding…" : "Add to Cart (test)"}
          </button>
        </form>
      </section>

      {/* Meal Plan */}
      <section style={{ marginBottom: 24 }}>
        <h2>Generate Meal Plan</h2>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
          <button onClick={() => handleMealPlanFetch(mealType)}>
            Generate {mealType} Plan
          </button>
        </div>

        {loadingMealPlan && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {mealPlan && <pre>{JSON.stringify(mealPlan, null, 2)}</pre>}
      </section>

      {/* Raw Response */}
      <section>
        <h3>Response</h3>
        <pre style={{ background: "#f7f7f7", padding: 12 }}>
          {message ?? "No response yet."}
        </pre>
      </section>
    </div>
  );
}
