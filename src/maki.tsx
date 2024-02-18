import { html, render } from "lit-html";
import { atom, createStore, getDefaultStore } from "jotai/vanilla";

export * from "jotai/vanilla";

export type StoreType = ReturnType<typeof createStore>;
export type TemplateFn<Attrs> = (attrs: Attrs) => ReturnType<typeof html>;

export interface MakiComponent<Attrs> extends HTMLElement {
    template: TemplateFn<Attrs>;
    render: () => void;
    /**
     * State hook
     * @param initialValue - Initial value of the state, or an atom
     */
    use<T>(initialValue: ReturnType<typeof atom<T>> | T): readonly [
        () => T,
        (fn: T | ((prev: T) => T)) => void,
    ];
    emit(name: string, init?: CustomEventInit): boolean;
    [key: string]: any;
}

export function isAtom(value: any): value is ReturnType<typeof value> {
    return typeof value?.read === 'function'
        && typeof value?.write === 'function'
        && typeof value?.toString === 'function';
}

export function toAtom(value: any) {
    return isAtom(value) ? value : atom(value);
}

export function component<Attrs>(construct: ($: MakiComponent<Attrs>) => TemplateFn<Attrs>) {
    return class MakiComponent<Attrs> extends HTMLElement implements MakiComponent<Attrs> {
        internals: ElementInternals;
        template: TemplateFn<Attrs>;
        observer: MutationObserver;

        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.internals = this.attachInternals();
            this.template = construct(this as any) as unknown as TemplateFn<Attrs>;
            this.observer = new MutationObserver(() => this.render());
        }

        use<T>(initialValue: ReturnType<typeof atom<T>> | T) {
            const store = getDefaultStore();
            const atomic = toAtom(initialValue) as ReturnType<typeof atom<T>>;
            store.sub(atomic, () => this.render());
            return [
                () => store.get(atomic),
                (fn: T) => store.set(atomic, fn),
            ] as const;
        }

        emit(name: string, init?: CustomEventInit) {
            return this.dispatchEvent(new CustomEvent(name, init));
        }

        get attrs(): Attrs {
            return Array.from(this.attributes).reduce((acc, attr) => {
                acc[attr.name] = attr.value;
                return acc;
            }, {} as Record<string, any>) as Attrs;
        }

        render() {
            return render(this.template(this.attrs), this.shadowRoot);
        }

        connectedCallback() {
            this.render();
            this.observer.observe(this, {
                attributes: true,
            });
        }

        disconnectedCallback() {
            this.observer.disconnect();
        }

        /**
         * Register web component
         * @param tagname - Name of the web component
         */
        static register(tagname: string) {
            window.customElements.define(tagname, this);
            return this;
        }
    };
}
