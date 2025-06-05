
const { handleImport } = require("./graphEngine");
const { tools } = require("./functions");

function resolvePath(obj, path) {
  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
}

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
  const snapshot = inputs.map(key => `${key}: ${resolvePath(memory, key)}`).join(", ");
  console.log(`[${id}] Watch -> ${snapshot}`);
}

function safeEval(expr, memory) {
  try {
    return !!Function("memory", `return (${expr});`)(memory);
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

function op_return(id, params, memory) {
  const value = params.value;
  console.log(`[${id}] Returning: ${value}`);
  throw { __aegisReturn: true, value };
}

function op_input(id, params, memory) {
  const { map = {} } = params;
  for (const [target, sourcePath] of Object.entries(map)) {
    const value = resolvePath(memory, sourcePath);
    memory[target] = value;
    console.log(`[${id}] Injected: ${target} = ${value}`);
  }
}

function op_call(id, params, memory) {
  const { function: fnPath, args = [], output } = params;
  const fn = fnPath.split(".").reduce((ref, key) => ref && ref[key], { tools });

  if (typeof fn !== "function") {
    console.warn(`[${id}] Function not found: ${fnPath}`);
    return;
  }

  const resolvedArgs = args.map(arg =>
    typeof arg === "string" && arg.startsWith("$") ? memory[arg.slice(1)] : arg
  );

  const result = fn(...resolvedArgs);
  if (output) memory[output] = result;
  console.log(`[${id}] Called ${fnPath} → ${result}`);
}

function op_try(id, params, memory, functions, basePath) {
  const { try: tryBlock = [], catch: catchBlock = [] } = params;
  const { executeGraph } = require("./graphEngine");

  try {
    executeGraph(tryBlock, memory, functions, basePath);
  } catch (err) {
    console.warn(`[${id}] Error caught: ${err.message || err}`);
    executeGraph(catchBlock, memory, functions, basePath);
  }
}

function op_set(id, params, memory) {
  const { key, value } = params;
  const parts = key.split(".");
  let target = memory;

  while (parts.length > 1) {
    const part = parts.shift();
    if (!(part in target)) target[part] = {};
    target = target[part];
  }

  target[parts[0]] = value;
  console.log(`[${id}] Set ${key} = ${value}`);
}

function op_append(id, params, memory) {
  const { list, value } = params;
  const parts = list.split(".");
  let target = memory;

  while (parts.length > 1) {
    const part = parts.shift();
    if (!(part in target)) target[part] = {};
    target = target[part];
  }

  const finalKey = parts[0];
  if (!Array.isArray(target[finalKey])) {
    target[finalKey] = [];
  }

  target[finalKey].push(value);
  console.log(`[${id}] Appended to ${list}: ${value}`);
}


function op_scope(id, params, memory, functions, basePath) {
  const { body = [] } = params;
  const clonedMemory = JSON.parse(JSON.stringify(memory));
  const { executeGraph } = require("./graphEngine");

  console.log(`[${id}] Entering scoped memory context`);
  try {
    executeGraph(body, clonedMemory, functions, basePath);
  } catch (err) {
    if (!err.__aegisReturn) throw err;
    console.warn(`[${id}] Scoped return: ${err.value}`);
  }
  console.log(`[${id}] Exiting scoped memory context`);
}

module.exports = {
  op_scope,
  op_import: handleImport,
  op_log,
  op_compute,
  op_watch,
  op_if,
  op_loop,
  op_return,
  op_input,
  op_call,
  op_try,
  op_set,
  op_append
};
