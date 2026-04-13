import { useEffect, useState } from "react";
import axios from "axios";
import Admin from "./Admin"; // ✅ ADD THIS

const API = "http://localhost:3000/v1";
const API_KEY = "myapikey123";

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // ✅ ADMIN TOGGLE

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/states`, {
      headers: { "x-api-key": API_KEY }
    }).then(res => setStates(res.data.data));
  }, []);

  const loadDistricts = async (id) => {
    setLoading(true);
    setDistricts([]);
    setSubdistricts([]);
    setVillages([]);

    const res = await axios.get(`${API}/districts?state_id=${id}`, {
      headers: { "x-api-key": API_KEY }
    });

    setDistricts(res.data.data);
    setLoading(false);
  };

  const loadSubdistricts = async (id) => {
    setLoading(true);
    setSubdistricts([]);
    setVillages([]);

    const res = await axios.get(`${API}/subdistricts?district_id=${id}`, {
      headers: { "x-api-key": API_KEY }
    });

    setSubdistricts(res.data.data);
    setLoading(false);
  };

  const loadVillages = async (id) => {
    setLoading(true);

    const res = await axios.get(`${API}/villages?subdistrict_id=${id}`, {
      headers: { "x-api-key": API_KEY }
    });

    setVillages(res.data.data);
    setLoading(false);
  };

  const handleSearch = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const res = await axios.get(`${API}/autocomplete?q=${value}`, {
      headers: { "x-api-key": API_KEY }
    });

    setResults(res.data.data);
  };

  // 🔥 SWITCH BETWEEN ADMIN & USER UI
  if (isAdmin) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setIsAdmin(false)}>
          ⬅ Back to App
        </button>
        <Admin />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* 🔥 ADMIN BUTTON */}
        <button 
          onClick={() => setIsAdmin(true)} 
          style={{ float: "right", marginBottom: 10 }}
        >
          ⚙️ Admin Panel
        </button>

        <h2 style={styles.title}>🌍 Village Dashboard</h2>

        {/* DROPDOWNS */}
        <div style={styles.row}>
          <select style={styles.select} onChange={(e) => loadDistricts(e.target.value)}>
            <option>Select State</option>
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select style={styles.select} onChange={(e) => loadSubdistricts(e.target.value)}>
            <option>Select District</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select style={styles.select} onChange={(e) => loadVillages(e.target.value)}>
            <option>Select Subdistrict</option>
            {subdistricts.map(sd => (
              <option key={sd.id} value={sd.id}>{sd.name}</option>
            ))}
          </select>
        </div>

        {/* SEARCH */}
        <div style={styles.searchBox}>
          <input
            style={styles.input}
            placeholder="🔍 Search village..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {results.length > 0 && (
            <div style={styles.searchResults}>
              {results.map((r, i) => (
                <div key={i} style={styles.resultItem}>
                  <b>{r.label}</b>
                  <div style={{ fontSize: 12, color: "#555" }}>{r.fullAddress}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && <p style={{ color: "#555" }}>⏳ Loading...</p>}

        {/* TABLE */}
        <h3 style={{ marginTop: 20 }}>Villages</h3>

        {villages.length === 0 && !loading ? (
          <p style={{ color: "#888" }}>No villages found</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {villages.map(v => (
                <tr key={v.id} style={styles.rowHover}>
                  <td>{v.id}</td>
                  <td>{v.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f5f7fa",
    minHeight: "100vh",
    padding: 20
  },
  card: {
    maxWidth: 900,
    margin: "auto",
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 15px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap"
  },
  select: {
    padding: 8,
    borderRadius: 5,
    border: "1px solid #ccc"
  },
  searchBox: {
    marginTop: 20,
    textAlign: "center"
  },
  input: {
    padding: 10,
    width: 250,
    borderRadius: 5,
    border: "1px solid #ccc"
  },
  searchResults: {
    marginTop: 10,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 5,
    maxWidth: 300,
    marginInline: "auto"
  },
  resultItem: {
    padding: 8,
    borderBottom: "1px solid #eee"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10
  },
  rowHover: {
    cursor: "pointer"
  }
};

export default App;