/**
 * Build-time stand-in for `ajv` (esbuild `--alias:ajv=./src/shims/ajv.ts`).
 *
 * The MCP SDK imports its Ajv validator provider unconditionally but only uses
 * it for elicitation responses, which this server never requests; `createServer`
 * passes its own fail-closed `jsonSchemaValidator`. Aliasing keeps Ajv's runtime
 * code generator (the purity test forbids it) out of the bundle and makes
 * `dist/server.js` self-contained. Throwing (not a no-op) means a future SDK that constructs Ajv
 * elsewhere fails loudly at startup instead of silently degrading.
 */
export default class Ajv {
  constructor(..._args: unknown[]) {
    throw new Error("ajv is not bundled: ShopwareDevKnowledgeBase supplies its own jsonSchemaValidator");
  }
}
