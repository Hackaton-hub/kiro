// @vitest-environment happy-dom
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { lookup } from "../src/demoStore";
import { render, type Handlers, type PageState } from "../src/render";
import { verdictView } from "../src/verdictView";

const handlers: Handlers = {
  onSubmit: () => {},
  onExample: () => {},
  onSuggestion: () => {},
  onRetry: () => {},
};

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
}

function mount(): HTMLElement {
  document.body.innerHTML = '<div id="app"></div>';
  return document.getElementById("app") as HTMLElement;
}

function verdictState(name: string): PageState {
  const result = lookup(name);
  if (result.kind !== "found") throw new Error(`fixture ${name} not found`);
  return { kind: "verdict", view: verdictView(result.verdict) };
}

const NON_VERDICT_STATES: PageState[] = [
  { kind: "empty" },
  { kind: "loading" },
  { kind: "unknown", name: "x" },
  { kind: "error", message: "Something broke." },
];

describe("states without a verdict (7.4, 7.5)", () => {
  it.each(NON_VERDICT_STATES)("$kind shows no ALLOW, no LIVING and no green", (state) => {
    const root = mount();
    render(root, state, handlers);
    expect(root.textContent).not.toContain("ALLOW");
    expect(root.textContent).not.toContain("LIVING");
    expect(root.innerHTML).not.toContain("ectoplasm");
  });

  it("unknown shows the message and the three examples (7.3)", () => {
    const root = mount();
    render(root, { kind: "unknown", name: "x" }, handlers);
    expect(root.textContent).toContain("No demo autopsy for this package");
    expect(root.querySelectorAll(".examples button")).toHaveLength(3);
  });

  it("error has an alert and a Retry button (7.4)", () => {
    const onRetry = vi.fn();
    const root = mount();
    render(root, { kind: "error", message: "Boom" }, { ...handlers, onRetry });
    expect(root.querySelector('[role="alert"]')?.textContent).toContain("Boom");
    const retry = [...root.querySelectorAll("button")].find((b) => b.textContent === "Retry");
    expect(retry).toBeDefined();
    retry?.click();
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe("verdict card (3.1, 3.2, 3.3)", () => {
  it("shows action word, icon, diagnosis and reasons", () => {
    const root = mount();
    render(root, verdictState("demo-ghost-lib"), handlers);
    expect(root.querySelector(".badge")?.textContent).toBe("✗ BLOCK");
    expect(root.querySelector(".tag")?.textContent).toBe("GHOST");
    expect(root.querySelectorAll(".reasons li").length).toBeGreaterThanOrEqual(1);
  });

  it("uses textContent only: markup in a reason stays text", () => {
    const root = mount();
    const state = verdictState("demo-ghost-lib");
    if (state.kind !== "verdict") throw new Error("unreachable");
    render(root, { kind: "verdict", view: { ...state.view, reasons: ["<img src=x>"] } }, handlers);
    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector(".reasons li")?.textContent).toBe("<img src=x>");
  });
});

describe("skeleton is built once", () => {
  it("keeps the typed value and the live region across renders", () => {
    const root = mount();
    render(root, { kind: "empty" }, handlers);
    const input = root.querySelector("input") as HTMLInputElement;
    const status = root.querySelector('[role="status"]');
    input.value = "typed";
    render(root, { kind: "loading" }, handlers);
    expect(root.querySelector("input")).toBe(input);
    expect(input.value).toBe("typed");
    expect(root.querySelector('[role="status"]')).toBe(status);
    expect(status?.getAttribute("aria-live")).toBe("polite");
  });
});

describe("page wiring (3.5)", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("clicking the suggestion loads the healthy verdict", async () => {
    const root = mount();
    await import("../src/main");
    const ghost = [...root.querySelectorAll(".examples button")].find(
      (b) => b.textContent === "demo-ghost-lib",
    ) as HTMLButtonElement;
    ghost.click();
    const suggestion = root.querySelector(".suggestion") as HTMLButtonElement;
    expect(suggestion.textContent).toBe("Did you mean demo-healthy-lib?");
    suggestion.click();
    expect(root.querySelector(".badge")?.textContent).toBe("✓ ALLOW");
    expect(root.querySelector(".tag")?.textContent).toBe("LIVING");
  });
});

describe("static files (3.12)", () => {
  it("styles.css has no remote URL and no @import", () => {
    const css = read("../src/styles.css");
    expect(css).not.toMatch(/https?:\/\//);
    expect(css).not.toContain("@import");
  });

  it("index.html has lang=en and no remote URL", () => {
    const html = read("../index.html");
    expect(html).toMatch(/<html[^>]*\blang="en"/);
    expect(html).not.toMatch(/https?:\/\//);
  });
});
