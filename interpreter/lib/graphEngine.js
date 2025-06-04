// graphEngine.js

const fs = require("fs");
const path = require("path");

// Simulated memory and call stack
let memory = {};
let callStack = [];
let returnFlag = false;
let returnValue = null;

// Helpers
function getValue(input) {
  return memory[input];
}

function storeValue(output, value) {
  if (output) memory[output] = value;
}

function log(label, value) {
  console.log(label ? `${label}: ${value}` : value);
}

function debugMemory() {
  console.log("🧠 Current memory state:", JSON.stringify(memory, null, 2));
}

function pauseExecution() {
  console.log("⏸ Execution paused (op_break). Press Enter to continue...");
  require("child_process").spawnSync("bash", ["-c", "read"]);
}

// Operation Implementations
const operations = {
  op_compute: (node) => {
    const { operation, vars } = node.params || {};
    const inputs = (node.inputs || []).map(getValue);

    let result;
    switch (operation) {
      case "assign":
        Object.entries(vars).forEach(([key, val]) => memory[key] = val);
        break;
      case "add":
        result = inputs.reduce((a, b) => a + b, 0);
        storeValue(node.outputs?.[0], result);
        break;
      case "print":
        inputs.forEach(val => console.log(val));
        break;
      default:
        console.warn(`Unknown compute operation: ${operation}`);
    }
  },

  op_fn: (node) => {
    callStack.push({ memory: { ...memory } });
    memory = {};
  },

  op_call: (node) => {
    const fnNodes = node.params?.body || [];
    runGraph({ nodes: fnNodes });
    if (returnFlag) {
      storeValue(node.outputs?.[0], returnValue);
      returnFlag = false;
      returnValue = null;
    }
  },

  op_return: (node) => {
    returnFlag = true;
    returnValue = getValue(node.inputs?.[0]);
    if (callStack.length > 0) {
      memory = callStack.pop().memory;
    }
  },

  op_loop: (node) => {
    const max = getValue(node.params?.max);
    const varName = node.params?.var;
    for (let i = 0; i < max; i++) {
      memory[varName] = i;
      runGraph({ nodes: node.params?.body });
    }
  },

  op_watch: (node) => {
    const inputs = node.inputs || [];
    inputs.forEach(key => {
      console.log(`👁️ ${key}:`, memory[key]);
    });
  },

  op_debug: () => {
    debugMemory();
  },

  op_break: () => {
    pauseExecution();
  }
};

// Main Graph Runner
function runGraph(graph) {
  const nodes = graph.nodes;
  for (const node of nodes) {
    if (returnFlag) break;
    const fn = operations[node.op];
    if (fn) {
      console.log(`\n[Node ${node.id}]\nOperation: ${node.op}`);
      fn(node);
    } else {
      console.warn(`⚠️ Unknown op: ${node.op}`);
    }
  }
  if (!callStack.length) {
    console.log("\nFinal memory state:", memory);
  }
}

module.exports = { runGraph };
