<script>
	// @ts-nocheck

	import { page } from '$app/stores';
</script>
<!-- svelte-ignore a11y-missing-attribute -->
<html data-theme="matcha"></html>

<div class="relative w-screen h-screen flex flex-col items-center justify-center">
    <div class="flex flex-col items-center">
        <img src="/error-images/ggteam.webp" alt="" class="mb-4">

        <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            {$page.status}: {$page.error.message}
        </h1>
        <br><br>
        <a href="/" class="flex items-center space-x-4">
        <button class="btn btn-active btn-primary flex items-center">
            
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <span>Go Back home</span>
        </button>
    </a>

    </div>



</div>



