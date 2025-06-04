
const fs = require('fs');

// Simple node handlers
const handlers = {
    op_compute: (node, memory) => {
        const inputs = node.params?.inputs || [];
        const outputs = node.params?.outputs || [];
        const value = node.params?.value;
        const compute = node.params?.compute;

        let result;

        if (compute === 'sum') {
            result = inputs.reduce((sum, key) => sum + (memory[key] || 0), 0);
        } else if (value !== undefined) {
            result = value;
        }

        if (outputs.length > 0) {
            memory[outputs[0]] = result;
        }

        console.log(`[${node.id}] Operation: ${node.operation}`);
    },

    op_watch: (node, memory) => {
        const input = node.params?.inputs?.[0];
        const value = memory[input];
        console.log(`[${node.id}] WATCH ${input} -> ${value}`);
    }
};

function executeGraph(graph) {
    const memory = {};

    for (const node of graph) {
        const handler = handlers[node.operation];
        if (handler) {
            try {
                handler(node, memory);
            } catch (e) {
                console.log(`[${node.id}] Error: ${e.message}`);
            }
        } else {
            console.log(`Unknown operation: ${node.operation}`);
        }
    }

    console.log("\nFinal memory state:", memory);
}

function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error("Usage: node index.js <graph-file>");
        process.exit(1);
    }

    try {
        const raw = fs.readFileSync(filePath);
        const parsed = JSON.parse(raw);
        const graph = parsed.graph;

        if (!Array.isArray(graph)) {
            throw new Error("graph is not iterable");
        }

        executeGraph(graph);
    } catch (e) {
        console.error("Failed to load or parse the graph file:", e.message);
    }
}

main();
