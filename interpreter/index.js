const fs = require('fs');
const path = require('path');
const { executeGraph } = require('./lib/graphEngine');

function loadGraphFromFile(filePath) {
  try {
    const raw = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.graph)) {
      throw new Error("Invalid graph structure: missing 'graph' array");
    }

    return parsed.graph;
  } catch (err) {
    console.error('Failed to load or parse the graph file:', err.message);
    process.exit(1);
  }
}

// Get file path from command line
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node index.js <path_to_graph.json>');
  process.exit(1);
}

const graph = loadGraphFromFile(filePath);

// Execute the graph
executeGraph(graph);
