# Aegis MVL Spec v1

## Purpose
Defines the Minimal Viable Language (MVL) for agent-native program construction.

## Components
- `nodes`: Top-level array of operations
- `id`: Unique string ID per node
- `op`: Operation code (e.g. `op_compute`, `op_fn`, `op_call`)
- `params`: Operation parameters
- `inputs`, `outputs`: Declared connections

## Supported Operations
- `op_compute`
- `op_fn`, `op_call`
- `op_loop`
- `op_return`
- `op_watch`, `op_debug`, `op_break`
