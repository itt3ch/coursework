import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/GraphInput.css";

const GraphInput = () => {
    const [vertices, setVertices] = useState(0);
    const [matrix, setMatrix] = useState([]);
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [maxFlowResult, setMaxFlowResult] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const svgRef = useRef(null);
    const simulationRef = useRef(null); 

    const generateGraph = () => {
        const numVertices = vertices;
        let adjMatrix = Array.from({ length: numVertices }, () =>
            Array.from({ length: numVertices }, () => 0)
        );
        let generatedWeights = [];

        for (let i = 0; i < numVertices; i++) {
            for (let j = i + 1; j < numVertices; j++) {
                const hasEdge = Math.random() > 0.1; // 50% шанс на наявність ребра
                if (hasEdge) {
                    const weight = Math.floor(Math.random() * 10) + 1; // Вага від 1 до 10
                    adjMatrix[i][j] = adjMatrix[j][i] = weight; // Вказуємо наявність ребра і його вагу
                    generatedWeights.push({ from: i, to: j, weight });
                }
            }
        }

        setMatrix(adjMatrix);
        setGraphData(generateGraphData(numVertices, adjMatrix));
    };

    const generateGraphData = (numVertices, adjMatrix) => {
        const nodes = Array.from({ length: numVertices }, (_, index) => ({
            id: index,
            x: Math.random() * 600,
            y: Math.random() * 600,
        }));

        const links = [];
        adjMatrix.forEach((row, i) => {
            row.forEach((weight, j) => {
                if (weight > 0 && i < j) {
                    links.push({ source: i, target: j, weight });
                }
            });
        });

        return { nodes, links };
    };

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

    const runAlgorithm = () => {
        const source = 0; // Початкова вершина
        const sink = vertices - 1; // Кінцева вершина
        const result = fordFulkerson(matrix, source, sink);
        setMaxFlowResult(result);
    };

    const handleStartClick = () => {
        if (vertices > 0 && vertices <= 15) {
            generateGraph();
        }
    };

    const handlePauseClick = () => {
        const svg = d3.select(svgRef.current);
        const simulation = simulationRef.current;
    
        if (isPaused) {
            // Відновлення симуляції
            simulation.alpha(1).restart(); 
    
            svg.selectAll('.node')
                .transition()
                .duration(5000)
                .attr("opacity", 1); // Відновлення анімацій для вузлів
    
            svg.selectAll('.link')
                .transition()
                .duration(5000)
                .attr("opacity", 1); // Відновлення анімацій для зв'язків
    
            svg.selectAll('.node-text')
                .transition()
                .duration(3500)
                .attr("opacity", 1); // Відновлення анімацій для тексту
        } else {
            // Зупинка симуляції
            simulation.stop(); 
    
            svg.selectAll('.node').interrupt(); // Зупинка всіх анімацій для вузлів
            svg.selectAll('.link').interrupt(); // Зупинка всіх анімацій для зв'язків
    
            svg.selectAll('.node-text')
                .interrupt() // Зупинка анімацій для тексту
                .attr("opacity", 0); // Сховати текст при паузі
        }
    
        setIsPaused(!isPaused);
    };
    

    const handleAddVertex = () => {
        const newVertexIndex = vertices; // Індекс нової вершини
        setVertices(prevVertices => prevVertices + 1);
    
        // Додаємо нову вершину до даних графу
        const newNode = {
            id: newVertexIndex,
            x: Math.random() * 600, // Випадкова позиція x
            y: Math.random() * 600  // Випадкова позиція y
        };
        setGraphData(prevData => ({
            nodes: [...prevData.nodes, newNode], // Додаємо нову вершину
            links: [...prevData.links], // Зберігаємо існуючі ребра
        }));
    
        // Оновлюємо матрицю суміжності
        const newAdjMatrix = [...matrix];
        // Додаємо нові нулі (без з'єднання) для нової вершини
        newAdjMatrix.forEach(row => row.push(0)); 
        newAdjMatrix.push(Array(newAdjMatrix.length + 1).fill(0)); 
    
        // Генерація випадкових ребер для нової вершини
        for (let i = 0; i < newAdjMatrix.length - 1; i++) {
            const hasEdge = Math.random() > 0.5; // 50% шанс на наявність ребра
            if (hasEdge) {
                const weight = Math.floor(Math.random() * 10) + 1; // Вага від 1 до 10
                newAdjMatrix[i][newAdjMatrix.length - 1] = weight; // Вага ребра
                newAdjMatrix[newAdjMatrix.length - 1][i] = weight; // Вага ребра
                setGraphData(prevData => ({
                    nodes: prevData.nodes,
                    links: [...prevData.links, { source: i, target: newAdjMatrix.length - 1, weight }]
                }));
            }
        }
    
        setMatrix(newAdjMatrix); // Оновлюємо матрицю
    };

    const handleRemoveVertex = () => {
        if (vertices > 0) {
            const vertexToRemove = vertices - 1; // Останній доданий індекс вершини
            setVertices(prevVertices => prevVertices - 1);
    
            // Оновлюємо дані графа
            const updatedNodes = graphData.nodes.filter((node) => node.id !== vertexToRemove);
    
            // Оновлюємо ребра: видаляємо всі, де source або target є видаленою вершиною
            const updatedLinks = graphData.links.filter(
                (link) => link.source.id !== vertexToRemove && link.target.id !== vertexToRemove
            );
    
            // Оновлюємо граф
            setGraphData({ nodes: updatedNodes, links: updatedLinks });
    
            // Оновлюємо матрицю суміжності
            const updatedMatrix = matrix
                .map((row) => row.filter((_, colIndex) => colIndex !== vertexToRemove)) // Видалити стовпці
                .filter((_, rowIndex) => rowIndex !== vertexToRemove); // Видалити рядок
            setMatrix(updatedMatrix);
    
            // Видаляємо відповідні SVG елементи
            const svg = d3.select(svgRef.current);
    
            // Видалення ребер
            svg.selectAll(".link")
                .data(updatedLinks)
                .exit().remove(); // Видалити лінії, пов'язані з видаленою вершиною
    
            // Видалення вершини
            svg.selectAll(".node")
                .data(updatedNodes)
                .exit().remove(); // Видалити старі елементи node
    
            // Видалення тексту (цифри)
            svg.selectAll(".node-text")
                .data(updatedNodes)
                .exit().remove(); // Видалити старі текстові елементи
    
            // Оновлення симуляції
            const simulation = d3.forceSimulation(updatedNodes)
                .force("link", d3.forceLink(updatedLinks).id(d => d.id).distance(100))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(600 / 2, 600 / 2));
    
            simulation.on("tick", () => {
                svg.selectAll(".link")
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
    
                svg.selectAll(".node")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
    
                svg.selectAll(".node-text")
                    .attr("x", d => d.x)
                    .attr("y", d => d.y);
            });
        }
    };
    
    const handleClearTree = () => {
        setVertices(0); // Скидаємо кількість вершин
        setMatrix([]); // Скидаємо матрицю суміжності
        setGraphData({ nodes: [], links: [] }); // Очищаємо дані графа
        setMaxFlowResult(null); // Очищаємо результат максимального потоку
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Видаляємо всі елементи SVG
    };
    useEffect(() => {
        if (matrix.length === 0 || vertices === 0) return;

        const svg = d3.select(svgRef.current)
            .attr("width", 600)
            .attr("height", 600);

        const width = 600;
        const height = 600;
        const radius = 8;

        const simulation = d3.forceSimulation(graphData.nodes)
            .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        simulationRef.current = simulation; // Store the simulation reference

        const linkElements = svg.selectAll(".link")
            .data(graphData.links)
            .enter().append("line")
            .attr("class", "link")
            .attr("stroke-width", d => d.weight)
            .attr("opacity", 0);

        const nodeElements = svg.selectAll(".node")
            .data(graphData.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", radius)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("opacity", 0)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        nodeElements.each(function(d, i) {
            d3.select(this)
                .transition()
                .delay(i * 300)
                .duration(5000)
                .attr("opacity", 1);
        });

        linkElements.each(function(d, i) {
            d3.select(this)
                .transition()
                .delay(i * 500 + graphData.nodes.length * 300)
                .duration(5000)
                .attr("opacity", 1);
        });

        svg.selectAll(".node-text")
            .data(graphData.nodes)
            .enter().append("text")
            .attr("class", "node-text")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("dy", -10)
            .attr("text-anchor", "middle")
            .text(d => d.id)
            .attr("opacity", 0)
            .transition()
            .delay(graphData.nodes.length * 300 + 4000)
            .duration(3500)
            .attr("opacity", 1);

        simulation.on("tick", () => {
            svg.selectAll(".link")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            svg.selectAll(".node")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            svg.selectAll(".node-text")
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

    }, [matrix, vertices]); 

    return (
        <section id="input-section">
            <h2>Введення графу</h2>
            <label htmlFor="vertices">Кількість вершин (макс 15):</label>
            <input
                type="number"
                id="vertices"
                value={vertices}
                onChange={(e) => setVertices(parseInt(e.target.value, 10))}
                min="1"
                max="15"
                required
            />
            <button type="button" onClick={handleStartClick}>Старт</button>
            <button type="button" onClick={handlePauseClick}>
                {isPaused ? "Продовжити" : "Пауза"}
            </button>
            <button type="button" onClick={runAlgorithm}>Максимальний потік</button>
            <button type="button" onClick={handleAddVertex}>Додати вершину</button>
            <button type="button" onClick={handleRemoveVertex}>Видалити останню вершину</button>
            <button type="button" onClick={handleClearTree}>Очистити граф</button>
            {maxFlowResult !== null && (
                <div className="result">
                    <h3>Результат:</h3>
                    <p>Максимальний потік: {maxFlowResult}</p>
                </div>
            )}
            {/* Відображення матриці суміжності */}
            {matrix.length > 0 && (
                <div>
                    <h3>Матриця суміжності</h3>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {Array.from({ length: vertices }, (_, index) => (
                                    <th key={index}>{index}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>{rowIndex}</td>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* SVG для побудови графу */}
            <svg ref={svgRef}></svg>
        </section>
    );
};

export default GraphInput;
