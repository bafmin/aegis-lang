
const fs = require('fs');
const path = require('path');

function parseGraph(jsonStr) {
  return JSON.parse(jsonStr);
}

function executeGraph(graph, externalMemory = {}, basePath = ".", fnRegistry = {}) {
  const memory = { ...externalMemory };
  const nodeMap = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
  const executed = new Set();

  function cloneMemory(mem, keys) {
    return keys ? Object.fromEntries(keys.map(k => [k, mem[k]])) : { ...mem };
  }

  function evalNode(node) {
    if (executed.has(node.id)) return;
    const inputs = node.inputs?.map(id => memory[id]) || [];
    let output = null;
    let shouldExecute = true;

    switch (node.op) {
      case 'op_compute':
        switch (node.params.operation) {
          case 'const': output = node.params.value; break;
          case 'add': output = inputs.reduce((a, b) => a + b, 0); break;
          case 'multiply': output = inputs.reduce((a, b) => a * b, 1); break;
          case 'gt': output = inputs[0] > inputs[1]; break;
          case 'lt': output = inputs[0] < inputs[1]; break;
          case 'eq': output = inputs[0] === inputs[1]; break;
          case 'print': console.log("Output:", node.params.value ?? inputs[0]); break;
          default: console.warn("Unknown compute op:", node.params.operation);
        }
        break;

      case 'op_control':
        if (node.params.operation === 'if') {
          const condition = inputs[0];
          const branch = condition ? node.params.true_branch : node.params.false_branch;
          branch.forEach(nid => evalNode(nodeMap[nid]));
          shouldExecute = false;
        }
        break;

      case 'op_loop':
        for (let i = node.params.from; i <= node.params.to; i++) {
          memory[node.params.var] = i;
          console.log(`[Loop ${node.id}] ${node.params.var} =`, i);
          node.params.body.forEach(nid => evalNode(nodeMap[nid]));
        }
        output = node.params.to;
        break;

      case 'op_agent':
        const scopedA = node.params.scoped;
        const scope = node.params.scope || [];
        const agentMem = scopedA ? cloneMemory(memory, scope) : memory;
        node.params.steps.forEach(id => executeGraph({ nodes: [nodeMap[id]] }, agentMem, basePath, fnRegistry));
        if (scopedA && node.params.outputs) {
          node.params.outputs.forEach(k => memory[k] = agentMem[k]);
        }
        console.log(`[Agent ${node.id}] Final memory:`, agentMem);
        shouldExecute = false;
        break;

      case 'op_import':
        const importPath = path.resolve(basePath, node.params.file);
        const subGraph = parseGraph(fs.readFileSync(importPath, 'utf-8'));
        console.log(`[Import ${node.id}] Executing ${node.params.file}`);
        const scopedI = node.params.scoped;
        const importMem = scopedI ? cloneMemory(memory, node.params.scope) : memory;
        executeGraph(subGraph, importMem, path.dirname(importPath), fnRegistry);
        if (scopedI && node.params.outputs) {
          node.params.outputs.forEach(k => memory[k] = importMem[k]);
        }
        shouldExecute = false;
        break;

      case 'op_fn':
        const fnName = node.params.name;
        fnRegistry[fnName] = node;
        console.log(`[Function Defined] ${fnName}`);
        shouldExecute = false;
        break;

      case 'op_call':
        const fn = fnRegistry[node.params.fn];
        if (!fn) {
          console.error(`[ERROR] Function not found: ${node.params.fn}`);
          break;
        }
        const fnInputs = {};
        fn.params.inputs.forEach((k, i) => fnInputs[k] = node.params.args[i]);
        const scopedC = node.params.scoped;
        const fnMem = scopedC ? { ...fnInputs } : memory;
        fn.params.body.forEach(nid => executeGraph({ nodes: [nodeMap[nid]] }, fnMem, basePath, fnRegistry));
        if (scopedC && fn.params.outputs && node.params.results) {
          fn.params.outputs.forEach((out, i) => memory[node.params.results[i]] = fnMem[out]);
        } else if (!scopedC && fn.params.outputs && node.params.results) {
          fn.params.outputs.forEach((out, i) => memory[node.params.results[i]] = memory[out]);
        }
        console.log(`[Function Called] ${node.params.fn} ->`, node.params.results.map(r => memory[r]));
        shouldExecute = false;
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
    