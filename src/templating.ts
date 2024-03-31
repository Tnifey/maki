import type { html, noChange, nothing, svg } from "lit-html";
import { create, cssomSheet } from "twind";
import { createObserver } from "twind/observe";

export type RenderableValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | Node
    | ReturnType<typeof html>
    | ReturnType<typeof svg>
    | typeof nothing
    | typeof noChange;
export type Renderable = RenderableValue | RenderableValue[];

export { html, svg } from "lit-html";

export { type Configuration } from "twind";
export { type TwindObserver } from "twind/observe";

export const sheet = cssomSheet({ target: new CSSStyleSheet() });
export const twind = create({ sheet, mode: "silent" });

export const tw = twind.tw;
export const styleObserver = createObserver(twind);
