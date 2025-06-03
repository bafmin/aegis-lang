
function parseGraph(jsonStr) {
  return JSON.parse(jsonStr);
}

function executeGraph(graph) {
  const memory = {};
  const nodes = graph.nodes;

  for (const node of nodes) {
    console.log(`\n[Node ${node.id}]`);
    console.log(`Operation: ${node.op}`);
    const inputs = node.inputs.map(id => memory[id]);
    let output = null;

    switch (node.params.operation) {
      case 'const':
        output = node.params.value;
        break;
      case 'add':
        output = inputs.reduce((a, b) => a + b, 0);
        break;
      case 'multiply':
        output = inputs.reduce((a, b) => a * b, 1);
        break;
      case 'print':
        console.log("Output:", inputs[0]);
        break;
      default:
        console.warn("Unknown operation:", node.params.operation);
    }

    if (node.outputs && node.outputs.length > 0 && output !== null) {
      memory[node.outputs[0]] = output;
      console.log(`Stored ${output} in ${node.outputs[0]}`);
    }
  }

  console.log("\nFinal memory state:", memory);
}

module.exports = { parseGraph, executeGraph };
    