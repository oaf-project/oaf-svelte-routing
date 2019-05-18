import {
  Action,
  createOafRouter,
  defaultSettings as oafRoutingDefaultSettings,
  RouterSettings,
} from "oaf-routing";

// tslint:disable-next-line: no-commented-code
// tslint:disable: no-expression-statement
// tslint:disable: interface-over-type-literal

export { RouterSettings } from "oaf-routing";

export type Location = {
  readonly hash: string;
  readonly key?: string;
};

export type HistoryEvent = {
  readonly location: Location;
  readonly action: Action;
};

export type History = {
  readonly location: Location;
  readonly listen: (listener: (event: HistoryEvent) => any) => () => void;
};

export const defaultSettings = {
  ...oafRoutingDefaultSettings,
};

export const wrapHistory = (
  history: History,
  settingsOverrides?: Partial<RouterSettings<Location>>,
): (() => void) => {
  const settings: RouterSettings<Location> = {
    ...defaultSettings,
    ...settingsOverrides,
  };

  const oafRouter = createOafRouter(settings, location => location.hash);

  const initialLocation = history.location;

  // HACK Allow DOM to be updated before we repair focus.
  setTimeout(() => {
    // The first page load won't trigger history.listen.
    oafRouter.handleFirstPageLoad(initialLocation);
  }, settings.renderTimeout);

  // tslint:disable-next-line: no-let
  let previousLocation = initialLocation;

  const unlisten = history.listen(event => {
    oafRouter.handleLocationWillChange(
      previousLocation.key,
      event.location.key,
      event.action,
    );

    // HACK Allow DOM to be updated before we repair focus.
    setTimeout(() => {
      oafRouter.handleLocationChanged(
        previousLocation,
        event.location,
        event.location.key,
        event.action,
      );
    }, settings.renderTimeout);

    previousLocation = event.location;
  });

  return () => {
    oafRouter.resetAutoScrollRestoration();
    unlisten();
  };
};
