
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
        handleIf(params, memory, graph);
        break;
      case 'op_loop':
        handleLoop(id, params, memory);
        break;
      default:
        console.warn(`[${id}] Unknown operation: ${operation}`);
    }
  }
  return memory;
}

function handleCompute(params, memory) {
  const { inputs = [], outputs = [], value, compute } = params;

  // Simple assignment
  if (value !== undefined && outputs.length === 1) {
    memory[outputs[0]] = value;
    return;
  }

  // Arithmetic operations
  if (inputs.length === 2 && outputs.length === 1 && compute) {
    const [a, b] = inputs.map(k => memory[k]);
    let result;

    switch (compute) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
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
  const { inputs } = params;
  if (!inputs) return;
  for (const key of inputs) {
    console.log(`[${id}] WATCH ${key} -> ${memory[key]}`);
  }
}

function handleIf(params, memory, graph) {
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
  }

  const branch = conditionMet ? then : elseBranch;
  if (Array.isArray(branch)) {
    for (const subNode of branch) {
      executeGraph([subNode], memory);
    }
  }
}

function handleLoop(id, params, memory) {
  const { var: loopVar, from, to, step = 1, body } = params;
  if (!loopVar || !Array.isArray(body)) return;

  for (let i = from; i <= to; i += step) {
    memory[loopVar] = i;
    for (const subNode of body) {
      executeGraph([subNode], memory);
    }
  }
}

module.exports = { executeGraph };
