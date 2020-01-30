import {
  createOafRouter,
  defaultSettings as oafRoutingDefaultSettings,
  RouterSettings,
} from "oaf-routing";

// tslint:disable-next-line: no-commented-code
// tslint:disable: no-expression-statement
// tslint:disable: interface-over-type-literal

export { RouterSettings } from "oaf-routing";

export {
  Action,
  History,
  HistoryEvent,
  Location,
} from "svelte-routing/src/history";

import { History, Location } from "svelte-routing/src/history";

export const defaultSettings = {
  ...oafRoutingDefaultSettings,
};

// HACK we need a way to track where focus and scroll were left on the first loaded page
// but we won't have an entry in history for this initial page, so we just make up a key.
const orInitialKey = (key: string | undefined): string =>
  key !== undefined ? key : "initial";

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
      orInitialKey(previousLocation.key),
      orInitialKey(event.location.key),
      event.action,
    );

    // HACK Allow DOM to be updated before we repair focus.
    const stablePreviousLocation = previousLocation;
    setTimeout(() => {
      oafRouter.handleLocationChanged(
        stablePreviousLocation,
        event.location,
        orInitialKey(event.location.key),
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
