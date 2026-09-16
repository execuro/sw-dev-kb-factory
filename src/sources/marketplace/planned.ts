import { PlannedSource } from "../planned.js";

export const MARKETPLACE_PLANNED =
  "marketplace-layer wiki not built yet (no marketplace/index.md under the wiki root).";

export function createMarketplacePlanned(): PlannedSource {
  return new PlannedSource("marketplace", MARKETPLACE_PLANNED);
}
