import { component, html } from "./main";

const AppRoot = component(() => {
    return () => html`
        Hello, World!
    `;
}).as('app-root');
