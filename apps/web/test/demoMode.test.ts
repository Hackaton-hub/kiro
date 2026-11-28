// @vitest-environment happy-dom
import fc from "fast-check";
import { afterEach, describe, expect, it, vi } from "vitest";

const DEMO_NAMES = ["demo-healthy-lib", "demo-ghost-lib", "demo-possessed-lib"];

afterEach(() => {
  vi.unstubAllGlobals();
});

// Feature: s8-autopsy-page, Property 1: Demo mode never calls fetch
describe("Property 1: Demo mode never calls fetch", () => {
  it("submitting any string never calls fetch", async () => {
    const fetchStub = vi.fn();
    vi.stubGlobal("fetch", fetchStub);
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.getElementById("app") as HTMLElement;
    await import("../src/main");
    const input = root.querySelector("input") as HTMLInputElement;
    const form = root.querySelector("form") as HTMLFormElement;

    const submit = (value: string): void => {
      input.value = value;
      form.dispatchEvent(new Event("submit", { cancelable: true }));
      const status = root.querySelector('[role="status"]')?.textContent ?? "";
      if (!DEMO_NAMES.includes(value)) {
        expect(status).toContain("No demo autopsy for this package");
      }
    };

    fc.assert(fc.property(fc.string(), submit), { numRuns: 100 });
    fc.assert(fc.property(fc.string({ unit: "binary" }), submit), { numRuns: 100 });
    expect(fetchStub).toHaveBeenCalledTimes(0);
  });
});
