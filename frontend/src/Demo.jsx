import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// DEBUG
console.log("API:", API);
console.log("API KEY:", API_KEY);

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const fetchVillages = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API}/villages`, {
          params: { query }, // ✅ FIXED (important)
          headers: {
            "x-api-key": API_KEY
          }
        });

        console.log("API RESPONSE:", res.data);

        // SAFETY CHECK
        if (!res.data || !Array.isArray(res.data.data)) {
          console.error("Invalid API response");
          setResults([]);
          return;
        }

        // ✅ Directly use backend data (no filtering needed)
        setResults(res.data.data.slice(0, 10));

      } catch (err) {
        console.error("ERROR:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVillages();
  }, [query]);

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h2>📍 Demo Client Form</h2>

      {/* Name */}
      <input
        placeholder="Enter name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {/* Email */}
      <input
        placeholder="Enter email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {/* Search */}
      <input
        placeholder="Search village..."
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setSelected("");
        }}
        style={{ width: "100%", marginBottom: 5 }}
      />

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Dropdown */}
      {results.length > 0 && (
        <div style={{ border: "1px solid #ccc", marginBottom: 10 }}>
          {results.map(v => (
            <div
              key={v.id}
              style={{ padding: 5, cursor: "pointer" }}
              onClick={() => {
                setSelected(v.name);
                setQuery(v.name);
                setResults([]);
              }}
            >
              {v.name}
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && query.length >= 3 && results.length === 0 && (
        <p>No results found</p>
      )}

      {/* Selected */}
      {selected && (
        <p>
          📌 Selected Address: <b>{selected}</b>
        </p>
      )}
    </div>
  );
}

export default App;