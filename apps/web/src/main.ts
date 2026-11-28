import "./styles.css";
import { lookup } from "./demoStore";
import { render, type Handlers, type PageState } from "./render";
import { verdictView } from "./verdictView";

const root = document.getElementById("app");
if (!root) throw new Error("Missing #app mount point");

let state: PageState = { kind: "empty" };
let lastName: string | undefined;

function show(next: PageState): void {
  state = next;
  render(root as HTMLElement, state, handlers);
}

function resolve(name: string): PageState {
  const result = lookup(name);
  switch (result.kind) {
    case "found":
      return { kind: "verdict", view: verdictView(result.verdict) };
    case "unknown":
      return { kind: "unknown", name };
    case "invalid":
      return { kind: "error", message: "This autopsy data is not a valid verdict." };
  }
}

// The lookup is synchronous in demo mode. The loading state is kept so the same
// path works when an async online mode arrives.
function submit(name: string): void {
  lastName = name;
  try {
    show({ kind: "loading" });
    show(resolve(name));
  } catch {
    show({ kind: "error", message: "Something went wrong while summoning this package." });
  }
}

const handlers: Handlers = {
  onSubmit: submit,
  onExample: submit,
  onSuggestion: submit,
  onRetry: () => {
    if (lastName === undefined) show({ kind: "empty" });
    else submit(lastName);
  },
};

show(state);
