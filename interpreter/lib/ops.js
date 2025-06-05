const { handleImport } = require("./graphEngine");

function op_log(id, params, memory) {
  console.log(`[${id}] Log:`, params.message || "(no message)");
}

module.exports = {
  op_import: handleImport,
  op_log,
};