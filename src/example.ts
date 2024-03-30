import { component, html, use } from "./main";

component(() => {
    return () => html`
        <div class="p-8">
            <app-counter></app-counter>
        </div>
    `;
}).as('app-root');

component(() => {
    const value = use(0, (x) => Math.max(0, Math.min(2, x)));

    const inc = () => value((value) => value + 1);
    const dec = () => value((value) => value - 1);

    return () => html`
        <button @click=${dec} type="button" class="px-4 py-2">dec</button>
        <button @click=${inc} type="button" class="px-4 py-2">inc</button>
        <code class="px-4 py-2">${value()}</code>
    `;
}).as('app-counter');
