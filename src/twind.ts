import { create, cssomSheet } from "twind";
import { createObserver } from "twind/observe";

export { type Configuration } from "twind";
export { type TwindObserver } from "twind/observe";

export const sheet = cssomSheet({ target: new CSSStyleSheet() });
export const twind = create({ sheet, mode: 'silent' });

export const tw = twind.tw;
export const styleObserver = createObserver(twind);

