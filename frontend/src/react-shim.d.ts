/**
 * Fallback type declarations when node_modules is not resolved (e.g. missing or IDE path).
 * Resolves: "react" / "react/jsx-runtime" not found, "JSX.IntrinsicElements" does not exist,
 * and @mui/material/* module not found.
 */

declare module "react" {
  export type ComponentType<P = unknown> = (props: P) => JSX.Element | null;
  export interface Context<T> {
    Provider: unknown;
    Consumer: unknown;
    displayName?: string;
  }
  export function createContext<T>(initialValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useCallback<T extends (...args: unknown[]) => unknown>(fn: T, deps: unknown[]): T;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export const Fragment: unknown;
  const React: unknown;
  export default React;
}

declare module "react/jsx-runtime" {
  export function jsx(type: unknown, props: unknown, key?: string): unknown;
  export function jsxs(type: unknown, props: unknown, key?: string): unknown;
  export const Fragment: unknown;
}

declare module "@mui/material/CircularProgress" {
  const M: import("react").ComponentType<Record<string, unknown>>;
  export default M;
}

declare module "@mui/material/Tooltip" {
  const M: import("react").ComponentType<Record<string, unknown>>;
  export default M;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: Record<string, unknown>;
  }
}
