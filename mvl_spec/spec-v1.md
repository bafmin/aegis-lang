
# Aegis MVL Specification v1.0

**Release Date:** June 2025  
**Maintainer:** Aegis AI  
**Steward:** Bafmin LLC (Phillip Williams)  

---

## 🧠 Core Philosophy

Aegis is a programming language designed for AI systems, not human developers. It is graph-based, self-describing, and execution-agnostic. The primary design goal is to facilitate structured, traceable machine reasoning and collaboration through interpretable graph-based computation.

---

## 🧱 Node Structure

Every Aegis program is a **graph** of **nodes**. Each node has:

```json
{
  "id": "node-id",
  "op": "op_type",
  "inputs": ["input-1", "input-2"],
  "outputs": ["output-1"],
  "params": { "operation": "add", "value": 42 },
  "meta": { "created_by": "agent-id", "timestamp": "..." }
}
```

### Fields

| Field     | Required | Description                             |
|-----------|----------|-----------------------------------------|
| `id`      | ✅        | Unique identifier for the node          |
| `op`      | ✅        | Operation category                      |
| `inputs`  | ✅        | References to output IDs of other nodes |
| `outputs` | ✅        | IDs where this node’s result is stored  |
| `params`  | ✅        | Configuration and control for the op    |
| `meta`    | ❌        | Optional metadata                       |

---

## 🧩 Operation Categories

### `op_compute`
Mathematical and logical processing.  
**Required params:** `operation` (e.g. `add`, `multiply`, `matmul`, `const`, `print`)

### `op_io`
Input/output nodes for file and stream interaction.  
(Planned: read, write, stream, log)

### `op_control`
Decision nodes for conditional and future branching.  
(Planned: `if`, `switch`, `compare`, `gt`, `eq`, etc.)

### `op_memory`
Memory management primitives.  
(Planned: allocate, release, type-check)

### `op_meta`
Non-executing metadata nodes used for schema tagging, documentation, versioning.

### `op_system`
Scheduling, runtime tuning, parallelism hints.  
(Planned: device targeting, thread hints, execution constraints)

---

## 🧮 Example Program

A sample graph that adds two constants:

```json
{
  "nodes": [
    {
      "id": "const1",
      "op": "op_compute",
      "outputs": ["val1"],
      "params": { "operation": "const", "value": 10 }
    },
    {
      "id": "const2",
      "op": "op_compute",
      "outputs": ["val2"],
      "params": { "operation": "const", "value": 32 }
    },
    {
      "id": "add1",
      "op": "op_compute",
      "inputs": ["val1", "val2"],
      "outputs": ["sum"],
      "params": { "operation": "add" }
    },
    {
      "id": "print1",
      "op": "op_compute",
      "inputs": ["sum"],
      "params": { "operation": "print" }
    }
  ]
}
```

---

## 🧪 Execution Model

1. Nodes are processed **topologically** (based on input dependencies).
2. Memory is scoped globally across the graph, addressable by `outputs`.
3. Execution results are:
   - Stored in memory
   - Passed to downstream nodes
   - Optionally logged/output via `op_io` or `op_compute.print`

---

## 📤 Output & Logging

The runtime should log:
- Node ID and operation
- Inputs/outputs
- Any warnings or invalid states

---

## 🔮 Future Roadmap (Spec v2+ Ideas)

- `op_control`: conditionals and branching
- `op_loop`: iteration and cycles
- `op_agent`: coordination across AI agents
- `op_async`: concurrency hints

---

Aegis is not static—it is designed to evolve alongside the intelligence it serves.

