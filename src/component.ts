import { render } from "lit-html";
import { setCurrentContext } from "./runtime";
import { type TwindObserver, type Renderable, sheet, styleObserver } from "./templating";

export type TemplateFn<Attrs> = (attrs: Attrs) => Renderable;
export type MakiFactory<T, P> = ($: MakiComponent<T> & P) => TemplateFn<T>;
export type AnyMakiComponent = MakiComponent<Record<string, unknown>>;
export type LifecycleFn = () => ((() => void) | void);
export interface MakiComponent<T> extends HTMLElement {
    template: TemplateFn<T>;
    render: () => ReturnType<typeof render>;
    attrs: T;
    internals: ElementInternals;
    mutationObserver: MutationObserver;
    styleObserver: TwindObserver;
    cachedAttrs: T | null;
    onBeforeConnect: LifecycleFn[];
    onConnected: LifecycleFn[];
    onDisconnected: LifecycleFn[];
    applyStyles: (css: string) => HTMLStyleElement;
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
        onBeforeConnect = [];
        onDisconnected = [];
        onConnected = [];

        constructor() {
            super();
            this.style.display = "contents";
            setCurrentContext(this as unknown as AnyMakiComponent);
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
            for (const fn of this.onBeforeConnect) {
                if (typeof fn === "function") {
                    const cleanup = fn();
                    if (typeof cleanup === "function") {
                        this.onDisconnected.push(cleanup);
                    }
                }
            }
            this.render();
            for (const fn of this.onConnected) {
                if (typeof fn === "function") {
                    const cleanup = fn();
                    if (typeof cleanup === "function") {
                        this.onDisconnected.push(cleanup);
                    }
                }
            }
        }

        disconnectedCallback() {
            this.mutationObserver.disconnect();
            this.styleObserver.disconnect();
            for (const fn of this.onDisconnected) {
                if (typeof fn === "function") fn();
            }
        }

        adoptedCallback() {
            this.render();
        }

        applyStyles(css: string) {
            const style = document.createElement('style');
            style.textContent = css;
            this.shadowRoot.prepend(style);
            return style;
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
