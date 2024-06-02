import { component, html, type Isotope, isotope, use } from "./main";
import { watch } from "./hooks/watch";

component(() => {
    return () => html`
        <div class="p-8">
            <app-counter></app-counter>
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
