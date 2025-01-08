import React, { useState, useEffect } from "react";
import GraphInput from "./components/GraphInput";
import GraphVisualization from "./components/GraphVisualization";
import Algorithms from "./components/Algorithms";
import "./styles/App.css";
import "./styles/index.css";

// Модальне вікно для введення початкової та кінцевої вершин
function Modal({ isOpen, onClose, onSubmit }) {
  const [startVertex, setStartVertex] = useState("");
  const [endVertex, setEndVertex] = useState("");

  const handleSubmit = () => {
    if (startVertex && endVertex) {
      onSubmit(startVertex, endVertex);
      onClose();
    } else {
      alert("Please fill in both fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Start and End Vertices</h2>
        <input
          type="number"
          placeholder="Start Vertex"
          value={startVertex}
          onChange={(e) => setStartVertex(e.target.value)}
        />
        <input
          type="number"
          placeholder="End Vertex"
          value={endVertex}
          onChange={(e) => setEndVertex(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startVertex, setStartVertex] = useState(null);
  const [endVertex, setEndVertex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const [vertices, setVertices] = useState([]); // Список вершин
  const [edges, setEdges] = useState([]); // Список риб
  const [queue, setQueue] = useState([]); // Черга
  const [visited, setVisited] = useState([]); // Відвідані вершини

  const handleStartClick = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (start, end) => {
    setStartVertex(start);
    setEndVertex(end);
    setIsModalOpen(false);
    // Ініціалізація алгоритму, наприклад BFS чи DFS
    runAlgorithm(start, end);
  };

  const runAlgorithm = (start, end) => {
    // Тут має бути ваша логіка для запуску алгоритму, який буде змінювати стейт
    // Наприклад, при кожному кроці алгоритму змінюються вершини, що інспектуються і оброблені
    setIsRunning(true);
    // Пример візуалізації алгоритму
    // Ваш алгоритм буде змінювати visited, queue, step і т. д.
  };

  const handlePause = () => {
    setPaused(!paused);
  };

  const handleStepBack = () => {
    // Логіка для кроку назад
    if (step > 0) {
      setStep(step - 1);
      // Тут можна повернути попередні стани алгоритму
    }
  };

  const handleNextStep = () => {
    if (paused) return;

    setStep(step + 1);
    // Логіка для кроку вперед
    // Змінюються стани вершин і черги
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>Website Wireframe</h1>
      </header>
      <main className="main-content">
        <div className="card">
          <div className="card-content">
            <h2>Your Graph Algorithm</h2>
            <button className="start-button" onClick={handleStartClick}>
              Start
            </button>
            {isRunning && (
              <div>
                <button onClick={handlePause}>
                  {paused ? "Resume" : "Pause"}
                </button>
                <button onClick={handleStepBack}>Step Back</button>
                <button onClick={handleNextStep}>Next Step</button>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <h2>Your Data Structure</h2>
            <button className="start-button" onClick={handleStartClick}>
              Start
            </button>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>Internet of Things 2022</p>
      </footer>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} />
      
      {/* Тут ви можете вставити компонент для візуалізації графа */}
      <GraphVisualization
        vertices={vertices}
        edges={edges}
        queue={queue}
        visited={visited}
        currentStep={step}
      />
    </div>
  );
}

export default HomePage;
