import { html, render } from "lit-html";
import { State, createState } from "./state";

export type Context = Record<string, any>;

export type Setup<Props> = {
    template: (props: Props, context: Context) => ReturnType<typeof html>;
    setup: (context: Context) => Props;
};

export function component(config: Record<string, any> = {}) {
    class Component extends HTMLElement {
        $state: State<any> = createState({});
        __hooks: any[] = [];

        static get observedAttributes() {
            if (Array.isArray(config.attributes)) return config.attributes;
            return [];
        }

        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.watch(() => this.render());
            this.setState(config.setup(this));
        }

        get trigger() {
            return this.$state.trigger.bind(this);
        }

        get watch() {
            return this.$state.watch.bind(this);
        }

        get state() {
            return this.$state.state.bind(this)();
        }

        get setState() {
            return this.$state.setState.bind(this);
        }

        set state(value: any) {
            this.$state.setState(value);
        }

        render() {
            return render(config.template(this.state), this.shadowRoot);
        }

        connectedCallback() {
            this.render();
        }

        attributeChangedCallback(_attrName: any, _oldVal: any, _newVal: any) {
            this.render();
        }
    }

    return {
        register(tagName: string) {
            window.customElements.define(tagName, Component);
        }
    };
}

export function useState() {
    return createState({});
}
