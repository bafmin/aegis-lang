let functionRegistry = {};

function handleCompute(params, memory) {
  const { inputs = [], outputs = [], compute, value } = params;
  if (value !== undefined && outputs.length > 0) {
    memory[outputs[0]] = value;
  } else if (compute === "sum" && inputs.length === 2) {
    const a = memory[inputs[0]];
    const b = memory[inputs[1]];
    memory[outputs[0]] = a + b;
  }
}

function handleWatch(id, params, memory) {
  const { inputs = [] } = params;
  for (const key of inputs) {
    console.log(`[${id}] WATCH ${key} -> ${memory[key]}`);
  }
}

function handleReturn(params, memory) {
  const { inputs = [] } = params;
  const result = inputs.map((key) => memory[key]);
  throw { type: "return", value: result };
}

function handleFn(id, params) {
  const { name, args = [], returns = [], body } = params;
  if (!name || !Array.isArray(body)) {
    console.warn(`[${id}] Malformed function definition.`);
    return;
  }
  functionRegistry[name] = { args, returns, body };
}

function handleCall(id, params, memory) {
  const { function: fnName, inputs = [], outputs = [] } = params;
  const fn = functionRegistry[fnName];
  if (!fn) {
    console.warn(`[${id}] Function '${fnName}' not found`);
    return;
  }

  const scopedMemory = {};
  fn.args.forEach((arg, idx) => {
    scopedMemory[arg] = memory[inputs[idx]];
  });

  try {
    executeGraph(fn.body, scopedMemory);
  } catch (e) {
    if (e.type === "return") {
      fn.returns.forEach((ret, idx) => {
        memory[outputs[idx]] = e.value[idx];
      });
    } else {
      throw e;
    }
  }
}

function executeGraph(graph, memory = {}) {
  for (const node of graph) {
    const { id, operation, params } = node;
    console.log(`[${id}] Operation: ${operation}`);
    switch (operation) {
      case "op_compute":
        handleCompute(params, memory);
        break;
      case "op_watch":
        handleWatch(id, params, memory);
        break;
      case "op_fn":
        handleFn(id, params);
        break;
      case "op_call":
        handleCall(id, params, memory);
        break;
      case "op_return":
        handleReturn(params, memory);
        break;
      default:
        console.warn(`[${id}] Unknown operation: ${operation}`);
    }
  }
  return memory;
}

module.exports = { executeGraph };