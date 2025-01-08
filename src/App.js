import React, { useState } from "react";
import GraphInput from "./components/GraphInput";
import GraphVisualization from "./components/GraphVisualization";
import Algorithms from "./components/Algorithms";
import "./styles/App.css";

function App() {
  const [matrix, setMatrix] = useState([]); // Матриця суміжності
  const [vertices, setVertices] = useState([]); // Вершини графа
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="App">
      <header>
        <h1>Graph Algorithms Visualization</h1>
      </header>

      {/* Компонент для введення графу */}
      <GraphInput onMatrixSubmit={handleMatrixSubmit} />

      {/* Візуалізація графу */}
      <GraphVisualization matrix={matrix} vertices={vertices} />

      {/* Модуль алгоритмів */}
      <Algorithms matrix={matrix} />
    </div>
  );
}

export default App;
