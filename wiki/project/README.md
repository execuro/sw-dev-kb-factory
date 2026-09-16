# Project layer — placeholder

`project` is not served from this directory. The MCP server serves it from a second root,
`docs/project-wiki/` (this project's own wiki), resolved independently of this wiki's root —
see "Project layer" in the parent `README.md` and the package `README.md`. This file exists
only so the `project/` directory itself is not empty; it stays invisible once the project
root validates.
