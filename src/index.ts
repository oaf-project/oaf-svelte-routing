/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-return-void */
import {
  createOafRouter,
  defaultSettings as oafRoutingDefaultSettings,
  RouterSettings,
} from "oaf-routing";

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

export const wrapHistory = (
  history: History,
  settingsOverrides?: Partial<RouterSettings<Location>>,
): (() => void) => {
  const settings: RouterSettings<Location> = {
    ...defaultSettings,
    ...settingsOverrides,
  };

  const oafRouter = createOafRouter(settings, (location) => location.hash);

  const initialLocation = history.location;

  // HACK Allow DOM to be updated before we repair focus.
  setTimeout(() => {
    // The first page load won't trigger history.listen.
    oafRouter.handleFirstPageLoad(initialLocation);
  }, settings.renderTimeout);

  // eslint-disable-next-line functional/no-let
  let previousLocation = initialLocation;

  const unlisten = history.listen((event) => {
    oafRouter.handleLocationWillChange(
      previousLocation.key,
      event.location.key,
      event.action,
    );

    // HACK Allow DOM to be updated before we repair focus.
    const stablePreviousLocation = previousLocation;
    setTimeout(() => {
      oafRouter.handleLocationChanged(
        stablePreviousLocation,
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
