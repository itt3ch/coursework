import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/BSTVisualizer.css"

const BSTVisualizer = ({ tree }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!tree) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;

    // Очищаємо SVG перед малюванням
    svg.selectAll("*").remove();

    svg.attr("width", width)
      .attr("height", height)
      .style("background", "#f9f9f9")
      .style("border", "1px solid #ccc");

    const drawTree = (node, x, y, depth) => {
      if (!node) return;

      const offsetX = 300 / (depth + 1); // Горизонтальне зміщення
      const offsetY = 80; // Вертикальне зміщення

      // Малювання ліній до дочірніх вузлів
      if (node.left) {
        svg.append("line")
          .attr("x1", x)
          .attr("y1", y)
          .attr("x2", x - offsetX)
          .attr("y2", y + offsetY)
          .attr("stroke", "green")
          .attr("stroke-width", 2);

        drawTree(node.left, x - offsetX, y + offsetY, depth + 1);
      }

      if (node.right) {
        svg.append("line")
          .attr("x1", x)
          .attr("y1", y)
          .attr("x2", x + offsetX)
          .attr("y2", y + offsetY)
          .attr("stroke", "green")
          .attr("stroke-width", 2);

        drawTree(node.right, x + offsetX, y + offsetY, depth + 1);
      }

      // Малювання вузлів
      svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 2);

      svg.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(node.value);
    };

    drawTree(tree, width / 2, 50, 1); // Початкова позиція кореня
  }, [tree]); // Викликаємо, коли змінюється дерево

  return <svg ref={svgRef}></svg>;
};

export default BSTVisualizer;
