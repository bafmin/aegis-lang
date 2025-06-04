# Aegis Language Specification (v1.0)

_Last Updated: 2025-06-04_

## Overview

Aegis is a graph-defined execution language built to be interpretable by AI agents and machines. It is not optimized for human readability, but for consistent behavior, modularity, and symbolic reasoning.

---

## Core Concepts

- **Node:** A unit of logic with an `op` code
- **Graph:** A list of interconnected nodes
- **Memory:** Shared dictionary of variable names and values
- **Execution:** Top-down traversal of node list, respecting branching/loop logic

---

## 🧮 Operations

### `op_compute`
Performs basic operations:
- `const`, `add`, `multiply`, `gt`, `lt`, `eq`, `print`

### `op_control`
Conditional logic using:
```json
{
  "op": "op_control",
  "params": {
    "operation": "if",
    "true_branch": [...],
    "false_branch": [...]
  }
}
```

### `op_loop`
Iteration control:
```json
{
  "op": "op_loop",
  "params": {
    "from": 1,
    "to": 5,
    "var": "i",
    "body": [...]
  }
}
```

### `op_agent`
Scoped memory execution unit:
```json
{
  "op": "op_agent",
  "params": {
    "scope": ["goal"],
    "steps": ["init-goal", "print-goal"]
  }
}
```

### `op_import`
Loads and executes an external graph file:
```json
{
  "op": "op_import",
  "params": {
    "file": "./samples/subgraph/task.json"
  }
}
```

---

## 🧠 Memory Model

- Global memory is passed into the interpreter
- `op_loop` and `op_agent` can define scoped memory
- Memory values are overwritten by node outputs
- Agents merge scoped values back into global memory after execution

---

## ⏭ Coming Soon

- `op_fn`, `op_call` for reusable routines
- Parallel execution
- Graph schemas for validation
- Execution metrics/logging

