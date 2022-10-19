# svelte-wc-bind

Svelte webcomponent bind is all about enabling two way data binding in svelte web component.

## Usage

```svelte
<!-- Input.svelte -->
<svelte:options tag="my-input" />

<script lang="ts">
  export let value: string;

  function dispatch(e: any) {
    e.target.dispatchEvent(
      new CustomEvent("bind", { detail: e.target.value, composed: true })
    );
  }
</script>

<input type="text" bind:value on:input={dispatch} />
```

```svelte
<!-- App.svelte -->
<script lang="ts">
  import { BindValue, bind } from "svelte-wc-bind";
  import "./Input.svelte";

  const name = new BindValue<string>("");
</script>

<my-input use:bind={{ value: name }} />
{$name}
<br />
<my-input value={$name} on:bind={(e) => (name.value = e.detail)} />
<br />
<button on:click={() => (name.value = "Updated Value")}> Update Value </button>
```
