import type { VerdictView } from "./verdictView";

export type PageState =
  | { kind: "empty" }
  | { kind: "loading" }
  | { kind: "unknown"; name: string }
  | { kind: "error"; message: string }
  | { kind: "verdict"; view: VerdictView };

export interface Handlers {
  onSubmit(name: string): void;
  onExample(name: string): void;
  onSuggestion(name: string): void;
  onRetry(): void;
}

export const EXAMPLES = ["demo-healthy-lib", "demo-ghost-lib", "demo-possessed-lib"] as const;

// Every text goes through textContent so verdict strings can never inject markup.
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const b = el("button", label, className);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}

interface Page {
  status: HTMLElement;
  // Updated on every render call so listeners always use the latest handlers.
  handlers: Handlers;
}

const pages = new WeakMap<HTMLElement, Page>();

function renderForm(page: Page): HTMLElement {
  const form = el("form", undefined, "summon");
  const label = el("label", "Summon a package");
  label.htmlFor = "package-name";
  const input = el("input", undefined, "mono");
  input.id = "package-name";
  input.name = "package";
  input.type = "text";
  input.autocomplete = "off";
  input.spellcheck = false;
  const submit = el("button", "Summon", "fill-pumpkin");
  submit.type = "submit";
  form.append(label, input, submit);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    page.handlers.onSubmit(input.value);
  });
  return form;
}

function renderExamples(page: Page): HTMLElement {
  const wrap = el("div", undefined, "examples");
  for (const name of EXAMPLES) {
    wrap.append(button(name, "fill-pumpkin mono", () => page.handlers.onExample(name)));
  }
  return wrap;
}

function renderCard(view: VerdictView, page: Page): HTMLElement {
  const card = el("article", undefined, "card");
  const head = el("div", undefined, "card-head");
  head.append(
    el("span", `${view.icon} ${view.actionWord}`, `badge fill-${view.actionColor}`),
    el("span", view.diagnosisTag, `tag fill-${view.diagnosisColor}`),
  );
  const reasons = el("ul", undefined, "reasons");
  for (const reason of view.reasons) reasons.append(el("li", reason));
  card.append(
    head,
    el("p", `${view.packageName} (${view.ecosystem})`, "mono"),
    el("h2", view.headline, `text-${view.actionColor}`),
    reasons,
  );
  if (view.suggestionText !== undefined && view.suggestionName !== undefined) {
    const name = view.suggestionName;
    card.append(
      button(view.suggestionText, "fill-pumpkin suggestion", () => page.handlers.onSuggestion(name)),
    );
  }
  return card;
}

function stateContent(state: PageState, page: Page): HTMLElement {
  switch (state.kind) {
    case "empty":
      return el("p", "Pick an example below, or type a package name.");
    case "loading":
      return el("p", "Summoning…");
    case "unknown":
      return el("p", "No demo autopsy for this package");
    case "error": {
      const alert = el("div", undefined, "error");
      alert.setAttribute("role", "alert");
      alert.append(
        el("p", state.message),
        button("Retry", "fill-pumpkin", () => page.handlers.onRetry()),
      );
      return alert;
    }
    case "verdict":
      return renderCard(state.view, page);
  }
}

function buildPage(root: HTMLElement, handlers: Handlers): Page {
  const status = el("section", undefined, "state");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const page: Page = { status, handlers };
  const main = el("main");
  main.append(el("h1", "Phantom Imports"), renderForm(page), renderExamples(page), status);
  root.replaceChildren(main);
  pages.set(root, page);
  return page;
}

// The only module that touches the DOM. The skeleton is built once, so the
// input keeps its value and focus and the live region exists before it changes.
// Later calls only replace the content of the status section.
export function render(root: HTMLElement, state: PageState, handlers: Handlers): void {
  const page = pages.get(root) ?? buildPage(root, handlers);
  page.handlers = handlers;
  page.status.replaceChildren(stateContent(state, page));
}
