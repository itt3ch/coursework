// GraphInput Component
import React, { useState } from "react";
import "./GraphInput.css";

const GraphInput = ({ onMatrixSubmit }) => {
    const [vertices, setVertices] = useState(0);
    const [edges, setEdges] = useState(0);
    const [weights, setWeights] = useState([]);

    const handleMatrixSubmit = (e) => {
        e.preventDefault();

        // Генеруємо порожню матрицю суміжності
        const matrix = Array.from({ length: vertices }, () =>
            Array.from({ length: vertices }, () => 0)
        );

        // Додаємо ваги ребер
        weights.forEach(({ from, to, weight }) => {
            matrix[from][to] = weight;
            matrix[to][from] = weight; // Ненаправлений граф
        });

        onMatrixSubmit(matrix);
    };

    const handleAddWeight = () => {
        setWeights([...weights, { from: 0, to: 0, weight: 0 }]);
    };

    const handleWeightChange = (index, field, value) => {
        const updatedWeights = [...weights];
        updatedWeights[index][field] = parseInt(value, 10);
        setWeights(updatedWeights);
    };

    return (
        <section id="input-section">
            <h2>Введення графу</h2>
            <form id="graph-form" onSubmit={handleMatrixSubmit}>
                <label htmlFor="vertices">Кількість вершин:</label>
                <input
                    type="number"
                    id="vertices"
                    value={vertices}
                    onChange={(e) => setVertices(parseInt(e.target.value, 10))}
                    min="1"
                    required
                />

                <label htmlFor="edges">Кількість ребер:</label>
                <input
                    type="number"
                    id="edges"
                    value={edges}
                    onChange={(e) => setEdges(parseInt(e.target.value, 10))}
                    min="1"
                    required
                />

                <h3>Ваги ребер:</h3>
                {weights.map((weight, index) => (
                    <div key={index} className="weight-input">
                        <label>Від:</label>
                        <input
                            type="number"
                            value={weight.from}
                            onChange={(e) => handleWeightChange(index, "from", e.target.value)}
                            min="0"
                            max={vertices - 1}
                            required
                        />
                        <label>До:</label>
                        <input
                            type="number"
                            value={weight.to}
                            onChange={(e) => handleWeightChange(index, "to", e.target.value)}
                            min="0"
                            max={vertices - 1}
                            required
                        />
                        <label>Вага:</label>
                        <input
                            type="number"
                            value={weight.weight}
                            onChange={(e) => handleWeightChange(index, "weight", e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                ))}

                <button type="button" onClick={handleAddWeight}>
                    Додати ребро
                </button>

                <button type="submit">Побудувати граф</button>
            </form>
        </section>
    );
};

export default GraphInput;
