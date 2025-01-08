import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import GraphInput from "./components/GraphInput";
import GraphVisualization from "./components/GraphVisualization";
import Algorithms from "./components/Algorithms";
import { BinarySearchTree } from "./components/BinarySearchTree";
import BSTVisualizer from "./components/BSTVisualizer";
import "./styles/App.css";

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
            <button
              className="start-button"
              onClick={() => onStart("graph")}
            >
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
            Back to Home
          </button>
        </Link>
      </header>
      <GraphInput onMatrixSubmit={handleMatrixSubmit} />
      <GraphVisualization matrix={matrix} vertices={vertices} />
      <Algorithms matrix={matrix} />
    </div>
  );
}

function DataStructurePage({ tree, setTree }) {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [removeValue, setRemoveValue] = useState("");
  const [message, setMessage] = useState("");

  const handleInsert = () => {
    if (inputValue) {
      tree.insert(parseInt(inputValue));
      setMessage(`Inserted ${inputValue}`);
      setInputValue("");
    }
  };

  const handleSearch = () => {
    if (searchValue) {
      const found = tree.find(parseInt(searchValue));
      setMessage(found ? `Found ${searchValue}` : `${searchValue} not found`);
      setSearchValue("");
    }
  };

  const handleRemove = () => {
    if (removeValue) {
      tree.delete(parseInt(removeValue));
      setMessage(`Removed ${removeValue}`);
      setRemoveValue("");
    }
  };

  const handleResetTree = () => {
    setTree(new BinarySearchTree()); // Створення нового екземпляра дерева
    setMessage("Tree has been reset.");
  };

  return (
    <div>
      <header>
        <h1>Data Structure Visualization (BST)</h1>
        <Link to="/">
          <button className="back-button">Back to Home</button>
        </Link>
      </header>
      <div>
        <label>Insert Value: </label>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleInsert}>Insert</button>
      </div>

      <div>
        <label>Search Value: </label>
        <input
          type="number"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div>
        <label>Remove Value: </label>
        <input
          type="number"
          value={removeValue}
          onChange={(e) => setRemoveValue(e.target.value)}
        />
        <button onClick={handleRemove}>Remove</button>
      </div>

      <div>
        <button onClick={handleResetTree}>Reset Tree</button>
      </div>

      <p>{message}</p>
      <BSTVisualizer tree={tree.getTree()} /> {/* Передаємо дерево для візуалізації */}
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("");
  const [tree, setTree] = useState(new BinarySearchTree());

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
      <Route
        path="/data-structure"
        element={<DataStructurePage tree={tree} setTree={setTree} />}
      />
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
