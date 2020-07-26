[![Build Status](https://travis-ci.org/oaf-project/oaf-svelte-routing.svg?branch=master)](https://travis-ci.org/oaf-project/oaf-svelte-routing)
[![Known Vulnerabilities](https://snyk.io/test/github/oaf-project/oaf-svelte-routing/badge.svg?targetFile=package.json)](https://snyk.io/test/github/oaf-project/oaf-svelte-routing?targetFile=package.json)
[![npm](https://img.shields.io/npm/v/oaf-svelte-routing.svg)](https://www.npmjs.com/package/oaf-svelte-routing)

[![dependencies Status](https://david-dm.org/oaf-project/oaf-svelte-routing/status.svg)](https://david-dm.org/oaf-project/oaf-svelte-routing)
[![devDependencies Status](https://david-dm.org/oaf-project/oaf-svelte-routing/dev-status.svg)](https://david-dm.org/oaf-project/oaf-svelte-routing?type=dev)
[![peerDependencies Status](https://david-dm.org/oaf-project/oaf-svelte-routing/peer-status.svg)](https://david-dm.org/oaf-project/oaf-svelte-routing?type=peer)

# Oaf Svelte Routing
An accessible wrapper for [Svelte Routing](https://github.com/EmilTholin/svelte-routing).

Documentation at https://oaf-project.github.io/oaf-svelte-routing/

## Features

* Reset scroll and focus after PUSH and REPLACE navigation
* Restore scroll and focus after POP navigation
* Set the page title after navigation
* Announce navigation to users of screen readers
* Hash fragment support

In lieu of more details, see [Oaf React Router](https://github.com/oaf-project/oaf-react-router/blob/master/README.md#features) for now. The features are basically the same.

## Installation

```sh
# yarn
yarn add oaf-svelte-routing

# npm
npm install oaf-svelte-routing
```

## Basic Usage

`main.js`:

```diff
import App from "./App.svelte";
+ import { globalHistory as history } from "svelte-routing/src/history";
+ import { wrapHistory } from "oaf-svelte-routing";

+ wrapHistory(history);

new App({
  target: document.getElementById("app"),
  hydrate: true
});

```

## Advanced Usage

```javascript
const settings = {
  announcementsDivId: "announcements",
  primaryFocusTarget: "main h1, [role=main] h1",
  // This assumes you're setting the document title via some other means.
  // If you're not, you should return a unique and descriptive page title for each page
  // from this function and set `setPageTitle` to true.
  documentTitle: (location) => document.title,
  // BYO localization
  navigationMessage: (title, location) => `Navigated to ${title}.`,
  shouldHandleAction: (previousLocation, nextLocation) => true,
  announcePageNavigation: true,
  setPageTitle: false,
  handleHashFragment: true,
  // Set this to true for smooth scrolling.
  // For browser compatibility you might want iamdustan's smoothscroll polyfill https://github.com/iamdustan/smoothscroll
  smoothScroll: false,
};

wrapHistory(history, settings);
```

### A note on focus outlines
You may see focus outlines around your `h1` elements (or elsewhere, per `primaryFocusTarget`) when using Oaf Svelte Routing.

You might be tempted to remove these focus outlines with something like the following:
```css
[tabindex="-1"]:focus {
  outline: 0 !important;
}
```

Don't do this! Focus outlines are important for accessibility. See for example:

* https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-visible.html
* https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/F78
* http://www.outlinenone.com/
* Although there is some debate: https://github.com/w3c/wcag/issues/1001

Note that [Bootstrap 4 unfortunately removes these focus outlines](https://github.com/twbs/bootstrap/issues/28425). If you use Bootstrap, you can restore them with [Oaf Bootstrap 4](https://github.com/oaf-project/oaf-bootstrap-4).

All that said, if you absolutely _must_ remove focus outlines (stubborn client, stubborn boss, stubborn designer, whatever), consider using the [`:focus-visible` polyfill](https://github.com/WICG/focus-visible) so focus outlines are only hidden from mouse users, _not_ keyboard users.

## See also
* The coversation at https://github.com/EmilTholin/svelte-routing/issues/25
* [Oaf Routing](https://github.com/oaf-project/oaf-routing)
* [Oaf Side Effects](https://github.com/oaf-project/oaf-side-effects)
