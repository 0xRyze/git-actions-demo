import { process as process$1 } from "./shim/process.js";

if (typeof window !== "undefined") {
  window.global = globalThis;
  if (!window.process && typeof process === "undefined") {
    Object.assign(window, { process: process$1 });
  }
}
