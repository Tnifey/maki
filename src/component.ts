import { render } from "lit-html";
import { setCurrentContext } from "./runtime";
import { type TwindObserver, type Renderable, sheet, styleObserver } from "./templating";

export type TemplateFn<Attrs> = (attrs: Attrs) => Renderable;
export type MakiFactory<T, P> = ($: MakiComponent<T> & P) => TemplateFn<T>;
export type AnyMakiComponent = MakiComponent<Record<string, unknown>>;
export interface MakiComponent<T> extends HTMLElement {
    template: TemplateFn<T>;
    render: () => ReturnType<typeof render>;
    attrs: T;
    internals: ElementInternals;
    mutationObserver: MutationObserver;
    styleObserver: TwindObserver;
    cachedAttrs: T | null;
}

export function component<Attrs, Props = Record<string, unknown>>(factory: MakiFactory<Attrs, Props>) {
    return class MakiComponent<T = Attrs>
        extends HTMLElement
        implements MakiComponent<T>
    {
        internals: ElementInternals;
        template: TemplateFn<T>;
        mutationObserver: MutationObserver;
        styleObserver: TwindObserver;
        cachedAttrs: T = null;

        constructor() {
            super();
            this.style.display = "contents";
            setCurrentContext(this as unknown as MakiComponent<Attrs>);
            this.attachShadow({
                mode: "open",
                slotAssignment: "named",
            });
            this.internals = this.attachInternals();
            this.template = factory(this as unknown as (MakiComponent<Attrs> & Props)) as unknown as TemplateFn<T>;
            this.shadowRoot.adoptedStyleSheets = [sheet.target];
            this.mutationObserver = new MutationObserver(() => this.render());
            setCurrentContext(null);
        }

        get attrs(): T {
            if (this.cachedAttrs) return this.cachedAttrs;
            this.cachedAttrs = Array.from(this.attributes).reduce(
                (acc, attr) => {
                    acc[attr.name] = attr.value;
                    return acc;
                },
                {} as T,
            );
            return this.cachedAttrs;
        }

        render() {
            this.cachedAttrs = null;
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

        adoptedCallback() {
            this.render();
        }

        /**
         * Register as web component, you can register the class only once
         * @param tagname - Tagname of the web component
         */
        static as<Tagname extends string>(tagname: Tagname, options?: ElementDefinitionOptions) {
            window.customElements.define(tagname, MakiComponent<Attrs>, options);
            return MakiComponent<Attrs>;
        }
    };
}
