import { useState } from "react";
import axios from "axios";

// ✅ FIXED API URL
const API = "https://village-api-mh95.onrender.com/v1";

function Admin() {
  const [apiKey, setApiKey] = useState("");
  const [logs, setLogs] = useState([]);

  const generateKey = async () => {
    try {
      const res = await axios.post(`${API}/admin/generate-key`);
      console.log("Key response:", res.data);
      setApiKey(res.data.api_key);
    } catch (err) {
      console.error(err);
      alert("Error generating key");
    }
  };

  const loadLogs = async () => {
    try {
      const res = await axios.get(`${API}/admin/logs`);
      console.log("Logs:", res.data);
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error loading logs");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>⚙️ Admin Panel</h2>

      {/* Generate Key */}
      <button onClick={generateKey} style={{ margin: 10 }}>
        Generate API Key
      </button>

      {apiKey && (
        <p>
          New Key: <b>{apiKey}</b>
        </p>
      )}

      <hr />

      {/* Load Logs */}
      <button onClick={loadLogs} style={{ margin: 10 }}>
        View Logs
      </button>

      {/* Logs Table */}
      <table border="1" style={{ marginTop: 10, width: "100%" }}>
        <thead>
          <tr>
            <th>API Key</th>
            <th>Endpoint</th>
            <th>Response Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="3">No logs found</td>
            </tr>
          ) : (
            logs.map((log, i) => (
              <tr key={i}>
                <td>{log.api_key}</td>
                <td>{log.endpoint}</td>
                <td>{log.response_time} ms</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;