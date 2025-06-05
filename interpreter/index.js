
const fs = require("fs");
const path = require("path");
const { executeGraph } = require("./lib/graphEngine");

function loadGraph(filePath) {
  const fullPath = path.resolve(filePath);
  const graphData = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  const basePath = path.dirname(fullPath);

  const memory = {
    user: {
      name: "Phillip",
      email: "phillip@example.com"
    }
  };

  executeGraph(graphData.graph, memory, require("./lib/ops"), basePath);
}

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: node index.js <path-to-graph.json>");
  process.exit(1);
}

loadGraph(inputFile);
