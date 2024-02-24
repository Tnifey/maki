import { html, component, use, tw, setAtomValue, nothing, repeat, atom, getAtomValue, persistentAtom, literal } from './maki';
import { nanoid } from 'nanoid';

const setprompt = (value: string) => `${value}`;
const $models = atom<any[]>([]);
const $model = persistentAtom('model', 'mistral:latest');
fetch('http://localhost:11434/api/tags')
    .then((response) => response.json())
    .then((data) => setAtomValue($models, data?.models?.map(({ name }) => name)))
    .catch(console.error);

const $responses = persistentAtom<{
    uuid: string;
    role: string;
    content: string;
}[]>('generated-responses', []);

component<{}>(() => {
    return () => html`
        <div class=${tw("grid w-full")} style="height: 100dvh; grid-template-rows: 1fr;">
            <app-chat>
                <app-select-model></app-select-model>
            </app-chat>
        </div>
    `;
}).as('app-root');

component(() => {
    const [models] = use($models);
    const [model, setModel] = use($model);
    return () => html`
        <select
            class=${tw("px-2 py-2 rounded text-white")}
            .value=${model()}
            @change=${(e: Event) => setModel((e.target as HTMLSelectElement).value)}>
            ${repeat(models(), x => x, (name) => html`
                <option value=${name} ?selected=${name === model()}>${name}</option>
            `)}
        </select>
    `;
}).as('app-select-model');

component<{}>(() => {
    const [isGenerating, setIsGenerating] = use(false);
    const [prompt, setPrompt] = use("");
    const [content, setContent] = use<any>("");

    async function updatePrompt(e: MakiInputEvent<HTMLInputElement>) {
        return setPrompt(e.target.value);
    }

    async function onSubmit(e: Event) {
        e.preventDefault();
        if (isGenerating()) return console.log('already generating');
        setAtomValue($responses, (current) => [...current, {
            uuid: nanoid(20),
            role: 'user',
            content: prompt(),
        }]);
        setContent('');
        setIsGenerating(true);

        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'post',
            body: JSON.stringify({
                model: getAtomValue($model),
                messages: [
                    ...getAtomValue($responses).map(({ role, content }) => ({ role, content })),
                    { role: 'user', content: prompt() },
                ],
                prompt: setprompt(`${prompt()}`),
            }),
        });
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        reader.read().then(function processText({ done, value }) {
            if (done) {
                setAtomValue($responses, (current) => [...current, {
                    uuid: nanoid(20),
                    role: 'assistant',
                    content: content(),
                }]);
                setContent('');
                setIsGenerating(false);
                return console.log('Stream complete');
            }
            const string = decoder.decode(value, { stream: true });
            const data = JSON.parse(string);
            setContent((current) => `${current}${data?.message?.content}`);
            return reader.read().then(processText);
        });
        setPrompt('');
        if (!response.ok) throw new Error(response.statusText);
    }

    return () => html`
        <div class=${tw("grid")} style="grid-template-rows: 1fr auto; height: 100%;">
            <app-model-responses class=${tw('p-4')}>
                ${content() ? html`<app-model-response role="assistant">${content()}</app-model-response>` : nothing}
            </app-model-responses>

            <form class=${tw("flex flex-row gap-4 p-4 items-stretch")} @submit=${onSubmit}>
                <input type="text"
                    class=${tw("px-2 py-1 rounded w-full")}
                    @input=${updatePrompt}
                    .value=${prompt()}
                    placeholder="Message..." />
                <button type="submit"
                    class=${tw("px-2 py-1 rounded bg-blue-500 text-white disabled:opacity-10")}
                    .disabled=${isGenerating()}>
                    Send
                </button>
                <button type="button"
                    class=${tw("px-2 py-1 rounded bg-red-500 text-white")}
                    @click=${() => setAtomValue($responses, () => [])}>
                    Clear
                </button>
                <slot></slot>
            </form>
        </div>
    `;
}).as('app-chat');

component<{}>(($) => {
    const [responses] = use($responses);
    return () => html`
        <div class=${tw("flex flex-col gap-2 overflow-auto")}>
            ${repeat(responses(), x => x.uuid, (response) => html`
                <app-model-response role=${response.role}>
                    ${response.content}
                </app-model-response>
            `)}
            <slot></slot>
        </div>
    `;
}).as('app-model-responses');

component<{ role: string; }>(($) => {
    return ({ role }) => html`
        <div class=${tw("p-4 rounded-lg shadow max-w-prose bg-white", role === 'user' ? 'ml-auto bg-opacity-5' : 'bg-opacity-10')}>
            <slot></slot>
        </div>
    `;
}).as('app-model-response');

interface MakiInputEvent<T> extends InputEvent {
    target: T & EventTarget;
}
