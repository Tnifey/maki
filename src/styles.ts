import { create, cssomSheet } from "twind";

export type TW = ReturnType<typeof create>['tw'];
export type TWConfig = Omit<Parameters<typeof create>[0], 'sheet'>;

export const sheet = cssomSheet({ target: new CSSStyleSheet() });
export const twind = create({ sheet, mode: 'silent' });

export const tw = twind.tw;
