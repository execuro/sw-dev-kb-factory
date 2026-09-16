/** Build-time stand-in for `ajv-formats`; see `./ajv.ts`. */
export default function addFormats(..._args: unknown[]): never {
  throw new Error("ajv-formats is not bundled: ShopwareDevKnowledgeBase supplies its own jsonSchemaValidator");
}
