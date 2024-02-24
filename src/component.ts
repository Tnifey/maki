import { html, render } from "lit-html";
import { TW } from "twind";
import { runtime } from "./runtime";
import { createTailwindTw } from "./styles";

export type TemplateFn<Attrs> = (attrs: Attrs) => ReturnType<typeof html>;
export type MakiFactory<T> = ($: MakiComponent<T>) => TemplateFn<T>;

export interface MakiComponent<T> extends HTMLElement {
    internals: ElementInternals;
    observer: MutationObserver;
    template: TemplateFn<T>;
    render: () => ReturnType<typeof render>;
    attrs: T;
    tw: TW;
    [key: string]: any;
}

export function component<Attrs>(factory: MakiFactory<Attrs>) {
    const [tw, sheet] = createTailwindTw();
    return class MakiComponent<T = Attrs> extends HTMLElement implements MakiComponent<T> {
        internals: ElementInternals;
        template: TemplateFn<T>;
        observer: MutationObserver;
        tw: TW = tw;

        constructor() {
            super();
            this.attachShadow({
                mode: "open",
                slotAssignment: "named",
            });
            this.internals = this.attachInternals();
            runtime.setCurrentContext(this as any);
            this.template = factory(this as any) as unknown as TemplateFn<T>;
            this.shadowRoot.adoptedStyleSheets = [sheet];
            this.observer = new MutationObserver(() => this.render());
        }

        get attrs() {
            return Array.from(this.attributes).reduce((acc, attr) => {
                acc[attr.name] = attr.value;
                return acc;
            }, {} as Record<string, any>) as T;
        }

        render() {
            return render(this.template(this.attrs), this.shadowRoot);
        }

        connectedCallback() {
            this.render();
            this.observer.observe(this, { attributes: true });
        }

        disconnectedCallback() {
            this.observer.disconnect();
        }

        /**
         * Register as web component
         * @param tagname - Name of the web component
         */
        static as(tagname: string) {
            window.customElements.define(tagname, this);
            return this;
        }
    };
}
