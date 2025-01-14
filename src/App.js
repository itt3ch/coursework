import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GraphInput from "./components/GraphInput";
import BSTVisualizer from "./components/BSTVisualizer";
import "./styles/App.css";

// Створення контексту для дерева
const TreeContext = createContext();

export const useTree = () => useContext(TreeContext);


function HomePage({ onStart }) {
  return (
    <div className="start-page">
      <header>
        <h1>Website Wireframe</h1>
      </header>
      <div className="main">
        <div className="card">
          <h2>Graph Algorithm</h2>
          <Link to="/graph">
            <button className="start-button" onClick={() => onStart("graph")}>
              Start
            </button>
          </Link>
        </div>
        <div className="card">
          <h2>Data Structure</h2>
          <Link to="/data-structure">
            <button
              className="start-button"
              onClick={() => onStart("data-structure")}
            >
              Start
            </button>
          </Link>
        </div>
      </div>
      <footer>
        <p>Internet of Things</p>
        <p>2025</p>
      </footer>
    </div>
  );
}

function GraphPage({ resetGraph }) {
  const [matrix, setMatrix] = useState([]);
  const [vertices, setVertices] = useState([]);

  const handleMatrixSubmit = (newMatrix) => {
    setMatrix(newMatrix);
    setVertices(generateVertices(newMatrix.length));
  };

  const generateVertices = (count) => {
    const angleStep = (2 * Math.PI) / count;
    const radius = 150;

    return Array.from({ length: count }, (_, i) => ({
      x: 300 + radius * Math.cos(i * angleStep),
      y: 300 + radius * Math.sin(i * angleStep),
    }));
  };

  return (
    <div>
      <header>
        <h1>Graph Algorithms Visualization</h1>
        <Link to="/">
          <button className="back-button" onClick={resetGraph}>
            На головну
          </button>
        </Link>
      </header>
      <GraphInput onMatrixSubmit={handleMatrixSubmit} />

    </div>
  );
}

const DataStructurePage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Binary Search Tree Visualizer</h1>
        <Link to="/">
          <button className="back-button" >
            На головну
          </button>
        </Link>
      </header>
      <main>
        <BSTVisualizer />
      </main>
    </div>
  );
};

function App() {
  const [mode, setMode] = useState("");

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
  };

  const resetGraph = () => {
    setMode("");
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage onStart={handleStart} />} />
      <Route path="/graph" element={<GraphPage resetGraph={resetGraph} />} />
      <Route path="/data-structure" element={<DataStructurePage />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
        <App />
    </Router>
  );
}
