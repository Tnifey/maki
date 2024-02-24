import { create, cssomSheet } from "twind";
import { atom, getAtomValue, setAtomValue } from "./atoms";
import { runtime } from "./runtime";

export type TW = ReturnType<typeof create>['tw'];
export type TWConfig = Omit<Parameters<typeof create>[0], 'sheet'>;

export const tailwindConfiguration = atom<TWConfig>({});

export function setupTailwind(config: TWConfig) {
    setAtomValue(tailwindConfiguration, config);
    return tailwindConfiguration;
}

export function createTailwindTw() {
    const sheet = cssomSheet({ target: new CSSStyleSheet() });
    const { tw } = create({ sheet, ...getAtomValue(tailwindConfiguration) });
    return [tw, sheet.target] as const;
}

export function tw(...args: Parameters<ReturnType<typeof create>['tw']>) {
    return runtime.getCurrentContext()?.tw(...args);
}
