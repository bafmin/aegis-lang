# 🛡️ Aegis Language

Aegis is an AI-native programming language designed for interpretable, composable execution by agents — not humans.

## 🧠 Manifesto

Aegis is not built for you. It’s built for what you’re building.

This language doesn't care how humans think about syntax, structure, or semantics. It is designed to be interpreted by intelligent agents, allowing them to reason about their actions, self-modify, test, and explain their logic — all without first translating human intent into brittle, outdated formats.

## 🚀 Core Concepts

- Graph-Based JSON Execution
- Modular, Introspective Ops (`op_fn`, `op_call`, `op_loop`, etc.)
- Scoped memory and context flow
- Built-in agent logic (future-facing)
- Zero syntax: no parsing, no ambiguity

## 📂 Samples

| Sample                     | Description                                  |
|----------------------------|----------------------------------------------|
| `basic_graph.json`         | Hello world compute and print                |
| `math_pipeline.json`       | Multi-step compute pipeline                  |
| `loop_count.json`          | Iterative counting with `op_loop`            |
| `return_function.json`     | Function with early return on null inputs    |
| `nested_function.json`     | Function calling another function            |
| `debug_tools.json`         | Shows `op_watch`, `op_debug`, and `op_break` |

## 📘 Specs

See [mvl_spec/spec-v1.md](./mvl_spec/spec-v1.md)
