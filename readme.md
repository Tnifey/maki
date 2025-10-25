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

```tsx
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

    function incrementCount(event) {
        setCount(count() + 1)
    }

    function incrementGlobal(event) {
        setSomeGlobal((count) => count + 1)
    }

    // this called when the component is rendered
    return ($argsObject /* this.args */) => html`
        <h1>${count()}</h1>
        <button @click=${incrementCount}>Increment count</button>
        <button @click=${incrementGlobal}>Increment global</button>
        <pre>count:  ${count()}</pre>
        <pre>global: ${someGlobal()}</pre>
    `;
}).as('irresponsible-component');
```

```html
<script src="path/to/js.js" async></script>

<irresponsible-component></irresponsible-component>
```

## API?

### `use` - use atom, isotope or state
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

### `isotope`
```typescript
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
