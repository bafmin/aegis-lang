
const readline = require("readline");
const { executeGraph } = require("./graphEngine");

function op_import(id, params, memory, functions, basePath) {
  const path = require("path");
  const fs = require("fs");

  const { path: importPath, scope = "global" } = params;
  console.log(`[${id}] Importing: ${importPath} (${scope})`);

  const fullPath = path.resolve(basePath, importPath);
  const data = fs.readFileSync(fullPath, "utf-8");
  const imported = JSON.parse(data);

  const contextMemory = scope === "scoped" ? {} : memory;
  executeGraph(imported.graph, contextMemory, functions, path.dirname(fullPath));
  if (scope === "scoped") Object.assign(memory, contextMemory);
}

function op_compute(id, params, memory) {
  const { inputs = [], outputs = [], value, compute } = params;

  let result = value;
  if (compute && inputs.length > 0) {
    const values = inputs.map(key => memory[key]);
    if (compute === "sum") result = values.reduce((a, b) => a + b, 0);
  }

  outputs.forEach(output => {
    memory[output] = result;
    console.log(`[${id}] Computed ${output} = ${result}`);
  });
}

function op_watch(id, params, memory) {
  const { inputs = [] } = params;
  const snapshot = inputs.map(key => `${key}: ${memory[key]}`).join(", ");
  console.log(`[${id}] Watch -> ${snapshot}`);
}

function op_log(id, params) {
  const { message } = params;
  console.log(`[${id}] Log: ${message}`);
}

function op_input(id, params, memory, functions, basePath, context = {}) {
  const { inputs = [] } = params;
  inputs.forEach(key => {
    memory[key] = context[key] || undefined;
    console.log(`[${id}] Injected: ${key} = ${memory[key]}`);
  });
}

function op_call(id, params, memory, functions) {
  const { func, inputs = [], outputs = [] } = params;
  const fn = functions[func];
  if (typeof fn !== "function") throw new Error(`[${id}] Unknown function: ${func}`);
  const args = inputs.map(key => memory[key]);
  const result = fn(...args);
  outputs.forEach((key, i) => memory[key] = Array.isArray(result) ? result[i] : result);
  console.log(`[${id}] Called ${func} → ${result}`);
}

function op_try(id, params, memory, functions, basePath) {
  const { try: tryBlock = [], catch: catchBlock = [] } = params;
  try {
    executeGraph(tryBlock, memory, functions, basePath);
  } catch (err) {
    console.warn(`[${id}] Error caught: ${err.message}`);
    executeGraph(catchBlock, memory, functions, basePath);
  }
}

function op_return(id, params) {
  const { value } = params;
  console.log(`[${id}] Returning: ${value}`);
  const e = new Error("Return");
  e.__aegisReturn = true;
  e.value = value;
  throw e;
}

function op_set(id, params, memory) {
  const { key, value } = params;
  memory[key] = value;
  console.log(`[${id}] Set ${key} = ${value}`);
}

function op_append(id, params, memory) {
  const { key, value } = params;
  if (!Array.isArray(memory[key])) memory[key] = [];
  memory[key].push(value);
  console.log(`[${id}] Appended to ${key}: ${value}`);
}

function op_scope(id, params, memory, functions, basePath) {
  const { body = [] } = params;
  const clonedMemory = JSON.parse(JSON.stringify(memory));

  console.log(`[${id}] Entering scoped memory context`);
  try {
    executeGraph(body, clonedMemory, functions, basePath);
  } catch (err) {
    if (!err.__aegisReturn) throw err;
    console.warn(`[${id}] Scoped return: ${err.value}`);
  }
  console.log(`[${id}] Exiting scoped memory context`);
}

function op_fork(id, params, memory, functions, basePath) {
  const { branches = [] } = params;

  console.log(`[${id}] Forking ${branches.length} branches`);
  branches.forEach((branch, index) => {
    const cloned = JSON.parse(JSON.stringify(memory));
    console.log(`[${id}] → Branch ${index + 1}`);
    try {
      executeGraph(branch, cloned, functions, basePath);
    } catch (err) {
      if (!err.__aegisReturn) throw err;
      console.warn(`[${id}] Branch ${index + 1} return: ${err.value}`);
    }
  });
}

function op_delay(id, params) {
  const { ms = 1000 } = params;
  console.log(`[${id}] Delaying for ${ms}ms`);
  const start = Date.now();
  const end = start + ms;
  while (Date.now() < end);
}

function op_eval(id, params, memory) {
  const { expression, outputs = [] } = params;
  try {
    const func = new Function(...Object.keys(memory), `return ${expression}`);
    const result = func(...Object.values(memory));
    outputs.forEach((key, i) => memory[key] = Array.isArray(result) ? result[i] : result);
    console.log(`[${id}] Eval result: ${result}`);
  } catch (err) {
    console.warn(`[${id}] Eval error: ${err.message}`);
  }
}

function op_exit(id, params) {
  const { message = "Exited", code = 0 } = params;
  console.log(`[${id}] Exit: ${message}`);
  process.exit(code);
}

function op_debug(id, params, memory) {
  const { inputs = [], message = "" } = params;
  const snapshot = inputs.length
    ? inputs.map(key => `${key}: ${JSON.stringify(memory[key])}`).join(", ")
    : JSON.stringify(memory, null, 2);
  console.log(`[${id}] Debug ${message ? `(${message})` : ""}: ${snapshot}`);
}

function op_prompt(id, params, memory, done) {
  const { message = "Enter input:", key = "input" } = params;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`[${id}] Prompt: ${message} `, (answer) => {
    memory[key] = answer;
    console.log(`[${id}] Stored ${key} = ${answer}`);
    rl.close();
    done();
  });
}

function op_require(id, params, memory) {
  const { keys = [] } = params;
  const missing = [];

  for (const key of keys) {
    if (!(key in memory)) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.log(`[${id}] Missing required keys: ${missing.join(", ")}`);
    throw new Error(`Missing required keys: ${missing.join(", ")}`);
  }

  console.log(`[${id}] All required keys are present: ${keys.join(", ")}`);
}

function op_random(id, params, memory) {
  const { min = 0, max = 1, key = "random" } = params;
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  memory[key] = result;
  console.log(`[${id}] Random ${key} = ${result}`);
}

module.exports = {
  op_import,
  op_compute,
  op_watch,
  op_log,
  op_input,
  op_call,
  op_try,
  op_return,
  op_set,
  op_append,
  op_scope,
  op_fork,
  op_delay,
  op_eval,
  op_exit,
  op_debug,
  op_prompt,
  op_require,
  op_random,
};
