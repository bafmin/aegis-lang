# Aegis Language Specification (v1.0)

## Core Ops (Updated)

### `op_fn` — Define Function

Defines a reusable named function with scoped memory.

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

### `op_call` — Invoke Function

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

Behavior:
- Maps args to inputs
- Executes body in isolated scope
- Returns mapped output into global memory
