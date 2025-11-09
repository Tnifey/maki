import { getCurrentContext } from "../runtime";

export function css(strings: TemplateStringsArray, ...values: unknown[]) {
    const context = getCurrentContext();
    if (!context) throw new Error("Cannot call use() outside of a component");
    const css = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
    context.applyStyles(css.trim());
    return css.trim();
}
