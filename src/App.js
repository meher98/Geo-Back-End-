import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TablePage from "./pages/TablePage";
import { appContext } from "./utils/consts";
import "./styles/globals.scss";
import Req from "./pages/Req";

function App() {
  const [refreshSide, setRefreshSide] = useState(true);
  const [error, setError] = useState("");
  return (
    <div className="App">
      <appContext.Provider
        value={{ refreshSide, setRefreshSide, error, setError }}
      >
        <Router>
          <Sidebar>
            <Routes>
              <Route path="/" element={<Req />} />
              <Route path="/table/:tab" element={<TablePage />} />
            </Routes>
          </Sidebar>
        </Router>
      </appContext.Provider>
    </div>
  );
}

export default App;
