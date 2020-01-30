declare module "svelte-routing/src/history" {
  export type Action = "PUSH" | "POP" | "REPLACE";

  export type Location = {
    readonly hash: string;
    // svelte-routing ensures this has a value:
    // `key: (source.history.state && source.history.state.key) || "initial"`
    readonly key: string;
  };

  export type HistoryEvent = {
    readonly location: Location;
    readonly action: Action;
  };

  export type History = {
    readonly location: Location;
    readonly navigate: (to: string) => void;
    readonly listen: (listener: (event: HistoryEvent) => any) => () => void;
  };

  export const globalHistory: History;
}
