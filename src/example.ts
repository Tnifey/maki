import { atom, component, getAtomValue, html, setAtomValue, use } from "./main";
import { watch } from "./watch";

component(() => {
    return () => html`
        <div class="p-8">
            <app-counter></app-counter>
        </div>
    `;
}).as('app-root');

const $other = atom(0);

component(() => {
    const value = use(0);

    const inc = () => value((value) => value + 1);
    const dec = () => {
        value((value) => value - 1);
        setAtomValue($other, () => value() + 1);
    };

    watch(() => {
        console.log("side effect", value(), getAtomValue($other));
    }, [value, $other]);

    return () => html`
        <div>
            <button @click=${dec} type="button" class="px-4 py-2">dec</button>
            <button @click=${inc} type="button" class="px-4 py-2">inc</button>
            <code class="px-4 py-2">${value()}</code>
        </div>
    `;
}).as('app-counter');
