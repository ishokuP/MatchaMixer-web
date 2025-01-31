<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let currentTheme = 'light';

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		setTheme(savedTheme);
	});

	function setTheme(theme) {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		currentTheme = theme;
	}

	let headerTitle = 'Dashboard';
	let breadcrumbs = [];

	// Route-to-title and breadcrumb mappings
	const routeTitleMap = {
		'/admin/events': { title: 'Event', breadcrumbs: ['System', 'Event Management'] },
		'/admin/equipment': { title: 'Equipment', breadcrumbs: ['System', 'Equipment Management'] },
		'/admin/employees': { title: 'Employee', breadcrumbs: ['System', 'Employees Management'] },
		'/admin/services': { title: 'Service ', breadcrumbs: ['System', 'Services Management'] },
		'/admin/finances': { title: 'Finance', breadcrumbs: ['System', 'Finances Management'] }
	};

	// Reactively update headerTitle and breadcrumbs when the page URL changes
	$: {
		const path = $page.url.pathname; // Reactively tracks the current route
		headerTitle = routeTitleMap[path]?.title || 'Dashboard';
		breadcrumbs = routeTitleMap[path]?.breadcrumbs || [];
	}
</script>

<div class="drawer lg:drawer-open flex">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

	<!-- Sidebar -->
	<div class="drawer-side sidebar flex-none">
		<label for="my-drawer-2" class="drawer-overlay"></label>
		<div class="h-full w-80 bg-base-200 text-base-content">
			<div class="logo">
				<div class="flex items-center">
					<img src="/logo.png" alt="placeholder logo" />
					<span class="title">Matcha Mixer</span>
				</div>
				<h2 class="subheading-title rounded-md dark:block">Stand-Alone Event Management System</h2>
			</div>

			<ul class="menu h-screen w-80 bg-base-200 p-4 text-base-content">
				<div class="categories">
					<div class="subtitle">
						<h2 class="sub-title text-lg font-bold py-2 text-base-content">
							Management Categories
						</h2>
					</div>
					<li class="categories-title">
						<a
							href="/admin/events"
							class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/events'
								? 'active'
								: ''}"
						>
							<img src="/events.png" alt="events logo" class="categories-img" />
							<span class="middle-dot">&middot;</span>
							<span class="title" style="margin-right: 93px;">Events</span>
						</a>
					</li>
					<li class="categories-title">
						<a
							href="/admin/equipment"
							class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/equipment'
								? 'active'
								: ''}"
						>
							<img src="/equipments.png" alt="equipments logo" class="categories-img" />
							<span class="middle-dot">&middot;</span>
							<span class="title" style="margin-right: 37.5px;">Equipments</span>
						</a>
					</li>
					<li class="categories-title">
						<a
							href="/admin/employees"
							class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/employees'
								? 'active'
								: ''}"
						>
							<img src="/employees.png" alt="employees logo" class="categories-img" />
							<span class="middle-dot">&middot;</span>
							<span class="title mr-12">Employees</span>
						</a>
					</li>
					<li class="categories-title">
						<a
							href="/admin/services"
							class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/services'
								? 'active'
								: ''}"
						>
							<img src="/services.png" alt="services logo" class="categories-img" />
							<span class="middle-dot">&middot;</span>
							<span class="title" style="margin-right: 75px;">Services</span>
						</a>
					</li>
					<li class="categories-title">
						<a
							href="/admin/finances"
							class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/finances'
								? 'active'
								: ''}"
						>
							<img src="/finances.png" alt="finances logo" class="categories-img" />
							<span class="middle-dot">&middot;</span>
							<span class="title" style="margin-right: 71px;">Finances</span>
						</a>
					</li>
				</div>
				<div class="flex-grow"></div>

				<!-- Theme & Logout -->
				<h2 class="sub-title text-lg py-2 font-bold text-base-content">Settings</h2>
				<div class="lowbar flex flex-col gap-2">
					<!-- Theme Selector Row -->
					<div
						class="flex items-center gap-1 justify-center rounded-box bg-base-300 p-2 shadow-2xl"
					>
						<span class="font-semibold text-base-content">Theme ></span>
						<div class="flex gap-2 w-52">
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-ghost btn-sm"
								aria-label="Dark"
								value="dark"
								checked={currentTheme === 'dark'}
								on:change={() => setTheme('dark')}
							/>
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-ghost btn-sm"
								aria-label="Light"
								value="light"
								checked={currentTheme === 'light'}
								on:change={() => setTheme('light')}
							/>
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-ghost btn-sm"
								aria-label="Matcha"
								value="matcha"
								checked={currentTheme === 'matcha'}
								on:change={() => setTheme('matcha')}
							/>
						</div>
					</div>
					<div class=" justify-center">
						<a
							href="/logout"
							class="btn btn-ghost rounded-box bg-base-300 p-2 shadow-2xl mt-2 flex py-1 btn-sm w-full flex items-center gap-2 justify-center"
						>
							<img src="/logout.png" alt="Logout" class="settings-img" />
							Logout
						</a>
					</div>
				</div>
			</ul>
		</div>
	</div>

	<!-- Main Content -->
	<div class="drawer-content flex flex-col flex-grow">
		<!-- Header -->
		<header class="bg-base-200 px-4 py-1 flex justify-between items-center sticky top-0 z-10">
			<label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</label>
			<div class="header1 flex flex-col gap-3">
				<h1 class="text-4xl font-extrabold">{headerTitle}</h1>
				<nav class="text-sm text-based-content">
					{#each breadcrumbs as crumb, index}
						<span class="font-medium">{crumb}</span>
						{#if index < breadcrumbs.length - 1}
							<span class="mx-1">&gt;</span> <!-- Adds spacing around '>' -->
						{/if}
					{/each}
				</nav>
			</div>
		</header>

		<!-- Main Content Area -->
		<main class="p-6 flex-grow overflow-auto">
			<slot />
		</main>
	</div>
</div>

<style>
	.menu,
	ul {
		display: flex;
		/* flex-direction: row; */
	}

	.categories {
		/* align-items: center; */
		margin-top: 4rem;
	}

	.categories-title {
		display: flex;
		flex-direction: row;
		margin-bottom: 18px;
	}

	.lowbar {
		display: flex;
		align-content: space-between;
		flex-grow: 0.8;
	}

	.sidebar {
		overflow: hidden;
	}

	img {
		display: flex;
		width: 4rem;
		height: 3.8rem;
	}

	.title {
		margin-left: 1rem;
		font-size: 25px;
		font-weight: 900;
	}

	.subheading-title {
		font-size: 14px;
		font-weight: 800;
		justify-self: center;
	}

	.categories-img {
		width: 2.5rem;
		height: 2.5rem;
		margin-right: 8px;
		box-sizing: border-box;
	}

	.sidebar-title .title {
		font-size: 22px;
		font-weight: 700;
		line-height: 1.2;
	}

	.middle-dot {
		font-size: 2rem;
		color: rgb(80, 165, 31);
		margin: 0 -3px;
		/* vertical-align: middle; */
	}

	.active {
		font-weight: bolder !important;
		background: oklch(33.4052% 0.059945 126.98602 / 1);
		color: white;
		box-shadow:
			1px 1px 40px rgb(10, 29, 10) inset,
			-1px -1px 50px rgb(9, 26, 9) inset;
	}

	header {
		border-bottom: 1px outset;
		height: 95px;
	}

	ul {
		/* border-right: 0.5px outset; */
		box-shadow: inset -8px -8px 8px 0px rgba(0, 0, 0, 0.08);
	}

	.logo {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		height: 95px;
		/* border-bottom: 1px outset; */
		box-shadow: inset -8px 8px 8px 0px rgba(0, 0, 0, 0.08);
	}

	.dropdown-content {
		border: none;
	}

	.shadow-2xl {
		box-shadow: none;
	}

	.settings-img {
		width: 1.5rem;
		height: 1.5rem;
	}
</style>
