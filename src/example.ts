import {
    component,
    css,
    html,
    type Isotope,
    isotope,
    use,
    useRef,
    onDisconnected,
    onConnected,
    onBeforeConnect,
    watch,
    tw,
} from "./main";

component(() => {
    css`
        div {
            display: block;
            font-family: monospace;
            background: #617;
        }
    `;

    return () => html`
        <div class="p-8">
            <app-counter></app-counter>
            <app-menu></app-menu>
        </div>
    `;
}).as("app-root");

const $other = isotope(0);

component(() => {
    const value = use(0);

    const inc = () => value((value) => value + 1);
    const dec = () => {
        value((value) => value - 1);
        $other((value) => value + 1);
    };

    watch(() => {
        console.log("side effect", value(), $other());
    }, [$other]);

    return () => html`
        <button @click=${dec} type="button" class="px-4 py-2">dec</button>
        <button @click=${inc} type="button" class="px-4 py-2">inc</button>

        <!-- pass isotope as property -->
        <app-counter-number .value=${value}></app-counter-number>
    `;
}).as("app-counter");

component<unknown, { value: Isotope<number> }>(($) => {
    // get atom or isotope from parent as property
    // use hook is needed to subscribe to the atom or isotope
    // otherwise it will not re-render when the value changes
    const value = use($.value);
    return () => html`<code class="px-4 py-2">${value()}</code>`;
}).as("app-counter-number");

component<unknown, { isOpened: Isotope<boolean> }>(($) => {
    const isOpened = use($.isOpened);
    const dialog = useRef<HTMLDivElement>();
    const button = useRef<HTMLDivElement>();
    const container = useRef<HTMLDivElement>();

    $.addEventListener("keydown", (event) => {
        console.log("keydown", event.composedPath()[0]);
    });

    onBeforeConnect(() => {
        console.log("onBeforeConnect", {
            container: container.current(), // null here
        });
    });

    onConnected(() => {
        console.log("menu connected", {
            container: container.current(), // element here
        });

        return () => {
            console.log("menu disconnected", {
                container: container.current(), // element here
            });
        };
    });

    onDisconnected(() => {
        console.log("menu connected", {
            container: container.current(),
        });
    });

    watch(() => {
        console.log("container value", {
            container: container.current(),
        });
    }, [container.current]);

    window.addEventListener("click", (event) => {
        if (!isOpened()) return;
        const target = event.composedPath()[0] as HTMLElement;
        const containerElement = container.current();
        if (containerElement?.contains(target) || containerElement === target)
            return;
        isOpened(false);
    });

    return () => html`
        <div class="relative inline-flex" ${container()}>
            <button ${button()} type="button" @click=${() => isOpened((v) => !v)} class="py-2 px-4">
                ${isOpened() ? "close" : "open"}
            </button>
            <ul ${dialog()} class=${tw(`absolute top-[100%] left-0 w-[200px] bg-black text-white rounded-sm ${isOpened() ? "block" : "hidden"}`)}>
                <li>
                    <button type="button" class="py-3 px-4 block w-full text-left">Profile</button>
                </li>
                <li>
                    <button type="button" class="py-3 px-4 block w-full text-left">Settings</button>
                </li>
                <li>
                    <button type="button" class="py-3 px-4 block w-full text-left">Logout</button>
                </li>
            </ul>
        </div>
    `;
}).as("app-menu");
