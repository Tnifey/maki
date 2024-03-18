import { component, html } from "./main";

component(() => {
    return () => html`
        Hello, World!
    `;
}).as('app-root');
