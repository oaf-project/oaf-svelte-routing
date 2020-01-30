// tslint:disable:no-expression-statement no-object-mutation no-duplicate-string no-empty

import { globalHistory as history } from "svelte-routing/src/history";
import { wrapHistory } from ".";

// HACK: wait for history wrapper to update DOM.
const waitForDomUpdate = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve));

beforeEach(() => {
  // Clear previous test's DOM.
  window.document.body.innerHTML = "";
  window.document.title = "";
});

describe("oaf-react-router", () => {
  test("doesn't throw when wrapping and unwrapping history", () => {
    const unwrap = wrapHistory(history);
    unwrap();
  });

  test("sets the document title", async () => {
    const unwrap = wrapHistory(history, {
      setPageTitle: true,
      documentTitle: () => "test title",
    });

    expect(document.title).toBe("");

    history.navigate("/");

    await waitForDomUpdate();

    expect(document.title).toBe("test title");

    unwrap();
  });

  test("does not set the document title when setPageTitle is false", async () => {
    const unwrap = wrapHistory(history, {
      setPageTitle: false,
      documentTitle: () => "test title",
    });

    expect(document.title).toBe("");

    history.navigate("/");

    await waitForDomUpdate();

    expect(document.title).toBe("");

    unwrap();
  });

  test("leaves focus alone when repairFocus is false", async () => {
    const unwrap = wrapHistory(history, { repairFocus: false });

    const main = document.createElement("main");
    const mainH1 = document.createElement("h1");
    main.append(mainH1);
    const randomButton = document.createElement("button");
    main.append(randomButton);
    document.body.append(main);

    randomButton.focus();
    expect(document.activeElement).toBe(randomButton);

    history.navigate("/");

    await waitForDomUpdate();

    expect(document.activeElement).toBe(randomButton);

    unwrap();
  });

  test("moves focus to body when primary focus target cannot be focused", async () => {
    const unwrap = wrapHistory(history);

    const main = document.createElement("main");
    const mainH1 = document.createElement("h1");
    mainH1.focus = () => {};
    main.append(mainH1);
    const randomButton = document.createElement("button");
    main.append(randomButton);
    document.body.append(main);

    randomButton.focus();
    expect(document.activeElement).toBe(randomButton);

    history.navigate("/");

    await waitForDomUpdate();

    expect([document.body, document.documentElement]).toContain(
      document.activeElement,
    );

    unwrap();
  });

  test("moves focus to the primary focus target", async () => {
    const unwrap = wrapHistory(history);

    const main = document.createElement("main");
    const mainH1 = document.createElement("h1");
    main.append(mainH1);
    document.body.append(main);

    expect([document.body, document.documentElement]).toContain(
      document.activeElement,
    );

    history.navigate("/");

    await waitForDomUpdate();

    expect(document.activeElement).toBe(mainH1);

    unwrap();
  });
});
