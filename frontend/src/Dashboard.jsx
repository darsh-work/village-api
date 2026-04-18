import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [subdistrictId, setSubdistrictId] = useState("");

  // 🔹 Load States
  useEffect(() => {
    axios
      .get(`${API}/states`, {
        headers: { "x-api-key": API_KEY }
      })
      .then(res => setStates(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  // 🔹 Load Districts
  useEffect(() => {
    if (!stateId) return;

    axios
      .get(`${API}/districts`, {
        params: { state_id: stateId },
        headers: { "x-api-key": API_KEY }
      })
      .then(res => setDistricts(res.data.data || []))
      .catch(err => console.error(err));
  }, [stateId]);

  // 🔹 Load Subdistricts
  useEffect(() => {
    if (!districtId) return;

    axios
      .get(`${API}/subdistricts`, {
        params: { district_id: districtId },
        headers: { "x-api-key": API_KEY }
      })
      .then(res => setSubdistricts(res.data.data || []))
      .catch(err => console.error(err));
  }, [districtId]);

  // 🔹 Load Villages
  useEffect(() => {
    if (!subdistrictId) return;

    axios
      .get(`${API}/villages`, {
        params: { subdistrict_id: subdistrictId },
        headers: { "x-api-key": API_KEY }
      })
      .then(res => setVillages(res.data.data || []))
      .catch(err => console.error(err));
  }, [subdistrictId]);

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h2>🌐 Location Selector</h2>

      {/* STATE */}
      <select
        value={stateId}
        onChange={e => {
          setStateId(e.target.value);
          setDistrictId("");
          setSubdistrictId("");
          setVillages([]);
        }}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option value="">Select State</option>
        {states.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* DISTRICT */}
      <select
        value={districtId}
        onChange={e => {
          setDistrictId(e.target.value);
          setSubdistrictId("");
          setVillages([]);
        }}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option value="">Select District</option>
        {districts.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      {/* SUBDISTRICT */}
      <select
        value={subdistrictId}
        onChange={e => {
          setSubdistrictId(e.target.value);
        }}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option value="">Select Subdistrict</option>
        {subdistricts.map(sd => (
          <option key={sd.id} value={sd.id}>
            {sd.name}
          </option>
        ))}
      </select>

      {/* VILLAGES */}
      <select style={{ width: "100%", marginBottom: 10 }}>
        <option value="">Select Village</option>
        {villages.map(v => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      {/* DEBUG */}
      <p style={{ fontSize: 12 }}>
        API: {API}
      </p>
    </div>
  );
}

export default App;