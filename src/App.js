import React from "react";
import AppRoutes from "./routes";
import "./App.css";


export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-brand">
          <div className="brand-mark">🛰️</div>
          <div>
            <div className="brand-title">astro_friend</div>
            <div className="brand-subtitle">Astronaut Health Monitor</div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <AppRoutes />
      </main>

      <footer className="app-footer">
        <span>astro_friend � Built by Shivam Kaundal</span>
        <span>•</span>
        <span>For ISRO / NASA astronaut health support</span>
      </footer>
    </div>
  );
}
