
const path = require("path");
const fs = require("fs");

function executeGraph(graph, memory = {}, functions = {}, basePath = process.cwd()) {
  for (const node of graph) {
    const { id, operation, op, params } = node;
    const actualOp = operation || op;
    console.log(`[${id}] Operation: ${actualOp}`);
    const fn = functions[actualOp];
    if (!fn) {
      console.error(`Unknown operation: ${actualOp}`);
      continue;
    }
    try {
      fn(id, params, memory, functions, basePath);
    } catch (e) {
      if (e.__aegisReturn) {
        memory["__return"] = e.value;
        console.log(`[${id}] Graph halted via return`);
        break;
      } else {
        throw e;
      }
    }
  }
}

function handleImport(id, params, memory, functions, basePath) {
  const { path: importPath, scope = "global" } = params;
  const fullImportPath = path.resolve(basePath, importPath);
  console.log(`[op_import] Importing: ${importPath} (${scope})`);
  const data = fs.readFileSync(fullImportPath, "utf-8");
  const imported = JSON.parse(data);
  const contextMemory = scope === "scoped" ? {} : memory;
  executeGraph(imported.graph, contextMemory, functions, path.dirname(fullImportPath));
  if (scope === "scoped") {
    Object.assign(memory, contextMemory);
  }
}

module.exports = {
  executeGraph,
  handleImport
};
