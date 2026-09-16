import { PlannedSource } from "../planned.js";

export const PROJECT_PLANNED =
  "project-layer wiki not built yet (no project/index.md under the wiki root); read the repository directly.";

export function createProjectPlanned(): PlannedSource {
  return new PlannedSource("project", PROJECT_PLANNED);
}
