import { useState } from "react";
import Dashboard from "./Dashboard";
import Demo from "./Demo";
import Admin from "./Admin";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 Village API Project</h1>

      <button onClick={() => setPage("dashboard")}>
        Dropdown UI
      </button>

      <button onClick={() => setPage("demo")} style={{ marginLeft: 10 }}>
        Demo Client
      </button>

      <button onClick={() => setPage("admin")} style={{ marginLeft: 10 }}>
        Admin Panel
      </button>

      <hr />

      {page === "dashboard" && <Dashboard />}
      {page === "demo" && <Demo />}
      {page === "admin" && <Admin />}
    </div>
  );
}

export default App;