import { html } from 'lit-html';
import { component } from './maki';

component({
    template: (props) => {
        const { who, fuck, count } = props;
        return html`
            <h1>Hello, ${who}!</h1>
            <button type="button" @click=${fuck}>
                Increment ${count}
            </button>
        `;
    },
    setup: (ctx) => ({
        who: 'WHO',
        count: 0,
        fuck: () => ctx.setState({
            ...ctx.state,
            count: ctx.state.count + 1,
        }),
    }),
}).register('maki-test');
