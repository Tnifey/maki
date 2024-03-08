## Write it yourself

A simple JAVASCRIPT FRAMEWORK library written in TYPESCRIPT for creating WEB COMPONENTS with hooks.
With twind for styles, jotai for state and lit-html for rendering under the hood.

If you want to use it, you should probably write it yourself. It's not that hard.
It is like 10 lines of code gzipped. Or fork it and do not create PRs or issues.
> It works for me.

## Example

```ts
import { html, component, use, atom } from 'maki';

// global state variable
const $global = atom(0);

// define a component
component(
    // this function is called when the component is created
    ($ /* this is a current htmlelement */) => {
    // local state variable
    const [count, setCount] = use(0);
    // global state variable
    const [someGlobal, setSomeGlobal] = use($global);

    function increment(event) {
        setCount(count() + 1)
    }

    // this called when the component is rendered
    return ($argsObject /* this.args */) => html`
        <h1>${count}</h1>
        <button onclick=${increment}>Increment</button>
        <pre>count:  ${
            JSON.stringify(count(), null, 2)
        }</pre>
        <pre>global: ${
            JSON.stringify(someGlobal(), null, 2)
        }</pre>
    `;
}).as('do-not-use-this-component');
```

## Usage

```html
<do-not-use-this-component></do-not-use-this-component>
```

## API?

### `use` - use atom or state
must be called inside a component function.

```ts
const [state, setState] = use(0);

// or atom

const $state = atom(0);
const [state, setState] = use($state);
```

### `atom` - see jotai/vanilla
```ts
import { atom } from 'maki';
// or import { atom } from 'jotai/vanilla';
const $state = atom(0);
```

## Hooks "Hooks"
Hooks

throws an error if called outside of a component function
just like react

### `useEmit` - use event emitter for current component
```ts
import { useEmit } from 'maki';

component(($) => {
    // create that emmiter
    const emit = useEmit();
    // emit event on init
    emit('event-name', 'event-data');

    // in template return a button that emits an event on click
    return () => html`<button onclick=${() => emit('event-name', 'event-data')}>Emit</button>`;
}).as('ass');
```

shortcut for 

```ts
component(($) => {
    function emit(name: string, init?: CustomEventInit) {
        return $.dispatchEvent(new CustomEvent(name, init));
    }

    emit('event-name', 'event-data');

    // in template return a button that emits an event on click
    return () => html`<button onclick=${() => emit('event-name', 'event-data')}>Emit</button>`;
}).as('ass');
```

