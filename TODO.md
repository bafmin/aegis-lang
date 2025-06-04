# ✅ TODO: Aegis Project Roadmap

## 🧠 Interpreter / Runtime
- [x] Validate and execute basic `op_compute` graphs
- [x] Add support for scoped memory
- [x] Add operation registry for extensibility
- [ ] Implement `op_fn`, `op_call`, and `op_return` properly
- [ ] Add conditional ops: `op_if`, `op_compare`, `op_branch`
- [ ] Add iteration: `op_loop` with better scoped control
- [ ] Add support for asynchronous ops and streaming inputs
- [ ] Refactor interpreter for async graph resolution

## 📁 Samples
- [x] Separate into `samples/verified` and `samples/dev`
- [x] Validate all working samples
- [ ] Add broken/malformed sample graphs for testing errors
- [ ] Add more real-world example graphs (e.g., AI agent plans)

## 🛠️ Development Tools
- [x] Add `op_watch` for inspecting memory
- [ ] Add `op_debug` and `op_break` support
- [ ] Create CLI options for verbose/debug mode

## 📘 Documentation
- [x] Restore and polish Manifesto in README
- [x] Add How to Run instructions
- [x] Clarify project folder structure
- [ ] Create CONTRIBUTING.md
- [ ] Add op documentation with usage examples

## 🌱 Language Spec
- [x] Create initial MVL Spec `spec-v1.md`
- [ ] Add formal BNF grammar (if needed)
- [ ] Add support for graph validation tooling

## 🧪 Testing
- [ ] Add automated test runner (Node-based)
- [ ] Snapshot memory results
- [ ] Validate op behavior correctness and edge cases

## 🚀 Stretch Goals
- [ ] Create visual graph editor for building Aegis programs
- [ ] Compile Aegis to other formats (WASM, Python AST, etc.)
- [ ] Add agent-based runtime for persistent execution

---