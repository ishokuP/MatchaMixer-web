<script>
    export let type = "hidden";
    export let name;
    export let value;
    export let editable = false;
</script>

{#if editable}
    <input class="input input-bordered w-full" type="text" name={name} bind:value={value} />
{:else}
    <input type={type} name={name} value={value} />
{/if}
