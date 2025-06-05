// graphEngine.js

function executeGraph(graph, memory = {}) {
  for (const node of graph) {
    const { id, operation, params } = node;
    console.log(`[${id}] Operation: ${operation}`);

    switch (operation) {
      case 'op_compute':
        handleCompute(params, memory);
        break;
      case 'op_watch':
        handleWatch(id, params, memory);
        break;
      case 'op_if':
        handleIf(params, memory);
        break;
      default:
        console.warn(`[${id}] Unknown operation: ${operation}`);
    }
  }

  console.log('\nFinal memory state:', memory);
}

function handleCompute(params, memory) {
  const { inputs = [], outputs = [], value, compute } = params;
  if (!outputs || outputs.length === 0) return;

  if (value !== undefined) {
    memory[outputs[0]] = value;
    return;
  }

  if (inputs.length >= 2 && compute) {
    const a = memory[inputs[0]];
    const b = memory[inputs[1]];
    let result;

    switch (compute) {
      case 'sum':
        result = a + b;
        break;
      case 'sub':
        result = a - b;
        break;
      case 'mul':
        result = a * b;
        break;
      case 'div':
        result = b !== 0 ? a / b : null;
        break;
      default:
        console.warn(`Unknown compute operation: ${compute}`);
        return;
    }

    memory[outputs[0]] = result;
  }
}

function handleWatch(id, params, memory) {
  const { inputs = [] } = params;
  for (const key of inputs) {
    console.log(`[${id}] WATCH ${key} -> ${memory[key]}`);
  }
}

function handleIf(params, memory) {
  const { condition, then, else: elseBranch } = params;
  if (!condition || typeof condition !== 'object') return;

  const { left, op, right } = condition;
  const a = memory[left];
  const b = memory[right];

  let conditionMet = false;
  switch (op) {
    case 'eq': conditionMet = a === b; break;
    case 'neq': conditionMet = a !== b; break;
    case 'gt': conditionMet = a > b; break;
    case 'lt': conditionMet = a < b; break;
    case 'gte': conditionMet = a >= b; break;
    case 'lte': conditionMet = a <= b; break;
    default:
      console.warn(`Unknown condition operator: ${op}`);
      return;
  }

  const branch = conditionMet ? then : elseBranch;
  if (Array.isArray(branch)) {
    for (const subNode of branch) {
      executeGraph([subNode], memory);
    }
  }
}

module.exports = { executeGraph };