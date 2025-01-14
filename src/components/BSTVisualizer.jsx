import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom"; // Якщо використовуєте React Router для навігації.
import "../styles/BSTVisualizer.css";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  delete(value) {
    const deleteNode = (node, value) => {
      if (!node) return null;
      if (value < node.value) {
        node.left = deleteNode(node.left, value);
        return node;
      } else if (value > node.value) {
        node.right = deleteNode(node.right, value);
        return node;
      } else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        let successor = node.right;
        while (successor.left) {
          successor = successor.left;
        }
        node.value = successor.value;
        node.right = deleteNode(node.right, successor.value);
        return node;
      }
    };
    this.root = deleteNode(this.root, value);
  }
}

const BinarySearchTreeVisualizer = () => {
  const [bst, setBst] = useState(new BinarySearchTree());
  const [inputValue, setInputValue] = useState("");
  const [searchMessage, setSearchMessage] = useState(""); // Додаємо стан для повідомлення
  const [previousFoundNode, setPreviousFoundNode] = useState(null); // Додаємо стан для збереження попередньої знайденої вершини
  const svgRef = useRef();
  const navigate = useNavigate(); // Для переходу на інші сторінки.

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500;

    svg.selectAll("*").remove();

    const drawTree = (node, x, y, depth) => {
      if (!node) return;

      const offsetX = 300 / (depth + 1);
      const offsetY = 80;

      if (node.left) {
        svg
          .append("line")
          .attr("x1", x)
          .attr("y1", y)
          .attr("x2", x - offsetX)
          .attr("y2", y + offsetY)
          .attr("stroke", "#00796b")
          .attr("stroke-width", 2);

        drawTree(node.left, x - offsetX, y + offsetY, depth + 1);
      }

      if (node.right) {
        svg
          .append("line")
          .attr("x1", x)
          .attr("y1", y)
          .attr("x2", x + offsetX)
          .attr("y2", y + offsetY)
          .attr("stroke", "#00796b")
          .attr("stroke-width", 2);

        drawTree(node.right, x + offsetX, y + offsetY, depth + 1);
      }

      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .attr("fill", "#ffffff")
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("data-value", node.value);

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(node.value);
    };

    if (bst.root) {
      drawTree(bst.root, width / 2, 50, 1);
    }
  }, [bst]);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const newTree = new BinarySearchTree();
      Object.assign(newTree, bst);
      newTree.insert(value);
      setBst(newTree);
      setInputValue("");
    }
  };

  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const newTree = new BinarySearchTree();
      Object.assign(newTree, bst);
      newTree.delete(value);
      setBst(newTree);
      setInputValue("");
    }
  };

  const handleFind = () => {
    const value = parseInt(inputValue);
    setSearchMessage(""); // Очищуємо попереднє повідомлення
    if (isNaN(value) || !bst.root) {
      setSearchMessage("Будь ласка, введіть коректне число.");
      return;
    }

    const svg = d3.select(svgRef.current);

    // Скидаємо колір попередньої знайденої вершини
    if (previousFoundNode !== null) {
      svg
        .selectAll("circle")
        .filter(function () {
          return +d3.select(this).attr("data-value") === previousFoundNode;
        })
        .attr("fill", "#ffffff");
    }

    const searchAndVisualize = async (node) => {
      if (!node) {
        setSearchMessage("Вершину не знайдено.");
        return;
      }

      // Офарбовуємо поточний вузол у сірий
      svg
        .selectAll("circle")
        .filter(function () {
          return +d3.select(this).attr("data-value") === node.value;
        })
        .attr("fill", "gray");

      await new Promise((resolve) => setTimeout(resolve, 500)); // Затримка 500 мс

      if (node.value === value) {
        // Знайдена вершина
        svg
          .selectAll("circle")
          .filter(function () {
            return +d3.select(this).attr("data-value") === node.value;
          })
          .attr("fill", "green");
        setPreviousFoundNode(node.value); // Оновлюємо стан попередньої знайденої вершини
        setSearchMessage("Вершину знайдено.");
        return;
      }

      // Повертаємо поточний вузол у білий
      svg
        .selectAll("circle")
        .filter(function () {
          return +d3.select(this).attr("data-value") === node.value;
        })
        .attr("fill", "#ffffff");

      // Переходимо до наступного вузла
      if (value < node.value) {
        await searchAndVisualize(node.left);
      } else {
        await searchAndVisualize(node.right);
      }
    };

    searchAndVisualize(bst.root);
  };

  const handleReset = () => {
    setBst(new BinarySearchTree());
    setSearchMessage(""); // Скидаємо повідомлення
    setPreviousFoundNode(null); // Скидаємо попередню знайдену вершину
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введіть число"
        />
        <button onClick={handleInsert}>Додати вершину</button>
        <button onClick={handleDelete}>Видалити вершину</button>
        <button onClick={handleFind}>Пошук</button>
        <button onClick={handleReset}>Очистити дерево</button>
      </div>
      <p>{searchMessage}</p> {/* Відображення повідомлення */}
      <svg ref={svgRef} width="800" height="500"></svg>
    </div>
  );
};

export default BinarySearchTreeVisualizer;
