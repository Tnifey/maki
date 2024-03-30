import { component, html, use } from "./main";
import { watch } from "./watch";

component(() => {
    return () => html`
        <div class="p-8">
            <app-counter></app-counter>
        </div>
    `;
}).as('app-root');

component(() => {
    const value = use(0, (x) => Math.max(0, Math.min(10, x)));
    const other = use(0, (x) => Math.max(0, Math.min(10, x)));

    const inc = () => value((value) => value + 1);
    const dec = () => value((value) => value - 1);

    const inco = () => other((value) => value + 1);
    const deco = () => other((value) => value - 1);

    const unsub = watch(() => {
        console.log('watch', value(), other());
        unsub(); // unsubscribe after first change
    }, [value, other]);

    return () => html`
        <div>
            <button @click=${dec} type="button" class="px-4 py-2">dec</button>
            <button @click=${inc} type="button" class="px-4 py-2">inc</button>
            <code class="px-4 py-2">${value()}</code>
        </div>
        <div>
            <button @click=${deco} type="button" class="px-4 py-2">dec</button>
            <button @click=${inco} type="button" class="px-4 py-2">inc</button>
            <code class="px-4 py-2">${other()}</code>
        </div>
    `;
}).as('app-counter');
