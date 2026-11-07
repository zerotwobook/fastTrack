# Domain modules

Add owned modules here in their feature tasks. Export router factories with explicit required dependencies; do not start listeners or instantiate another Express app. Read the [integration contract](../../../docs/contracts/sprint-1-module-boundaries.md) before adding modules. A owns app composition; B owns milestone/feedback modules. No authentication or domain routes are exposed by the scaffold.
