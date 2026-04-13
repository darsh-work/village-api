import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/v1";

function Admin() {
  const [apiKey, setApiKey] = useState("");
  const [logs, setLogs] = useState([]);

  const generateKey = async () => {
    const res = await axios.post(`${API}/admin/generate-key`);
    setApiKey(res.data.api_key);
  };

  const loadLogs = async () => {
    const res = await axios.get(`${API}/admin/logs`);
    setLogs(res.data.data);
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
      <table border="1" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>API Key</th>
            <th>Endpoint</th>
            <th>Response Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{log.api_key}</td>
              <td>{log.endpoint}</td>
              <td>{log.response_time} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;