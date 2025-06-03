
function parseGraph(jsonStr) {
  return JSON.parse(jsonStr);
}

function executeGraph(graph) {
  const nodes = graph.nodes;
  for (const node of nodes) {
    console.log(`Executing node ${node.id} (${node.op})`);
    // Placeholder logic
    if (node.params.operation === 'const') {
      console.log(`Value: ${node.params.value}`);
    }
    if (node.params.operation === 'print') {
      console.log('Print triggered.');
    }
  }
}

module.exports = { parseGraph, executeGraph };
    