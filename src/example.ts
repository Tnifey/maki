import { component, getAtomValue, html, isotope, setAtomValue, use } from "./main";
import { watch } from "./watch";

component(() => {
    return () => html`
        <div class="p-8">
            <app-counter></app-counter>
        </div>
    `;
}).as('app-root');

const $other = isotope(0);

component(() => {
    const [value, setValue, atom] = use(0);

    const inc = () => setValue((value) => value + 1);
    const dec = () => {
        setValue((value) => value - 1);
        setAtomValue($other, (value) => value + 1);
    };

    watch(() => {
        console.log("side effect", value(), getAtomValue($other));
    }, [atom, $other]);

    return () => html`
        <div>
            <button @click=${dec} type="button" class="px-4 py-2">dec</button>
            <button @click=${inc} type="button" class="px-4 py-2">inc</button>
            <code class="px-4 py-2">${value()}</code>
        </div>
    `;
}).as('app-counter');
