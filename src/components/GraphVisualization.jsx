import React, { useState, useEffect } from "react";
import "./GraphVisualization.css";

function GraphVisualization({ matrix = [], weights = [], vertices = [] }) {
    // Ініціалізація стану
    const [highlightedEdges, setHighlightedEdges] = useState([]);

    // Ефект для оновлення графу
    useEffect(() => {
        if (!matrix || vertices.length === 0) return;
        console.log("Матриця суміжності:", matrix);
    }, [matrix, vertices]);

    // Рендер графу або повідомлення про відсутність даних
    if (!matrix || vertices.length === 0) {
        return <div>Граф не ініціалізовано</div>;
    }

    return (
        <div className="graph-container">
            <svg width="600" height="400">
                {/* Відображення вершин */}
                {vertices.map((vertex, index) => (
                    <circle
                        key={index}
                        cx={vertex.x}
                        cy={vertex.y}
                        r={20}
                        fill="lightblue"
                        stroke="black"
                        strokeWidth={2}
                    />
                ))}

                {/* Відображення ребер */}
                {matrix.map((row, i) =>
                    row.map((value, j) => {
                        if (value && i < j) {
                            return (
                                <line
                                    key={`${i}-${j}`}
                                    x1={vertices[i].x}
                                    y1={vertices[i].y}
                                    x2={vertices[j].x}
                                    y2={vertices[j].y}
                                    stroke={highlightedEdges.includes(`${i}-${j}`) ? "red" : "gray"}
                                    strokeWidth={2}
                                />
                            );
                        }
                        return null;
                    })
                )}

                {/* Відображення номерів вершин */}
                {vertices.map((vertex, index) => (
                    <text
                        key={index}
                        x={vertex.x}
                        y={vertex.y}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize="12px"
                    >
                        {index + 1}
                    </text>
                ))}
            </svg>
        </div>
    );
}

export default GraphVisualization;
