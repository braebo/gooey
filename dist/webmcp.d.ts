import { Gooey } from "./Gooey.js";

//#region src/webmcp.d.ts

/**
 * The subset of a WebMCP tool declaration that gooey produces.
 *
 * WebMCP is a
 * {@link https://webmachinelearning.github.io/webmcp/|W3C Community Group draft} and ships behind
 * a Chrome origin trial, so the DOM lib has no types for it yet.  These declarations are
 * deliberately minimal -- just enough to call `registerTool` -- and are not a global augmentation,
 * so they can't conflict with the real thing once browsers ship it.
 */
interface WebMCPTool {
  /** A unique, stable identifier the agent calls. */
  name: string;
  /** A one-line, human-readable explanation of what calling the tool does. */
  description: string;
  /** A JSON Schema describing the tool's argument object. */
  inputSchema: WebMCPInputSchema;
  /** Runs the tool and returns a string result for the agent. */
  execute: (args: Record<string, unknown>) => string | Promise<string>;
}
/**
 * A JSON Schema object describing a {@link WebMCPTool}'s arguments.
 */
interface WebMCPInputSchema {
  type: 'object';
  properties: Record<string, Record<string, unknown>>;
  required?: string[];
  additionalProperties?: boolean;
}
/**
 * The `document.modelContext` surface gooey uses.  The real object has more on it
 * (`getTools`, `executeTool`), but registration is the only half a page needs.
 */
interface ModelContext {
  registerTool(tool: WebMCPTool, options?: {
    signal?: AbortSignal;
  }): unknown;
  unregisterTool?(name: string): unknown;
}
interface WebMCPOptions {
  /**
   * The namespace prepended to every tool name.  Tools are named
   * `<prefix>.<folder-path>.<input-title>`, slugified.
   * @defaultValue The gooey's title, slugified.
   */
  prefix?: string;
  /**
   * The model context to register with.  Provide one to target a polyfill, an iframe's document,
   * or a test double.
   * @defaultValue `document.modelContext`
   */
  modelContext?: ModelContext;
  /**
   * Whether to expose gooey's builtin settings folder (theme, presets, ui).
   * @default false
   */
  includeSettings?: boolean;
  /**
   * Whether to expose a single `<prefix>.state` tool that reads every control at once.  Agents
   * that can read the whole panel in one call don't have to probe it control by control.
   * @default true
   */
  stateTool?: boolean;
  /**
   * Whether to unregister the tools when the gooey is disposed.  Wraps {@link Gooey.dispose}.
   * @default true
   */
  disposeWithGooey?: boolean;
}
/**
 * The return value of {@link registerWebMCP}.  Always a real object -- in a browser without
 * WebMCP, {@link WebMCPHandle.enabled|`enabled`} is `false` and everything else is inert.
 */
interface WebMCPHandle {
  /** Whether a model context was found and tools were registered. */
  readonly enabled: boolean;
  /** The names of the registered tools, in registration order. */
  readonly tools: readonly string[];
  /** Re-walks the gooey and re-registers its tools.  Call after adding or removing inputs. */
  refresh(): void;
  /** Unregisters every tool.  Idempotent. */
  dispose(): void;
}
/**
 * Exposes a {@link Gooey}'s controls to in-browser AI agents as
 * {@link https://webmachinelearning.github.io/webmcp/|WebMCP} tools -- one setter per input, plus
 * a `state` tool that reads the whole panel in a single call.  Setters go through each input's own
 * `set`, so bindings, `onChange` handlers, and undo history behave exactly as they do for a click.
 *
 * In a browser without `document.modelContext` this registers nothing and returns a disabled
 * handle.  It never throws, and nothing imports it, so it costs nothing until you call it.
 *
 * @example
 * ```ts
 * import { Gooey, registerWebMCP } from 'gooey'
 *
 * const gooey = new Gooey('Scene')
 * gooey.addNumber('speed', 1, { min: 0, max: 10 })
 *
 * const agentDoor = registerWebMCP(gooey)
 * // → tools: scene.state, scene.speed
 * ```
 */
declare function registerWebMCP(gooey: Gooey, options?: WebMCPOptions): WebMCPHandle;
//#endregion
export { ModelContext, WebMCPHandle, WebMCPInputSchema, WebMCPOptions, WebMCPTool, registerWebMCP };
//# sourceMappingURL=webmcp.d.ts.map