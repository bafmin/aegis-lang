
const fs = require('fs');
const { parseGraph, executeGraph } = require('./lib/graphEngine');

const file = process.argv[2];
if (!file) {
  console.error("Usage: node index.js <graph.json>");
  process.exit(1);
}

const graph = parseGraph(fs.readFileSync(file, 'utf-8'));
executeGraph(graph);
    