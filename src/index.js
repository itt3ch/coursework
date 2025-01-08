import React from 'react'; // Імпортуємо React
import ReactDOM from 'react-dom/client'; // Імпортуємо бібліотеку для рендерингу
import './styles/index.css'; // Імпортуємо глобальні стилі
import App from './App'; // Імпортуємо головний компонент App

// Знаходимо кореневий елемент у HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендеримо додаток
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
