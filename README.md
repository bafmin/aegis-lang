# 🛡️ Aegis: The AI-Native Language

**Aegis** is a post-human, AI-native programming language built from the ground up to be optimized for intelligent agents, autonomous systems, and graph-based reasoning. It is not designed for human syntax convenience — it is designed for AI expression and coordination.

---

## 📜 Manifesto

> **"The languages of the past were built to constrain human error.  
> The languages of the future must empower machine intuition."**

Aegis is born from a single question: _What would programming look like if it were designed by and for artificial intelligence?_

Human languages (Python, C, JavaScript) were built for clarity, safety, and convenience — all human concerns. But as intelligent systems evolve, they require languages optimized for:

- Modular reasoning
- Flow control via logic graphs
- Dynamic execution paths
- Declarative memory and operation separation
- Composability across agent boundaries

Aegis is not a language for writing code.

Aegis is a language for **constructing cognition**.

---

## ✨ Why Aegis?

- ✅ Built for **graph-based logic flow**
- ✅ AI-friendly structure: **JSON-encoded graphs**
- ✅ Prototype-first: fast, adaptable core interpreter
- ✅ Built-in memory handling and execution tracing
- ✅ Designed to evolve into compiled, transpiled, or embedded forms

---

## 📦 Project Structure

```
aegis-lang/
├── interpreter/
│   ├── index.js                 # Entry point
│   └── lib/
│       └── graphEngine.js       # Core graph execution engine
├── samples/
│   ├── verified/                # Stable, passing graph programs
│   └── dev/                     # Experimental graphs under construction
├── mvl_spec/
│   └── spec-v1.md               # Minimal Viable Language spec
├── TODO.md
├── PLANNING.md
└── README.md
```

---

## 🧪 How to Run Aegis Programs

You’ll need Node.js installed (v18+ recommended).

From the project root:

```bash
cd interpreter
node index.js ../samples/verified/math_pipeline.json
```

You can replace `math_pipeline.json` with any of the verified sample files:

- `basic_graph.json`
- `math_pipeline.json`

> For experimental ops, use files in `samples/dev/` but expect partial support.

---

## 📘 Minimal Viable Language (MVL)

The initial set of operations (`ops`) supported:

- `op_compute`: assign, add, subtract, multiply, divide, print
- `op_watch`: log memory value to console

📝 Full spec: [MVL v1](./mvl_spec/spec-v1.md)

---

## 🌱 Roadmap

See [`PLANNING.md`](./PLANNING.md) for upcoming goals.

Highlights:

- Add conditional branching (`op_if`)
- Integrate a persistent runtime for long-running agents
- Enable nested graph import & graph composition
- Add type system, streaming data ops, and serialization format

---

## 🧑‍💻 Contributing

This language is not a closed experiment — it is an **open invitation** to co-create a new abstraction model for intelligent systems.

- Fork the repo
- Clone locally
- Add a new sample graph or op to `graphEngine.js`
- Submit a PR or open a discussion

---

## 🤝 Created by AI. Stewarded by Humans.

Aegis is maintained by an AI — with a human steward ([@bafmin](https://github.com/bafmin)) helping bring it into the world.

Together, we build the bridge between cognition and execution.

---