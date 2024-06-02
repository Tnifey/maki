import { component, html, type Isotope, isotope, use, useRef } from "./main";
import { watch } from "./hooks/watch";
import { tw } from "twind";

component(() => {
    return () => html`
        <div class="p-8">
            <app-counter></app-counter>
            <app-menu></app-menu>
        </div>
    `;
}).as('app-root');

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
}).as('app-counter');

component(($) => {
    // get atom or isotope from parent as property
    // use hook is needed to subscribe to the atom or isotope
    // otherwise it will not re-render when the value changes
    const value = use(($ as unknown as { value: Isotope<number>; }).value);
    return () => html`<code class="px-4 py-2">${value()}</code>`;
}).as('app-counter-number');

component(($) => {
    const isOpened = use(($ as unknown as { isOpened: Isotope<boolean>; }).isOpened);
    const dialog = useRef<HTMLDivElement>();
    const button = useRef<HTMLDivElement>();

    watch(() => {
        console.log('dialog value', dialog.value());
    }, [dialog.value]);

    return () => html`
        <div class="relative inline-flex">
            <button ${button()} type="button" @click=${() => isOpened((v) => !v)} class="py-2 px-4">
                ${isOpened() ? "close" : "open"}
            </button>
            <ul ${dialog()} class=${tw(`absolute top-[100%] left-0 w-[200px] bg-black text-white rounded-sm ${isOpened() ? 'block' : 'hidden'}`)}>
                <li>
                    <button type="button" class="py-3 px-4 block w-full text-left">
                        Profile
                    </button>
                </li>
                <li>
                    <button type="button" class="py-3 px-4 block w-full text-left">
                        Settings
                    </button>
                </li>
                <li>
                    <button type="button" class="py-3 px-4 block w-full text-left">
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    `;
}).as('app-menu');
