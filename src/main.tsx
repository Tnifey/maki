import { html } from 'lit-html';
import { atom, component } from './maki';

const shared = atom<any[]>([]);

component(($) => {
    const atomic = atom([]);
    const [list, setList] = $.use(atomic);

    function add() {
        setList((c) => [...c, c.length]);
    }

    return () => html`
        <button type="button" @click=${add}>Add</button>
        <button type="button" @click=${() => setList([])}>Reset</button>
        <pre>${JSON.stringify(list())}</pre>
    `;
}).register('maki-tatsu');
