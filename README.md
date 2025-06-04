# Aegis — The AI-Native Execution Language

**Aegis** is a graph-based, declarative execution environment designed for **machine-native reasoning**, not human syntax. It's modular, interpretable, and built to support agent behavior, symbolic memory, and autonomous computation.

---

## 🚀 Features

- Graph-based execution engine (JSON-defined)
- Built-in op codes: compute, control, agent, import, loop
- Modular execution via `op_fn` and `op_call`
- Scoped agents with local memory
- CLI runner: `node index.js <graphfile.json>`

---

## 🧪 Sample Usage

```bash
node index.js samples/function_addition.json
```

---

## 📦 Function Example

```json
{
  "id": "define-add",
  "op": "op_fn",
  "params": {
    "name": "add_two_numbers",
    "inputs": ["a", "b"],
    "outputs": ["sum"],
    "body": ["add"]
  }
}
```

```json
{
  "id": "use-add",
  "op": "op_call",
  "params": {
    "fn": "add_two_numbers",
    "args": [10, 32],
    "results": ["final_result"]
  }
}
```
