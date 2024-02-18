import { html } from 'lit-html';
import { atom, component } from './maki';

const shared = atom(0);

component(($) => {
    const [count, setCount] = $.ume(shared);

    function inc() {
        setCount((c) => c + 1);
    }

    function dec() {
        setCount((c) => c - 1);
    }

    return () => html`
        <button type="button" @click=${dec}>Dec</button>
        <button type="button" @click=${inc}>Inc</button>

        <pre>${count()}</pre>
        <maki-tatsu></maki-tatsu>
    `;
}).register('maki-test');

component<{ kai: string; }>(($) => {
    const [ume, setUme] = $.ume(shared);
    return () => {
        return html`
            <button type="button" @click=${() => setUme((c) => c - 2)}>
                - in child
            </button>
            <button type="button" @click=${() => setUme((c) => c + 2)}>
                + in child
            </button>
            <pre>ume: ${ume()}</pre>
        `;
    };
})
    .register('maki-tatsu');