# Aegis — The AI-Native Execution Language

**Aegis** is a graph-based, declarative execution environment designed for **machine-native reasoning**, not human syntax. It's modular, interpretable, and built from the ground up to support agent behavior, symbolic memory, and autonomous computation.

> ✅ First commit: May 2025  
> 🌐 Spec version: 1.0  
> 📅 Last updated: 2025-06-04

---

## 🚀 Features

- Graph-based execution engine (JSON-defined)
- Built-in op codes: compute, control, agent, import
- Memory-driven node logic
- Modular execution via `op_import`
- Scoped agents with local memory
- Loops, branching, and conditionals
- CLI runner: `node index.js <graphfile.json>`

---

## 📦 Usage

```bash
npm install
node index.js samples/agent_basic.json
```

---

## 🧱 Sample Graph Snippet

```json
{
  "id": "loop-example",
  "op": "op_loop",
  "params": {
    "from": 1,
    "to": 5,
    "var": "i",
    "body": ["print-i"]
  }
}
```

---

## 📁 Repo Structure

- `interpreter/` — Core execution engine
- `samples/` — Sample graph JSON files
- `spec/` — Language specification
- `TODO.md` — Work in progress roadmap
- `PLANNING.md` — Long-term goals + structure

---
Aegis is backed by [Bafmin LLC](https://github.com/bafmin) and stewarted by Phillip Williams.
