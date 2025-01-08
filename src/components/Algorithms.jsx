import React, { useState } from "react";
import "./../styles/Algorithms.css";

const Algorithms = ({ matrix }) => {
    const [maxFlowResult, setMaxFlowResult] = useState(null);

    const fordFulkerson = (graph, source, sink) => {
        const residualGraph = graph.map((row) => [...row]);
        const parent = Array(graph.length).fill(-1);
        let maxFlow = 0;

        const bfs = () => {
            const visited = Array(graph.length).fill(false);
            const queue = [];
            queue.push(source);
            visited[source] = true;

            while (queue.length > 0) {
                const currentNode = queue.shift();

                for (let i = 0; i < graph.length; i++) {
                    if (!visited[i] && residualGraph[currentNode][i] > 0) {
                        parent[i] = currentNode;
                        queue.push(i);
                        visited[i] = true;

                        if (i === sink) {
                            return true;
                        }
                    }
                }
            }

            return false;
        };

        while (bfs()) {
            let pathFlow = Infinity;
            let v = sink;

            while (v !== source) {
                const u = parent[v];
                pathFlow = Math.min(pathFlow, residualGraph[u][v]);
                v = u;
            }

            v = sink;
            while (v !== source) {
                const u = parent[v];
                residualGraph[u][v] -= pathFlow;
                residualGraph[v][u] += pathFlow;
                v = u;
            }

            maxFlow += pathFlow;
        }

        return maxFlow;
    };

    const runAlgorithm = (algorithm) => {
        if (algorithm === "Максимальний потік") {
            const source = 0; // Початкова вершина
            const sink = matrix.length - 1; // Кінцева вершина

            const result = fordFulkerson(matrix, source, sink);
            setMaxFlowResult(result);
            console.log(`Результат: Максимальний потік = ${result}`);
        } else {
            console.log("Алгоритм ще не реалізовано");
        }
    };

    return (
        <section id="algorithms-section">
            <h2>Алгоритми</h2>
            <button onClick={() => runAlgorithm("Максимальний потік")}>Максимальний потік</button>
            {maxFlowResult !== null && (
                <div className="result">
                    <h3>Результат:</h3>
                    <p>Максимальний потік: {maxFlowResult}</p>
                </div>
            )}
        </section>
    );
};

export default Algorithms;
