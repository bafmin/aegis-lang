
const path = require("path");
const fs = require("fs");

function executeGraph(graph, memory = {}, functions = {}, basePath = process.cwd()) {
  for (const node of graph) {
    const { id, op, params } = node;
    console.log(`[${id}] Operation: ${op}`);
    const fn = functions[op];
    if (!fn) {
      console.error(`Unknown operation: ${op}`);
      continue;
    }
    fn(id, params, memory, functions, basePath);
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
