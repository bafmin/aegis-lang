
const { handleImport } = require("./graphEngine");

function op_log(id, params, memory) {
  console.log(`[${id}] Log:`, params.message || "(no message)");
}

function op_compute(id, params, memory) {
  const { inputs = [], outputs = [], value, compute } = params;
  let result;

  if (typeof value !== "undefined") {
    result = value;
  } else if (compute === "sum") {
    result = inputs.reduce((sum, key) => sum + (memory[key] || 0), 0);
  } else {
    console.warn(`[${id}] Unknown compute operation:`, compute);
    return;
  }

  outputs.forEach((key) => {
    memory[key] = result;
  });

  console.log(`[${id}] Computed ${outputs.join(", ")} = ${result}`);
}

function op_watch(id, params, memory) {
  const { inputs = [] } = params;
  const snapshot = inputs.map(key => `${key}: ${memory[key]}`).join(", ");
  console.log(`[${id}] Watch -> ${snapshot}`);
}

function safeEval(expr, memory) {
  try {
    const result = Function("memory", `return (${expr});`)(memory);
    return !!result;
  } catch (e) {
    console.warn(`[eval] Error evaluating: "${expr}" → ${e.message}`);
    return false;
  }
}

function op_if(id, params, memory, functions, basePath) {
  const { condition, then: thenGraph = [], else: elseGraph = [] } = params;
  let result = false;

  if (condition) {
    if (condition.equals) {
      const [key, value] = condition.equals;
      result = memory[key] === value;
    } else if (condition.eval) {
      result = safeEval(condition.eval, memory);
    }
  }

  const branch = result ? thenGraph : elseGraph;
  console.log(`[${id}] Condition is ${result ? "true" : "false"}, executing ${branch.length} nodes`);

  const { executeGraph } = require("./graphEngine");
  executeGraph(branch, memory, functions, basePath);
}

function op_loop(id, params, memory, functions, basePath) {
  const { times = 1, body = [] } = params;
  const { executeGraph } = require("./graphEngine");

  for (let i = 0; i < times; i++) {
    console.log(`[${id}] Loop iteration ${i + 1} of ${times}`);
    executeGraph(body, memory, functions, basePath);
  }
}

module.exports = {
  op_import: handleImport,
  op_log,
  op_compute,
  op_watch,
  op_if,
  op_loop
};
