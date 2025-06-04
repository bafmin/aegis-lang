
function parseGraph(jsonStr) {
  return JSON.parse(jsonStr);
}

function executeGraph(graph) {
  const memory = {};
  const nodeMap = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
  const executed = new Set();

  function evalNode(node) {
    if (executed.has(node.id)) return;
    const inputs = node.inputs?.map(id => memory[id]) || [];
    let output = null;
    let shouldExecute = true;

    switch (node.op) {
      case 'op_compute':
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
          case 'gt':
            output = inputs[0] > inputs[1];
            break;
          case 'lt':
            output = inputs[0] < inputs[1];
            break;
          case 'eq':
            output = inputs[0] === inputs[1];
            break;
          case 'print':
            console.log("Output:", node.params.value ?? inputs[0]);
            break;
          default:
            console.warn("Unknown compute op:", node.params.operation);
        }
        break;

      case 'op_control':
        switch (node.params.operation) {
          case 'if':
            const condition = inputs[0];
            if (condition) {
              node.params.true_branch.forEach(nid => evalNode(nodeMap[nid]));
            } else {
              node.params.false_branch.forEach(nid => evalNode(nodeMap[nid]));
            }
            shouldExecute = false;
            break;
          default:
            console.warn("Unknown control op:", node.params.operation);
        }
        break;

      case 'op_loop':
        const { var: loopVar, from, to, body } = node.params;
        for (let i = from; i <= to; i++) {
          memory[loopVar] = i;
          console.log(`[Loop ${node.id}] ${loopVar} =`, i);
          body.forEach(nid => evalNode(nodeMap[nid]));
        }
        output = to;
        break;
    }

    if (shouldExecute && node.outputs && output !== null) {
      memory[node.outputs[0]] = output;
      console.log(`[Node ${node.id}] -> ${node.outputs[0]} =`, output);
    }

    executed.add(node.id);
  }

  graph.nodes.forEach(evalNode);
  console.log("\nFinal memory state:", memory);
}

module.exports = { parseGraph, executeGraph };
    