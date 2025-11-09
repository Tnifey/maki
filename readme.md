## Write it yourself

A simple JAVASCRIPT FRAMEWORK library written in TYPESCRIPT for creating WEB COMPONENTS with hooks.
With twind for styles, jotai for state and lit-html for rendering under the hood.

If you want to use it, you should probably write it yourself. It's not that hard.
It is like 10 lines of code gzipped. Or fork it and do not create PRs or issues.
> It works for me.

## Usage
```json
{
    "dependencies": {
        "maki": "git+https://github.com/tnifey/maki.git"
    }
}
```

## Example

```ts
import { html, component, use, atom } from 'maki';

// global state variable
const $global = atom(0);
const $globalIsotope = isotope(0);

// define a component
component(
    // this function is called when the component is created
    ($ /* this is a current htmlelement */) => {
    // local state variable
    const [count, setCount] = use(0);
    // global state variable
    const [someGlobal, setSomeGlobal] = use($global);
    // global state with isotope is the same as atom
    const [someGlobalIsotope, setSomeGlobalIsotope] = use($globalIsotope);

    function incrementCount(event) {
        setCount(count() + 1)
    }

    function incrementGlobal(event) {
        setSomeGlobal((count) => count + 1)
    }

    function incrementGlobalIsotope(event) {
        setSomeGlobalIsotope((count) => count + 1)
    }

    // this called when the component is rendered
    return ($argsObject /* this.args */) => html`
        <h1>${count()}</h1>
        <button @click=${incrementCount}>Increment count</button>
        <button @click=${incrementGlobal}>Increment global</button>
        <button @click=${incrementGlobalIsotope}>Increment global isotope</button>
        <pre>count:  ${count()}</pre>
        <pre>global: ${someGlobal()}</pre>
        <pre>global isotope: ${someGlobalIsotope()}</pre>
    `;
}).as('irresponsible-component');
```

```html
<script src="path/to/js.js" async></script>

<irresponsible-component></irresponsible-component>
```

See `src/example.ts` for more.

## API?

### `use` - use atom, isotope or state
_`use` must be called inside a component function._
`use` attaches the state to the component, so when the state changes, the component re-renders.

```ts
// simple use
const state = use(0);
state(); // get value
state(1); // set value
state((current) => current + 1); // update value with a function

// with destructuring

const [state, setState] = use(0);
state(); // get value
setState(1); // set value
setState((current) => current + 1); // update value with a function

// with atom, or isotope

// const $state = isotope(0);
const $state = atom(0);
const [state, setState] = use($state);
state(); // get value
setState(1); // set value
setState((current) => current + 1); // update value with a function
```

### `atom` / `isotope` - state variable
_`atom` and `isotope` can be used outside of components as well._
It creates a state variable that can be used with `use` inside components, or directly.

#### `atom` - see `jotai/vanilla`
```ts
import { atom } from 'maki';
// or import { atom } from 'jotai/vanilla';
const $state = atom(0);
```

#### `isotope` - enhanced jotai atom

```ts
import { isotope } from 'maki';

const state = isotope(0);

// get value - with no arguments
state(); // 0

// set value - with an argument as new value
state(1);
// or pass a function
state(previousValue => previousValue + 1);

// subscribe to changes
const unsub = state.subscribe((value) => {
    console.log(value);
});

// isotopes can have guards, which are functions that are called before setting the value and can modify it before it is set
const guarded = isotope(0, (value) => Math.min(10, Math.max(0, value)));
guarded(100); // 10
```
