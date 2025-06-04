// index.js

const { runGraph } = require("./lib/graphEngine");
const graph = require("../samples/math_pipeline.json");

runGraph(graph);
