import React, { useState } from "react";
import BSTVisualizer from "../components/BSTVisualizer";
import "../styles/BinarySearchTree.css";

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

  find(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
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

  getTree() {
    return this.root;
  }
}

const BinarySearchTreeComponent = () => {
  const [tree] = useState(new BinarySearchTree());
  const [inputValue, setInputValue] = useState("");
  const [action, setAction] = useState(null);

  const handleInsert = () => {
    if (!isNaN(inputValue) && inputValue !== "") {
      tree.insert(parseInt(inputValue));
      setAction("insert");
    }
  };

  const handleDelete = () => {
    if (!isNaN(inputValue) && inputValue !== "") {
      tree.delete(parseInt(inputValue));
      setAction("delete");
    }
  };

  const handleFind = () => {
    if (!isNaN(inputValue) && inputValue !== "") {
      const found = tree.find(parseInt(inputValue));
      alert(found ? "Node found" : "Node not found");
    }
  };

  return (
    <div>
      <h1>Binary Search Tree</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
        />
        <button onClick={handleInsert}>Insert</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleFind}>Find</button>
      </div>
      <BSTVisualizer tree={tree.getTree()} action={action} />
    </div>
  );
};

export { BinarySearchTree };
export default BinarySearchTreeComponent;
