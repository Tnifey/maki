import { render } from "lit-html";
import * as runtime from "./runtime";
import { type TwindObserver, sheet, styleObserver } from "./twind";
import type { Renderable } from "./lit-html";

export type TemplateFn<Attrs> = (attrs: Attrs) => Renderable;
export type MakiFactory<T> = ($: MakiComponent<T>) => TemplateFn<T>;
export type AnyMakiComponent = MakiComponent<Record<string, unknown>>;
export interface MakiComponent<T> extends HTMLElement {
    internals: ElementInternals;
    mutationObserver: MutationObserver;
    styleObserver: TwindObserver;
    template: TemplateFn<T>;
    render: () => ReturnType<typeof render>;
    attrs: T;
}

export function component<Attrs>(factory: MakiFactory<Attrs>) {
    return class MakiComponent<T = Attrs>
        extends HTMLElement
        implements MakiComponent<T>
    {
        internals: ElementInternals;
        template: TemplateFn<T>;
        mutationObserver: MutationObserver;
        styleObserver: TwindObserver;

        constructor() {
            super();
            this.attachShadow({
                mode: "open",
                slotAssignment: "named",
            });
            this.internals = this.attachInternals();
            runtime.setCurrentContext(this as AnyMakiComponent);
            this.template = factory(
                this as unknown as MakiComponent<Attrs>,
            ) as unknown as TemplateFn<T>;
            this.shadowRoot.adoptedStyleSheets = [sheet.target];
            this.mutationObserver = new MutationObserver(() => this.render());
        }

        get attrs() {
            return Array.from(this.attributes).reduce(
                (acc, attr) => {
                    acc[attr.name] = attr.value;
                    return acc;
                },
                {} as unknown as T,
            ) as T;
        }

        render() {
            return render(this.template(this.attrs), this.shadowRoot);
        }

        connectedCallback() {
            this.mutationObserver.observe(this, { attributes: true });
            this.styleObserver = styleObserver.observe(this.shadowRoot);
            this.render();
        }

        disconnectedCallback() {
            this.mutationObserver.disconnect();
            this.styleObserver.disconnect();
        }

        /**
         * Register as web component
         * @param tagname - Name of the web component
         */
        static as(tagname: string) {
            window.customElements.define(tagname, MakiComponent<Attrs>);
            return MakiComponent<Attrs>;
        }
    };
}
