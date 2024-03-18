import type { html, noChange, nothing, svg } from "lit-html";

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

export { html } from "lit-html";
