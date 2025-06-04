# 📘 Aegis Minimal Viable Language (MVL) – Spec v1

The Minimal Viable Language (MVL) defines the foundational operations supported by the Aegis interpreter. These operations are expressed in graph-structured JSON, and executed by `graphEngine.js`.

---

## ⚙️ Supported Operations

### ✅ `op_compute`

**Purpose**:  
Perform basic computation or assignment. Can assign constants or compute using `sum`, `subtract`, `multiply`, or `divide`.

**Params**:
- `inputs`: (optional) list of memory keys for operands
- `outputs`: (required) list with 1 output memory key
- `value`: (optional) direct constant to assign
- `compute`: (optional) string operation to perform — one of: `"sum"`, `"subtract"`, `"multiply"`, `"divide"`

**Examples**:

Assign constant:
```json
{
  "id": "node-1",
  "operation": "op_compute",
  "params": {
    "outputs": ["x"],
    "value": 10
  }
}
```

Compute sum:
```json
{
  "id": "node-2",
  "operation": "op_compute",
  "params": {
    "inputs": ["x", "y"],
    "outputs": ["sum"],
    "compute": "sum"
  }
}
```

---

### ✅ `op_watch`

**Purpose**:  
Log the value of a memory key to the console during execution.

**Params**:
- `inputs`: list of memory keys to watch

**Example**:
```json
{
  "id": "node-3",
  "operation": "op_watch",
  "params": {
    "inputs": ["sum"]
  }
}
```

---

## 🔧 Not Yet Implemented (Planned for MVL v2)

The following ops are defined in planning but not fully functional in the interpreter:

- `op_fn` – define a named function or reusable subgraph
- `op_call` – invoke a previously defined function
- `op_return` – return early from a function with a value
- `op_loop` – repeat a subgraph block a number of times
- `op_if` – conditional branching based on memory
- `op_debug`, `op_break` – developer introspection tools
- `op_agent`, `op_import` – advanced modular or scoped behavior

---

## 📁 Example Graph Reference

Sample graphs demonstrating MVL v1 are available in:

```
samples/verified/
├── basic_graph.json
├── math_pipeline.json
```

To run:
```bash
cd interpreter
node index.js ../samples/verified/basic_graph.json
```

---

## 🧠 Design Philosophy

- Every op is **self-contained** via `params`
- Graphs can be composed, nested, or shared between agents
- Memory is key-value and global (for now)
- Execution is linear, node-by-node

---

This spec evolves with the language. Contributions are welcome.
