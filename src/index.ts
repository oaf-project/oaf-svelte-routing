import {
  Action,
  createOafRouter,
  defaultSettings as oafRoutingDefaultSettings,
  RouterSettings,
} from "oaf-routing";

// tslint:disable-next-line: no-commented-code
// tslint:disable: no-expression-statement
// tslint:disable: object-literal-sort-keys
// tslint:disable: interface-over-type-literal

export { RouterSettings } from "oaf-routing";

export type Location = {
  readonly hash: string;
};

export type HistoryEvent = {
  readonly location: Location;
  readonly action: Action;
};

export const defaultSettings = {
  ...oafRoutingDefaultSettings,
  // TODO support pop page state restoration.
  restorePageStateOnPop: false,
  // We're not restoring page state ourselves so leave this enabled.
  disableAutoScrollRestoration: false,
};

export const wrapHistory = (
  history: any,
  settings: RouterSettings<Location>,
) => {
  // tslint:disable-next-line: no-let
  let previousLocation = history.location;
  const oafRouter = createOafRouter(settings, location => location.hash);

  oafRouter.handleFirstPageLoad(history.location);

  const unlisten = history.listen((event: HistoryEvent) => {
    oafRouter.handleLocationChanged(
      previousLocation,
      event.location,
      undefined,
      event.action,
    );
    previousLocation = location;
  });

  return () => {
    oafRouter.resetAutoScrollRestoration();
    unlisten();
  };
};
