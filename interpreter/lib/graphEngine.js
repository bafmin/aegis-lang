
const fs = require("fs");
const path = require("path");
const ops = require("./ops");

function executeGraph(graph, memory = {}, functions = {}) {
  let currentIndex = 0;

  function runNext() {
    if (currentIndex >= graph.length) return;

    const node = graph[currentIndex];
    const { id, operation, params } = node;

    const opFunc = ops[operation];
    console.log(`[${id}] Operation: ${operation}`);

    if (!opFunc) {
      console.log(`Unknown operation: ${operation}`);
      currentIndex++;
      runNext();
      return;
    }

    // Check if function expects a callback (async)
    if (opFunc.length === 4) {
      opFunc(id, params, memory, () => {
        currentIndex++;
        runNext();
      });
    } else {
      opFunc(id, params, memory, functions);
      currentIndex++;
      runNext();
    }
  }

  runNext();
}

function loadGraph(filepath, memory = {}, functions = {}) {
  const fullPath = path.resolve(__dirname, filepath);
  const data = fs.readFileSync(fullPath, "utf-8");
  const parsed = JSON.parse(data);
  executeGraph(parsed.graph, memory, functions);
}

module.exports = {
  executeGraph,
  loadGraph,
};
