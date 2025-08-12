// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KrogerSuccess from "./KrogerSuccess"; // Import success page component

const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function MainApp() {
  const [upc, setUpc] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [modality, setModality] = useState("PICKUP");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect browser to backend /login which starts Kroger OAuth
  const handleConnect = () => {
    window.location.href = `${API_BASE}/login`;
  };

  // Send one cart item to backend /cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Basic validation
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
          modality: modality, // "PICKUP" or "DELIVERY" if supported
        },
      ],
    };

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT: sends session cookie to backend
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      // Try parse JSON, otherwise show raw text
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

      <section style={{ marginBottom: 24 }}>
        <p>
          Click below to connect your Kroger account. After signing in with Kroger,
          return here and use the Add-to-Cart form.
        </p>
        <button onClick={handleConnect} style={{ padding: "8px 14px", fontSize: 16 }}>
          Connect to Kroger
        </button>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Add item to cart (test)</h2>
        <form onSubmit={handleAddToCart} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
          <label>
            UPC:
            <input
              type="text"
              value={upc}
              onChange={(e) => setUpc(e.target.value)}
              placeholder="e.g. 0001111002824"
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>

          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: 120, padding: 8, marginTop: 4 }}
            />
          </label>

          <label>
            Modality:
            <select
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              style={{ padding: 8, width: 180, marginTop: 4 }}
            >
              <option value="PICKUP">PICKUP</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
          </label>

          <div>
            <button type="submit" disabled={loading} style={{ padding: "8px 14px", fontSize: 16 }}>
              {loading ? "Adding…" : "Add to Cart (test)"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h3>Response</h3>
        <pre
          style={{
            background: "#f7f7f7",
            padding: 12,
            minHeight: 80,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message ?? "No response yet."}
        </pre>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/kroger/success" element={<KrogerSuccess />} />
      </Routes>
    </Router>
  );
}
