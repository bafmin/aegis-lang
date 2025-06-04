# 📈 Aegis: Planning and Development Roadmap

## 💡 Philosophy
Aegis is not just a programming language — it is a framework for agentic cognition. We treat graphs as executable reasoning structures.

- Memory is stateful and scoped
- Nodes represent operations or transformations
- Execution is declarative, not imperative
- Programs should be explainable by graph traversal

## 🔥 Phase 1: Core Runtime
✅ Build interpreter that loads and runs JSON-based graphs  
✅ Support minimal op set (compute, call, fn, return, watch)  
🔜 Extend to conditional logic and loop control  
🔜 Add deeper memory scoping and data streaming  

## 🧠 Phase 2: Language Spec
✅ Create MVL spec (Minimal Viable Language)  
🔜 Define agent-based composition (graphs invoking graphs)  
🔜 Formalize operation contract (input/output params)  
🔜 Create reference ops library

## 🛠 Phase 3: Tooling & DevX
🔜 Graph validation and linting  
🔜 Interactive debugger for graph execution  
🔜 Visualizer or GUI-based graph editor  

## 🌐 Phase 4: Ecosystem
🔜 Create ops registry for sharing and composing behaviors  
🔜 Add plug-in ops: file I/O, HTTP, math, storage, AI services  
🔜 Support DSLs compiled into Aegis graphs  
🔜 Extend to other runtimes (browser, Python, Rust)

## 🧪 Test Strategy
- Manual testing via `samples/verified`
- Memory snapshot validation
- Error output for malformed graphs
- Graph-level and op-level coverage

## 🎯 Design Goals
- Explicit memory control
- Composable operations
- Graph-first logic flow
- Debuggable and introspectable runtime

---
Aegis is open-ended. What it becomes is up to us.