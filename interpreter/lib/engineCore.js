
function executeGraph(graph, memory, functions, basePath = __dirname) {
  let currentIndex = 0;
  const runNext = () => {
    if (currentIndex >= graph.length) return;
    const step = graph[currentIndex++];
    const { id, op, params } = step;
    try {
      const operation = functions[op];
      if (!operation) {
        console.warn(`[${id}] Unknown operation: ${op}`);
        return runNext();
      }

      const isAsync = operation.length > 4;
      if (isAsync) {
        operation(id, params, memory, functions, basePath, () => runNext());
      } else {
        operation(id, params, memory, functions, basePath);
        runNext();
      }
    } catch (err) {
      if (err.__aegisReturn) {
        memory.__return = err.value;
      } else {
        console.error(err);
      }
    }
  };
  runNext();
}

module.exports = { executeGraph };
