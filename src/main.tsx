import { html } from 'lit-html';
import { component } from './maki';

component(($) => {
    const [count, setCount] = $.use(0);

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
        <maki-tatsu @inc=${inc} @dec=${dec} kai=${count()}></maki-tatsu>
    `;
}).register('maki-test');

component<{ kai: string; }>(($) => {
    return ({ kai }) => {
        return html`
            <button type="button" @click=${() => $.emit('dec')}>
                - in child
            </button>
            <button type="button" @click=${() => $.emit('inc')}>
                + in child
            </button>

            <pre>${kai}</pre>
        `;
    };
})
    .register('maki-tatsu');