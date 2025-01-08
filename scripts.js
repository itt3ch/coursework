document.getElementById('graph-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Зупиняємо перезавантаження сторінки
  
    const vertices = document.getElementById('vertices').value;
    const edges = document.getElementById('edges').value;
  
    const graphVisualization = document.getElementById('graph-visualization');
    graphVisualization.innerHTML = `<p>Побудовано граф з ${vertices} вершинами та ${edges} ребрами.</p>`;
  });
  
  function runAlgorithm(algorithm) {
    const result = document.createElement('p');
    result.innerText = `Алгоритм ${algorithm} виконано! (приклад)`;
    document.getElementById('algorithms-section').appendChild(result);
  }