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

	let user = { name: "Admin", profilePic: "/profile-placeholder.png" }; // Replace with actual user data

</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col p-14">
		<label for="my-drawer-2" class="btn btn-primary drawer-button w-min lg:hidden">
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
		<slot />
	</div>
	<div class="sidebar drawer-side">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="logo w-80 bg-base-200 text-base-content">
			<img src="/logo.png" alt="placeholder logo" />
			<span class="title">Matcha Mixer</span>
		</div>
		<h2 class="subheading-title rounded-md dark:block">Stand-Alone Event Management System</h2>
		<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<div class="categories">
				<li class="categories-title">
					<a
						href="/admin/events"
						class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/events'
							? 'active'
							: ''}"
						><img src="/events.png" alt="placeholder logo" class="categories-img" /><span
							class="middle-dot">&middot;</span
						>
						<span class="title mr-24">Events</span>
					</a>
				</li>
				<li class="categories-title">
					<a
						href="/admin/equipment"
						class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/equipment'
							? 'active'
							: ''}"
						><img src="/equipments.png" alt="placeholder logo" class="categories-img" /><span
							class="middle-dot">&middot;</span
						><span class="title mr-9">Equipments</span>
					</a>
				</li>
				<li class="categories-title">
					<a
						href="/admin/employees"
						class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/employees'
							? 'active'
							: ''}"
						><img src="/employees.png" alt="placeholder logo" class="categories-img" /><span
							class="middle-dot">&middot;</span
						><span class="title mr-12">Employees</span></a
					>
				</li>
				<li class="categories-title">
					<a
						href="/admin/services"
						class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/services'
							? 'active'
							: ''}"
						><img src="/services.png" alt="placeholder logo" class="categories-img" /><span
							class="middle-dot">&middot;</span
						><span class="title" style="margin-right: 75px;">Services</span></a
					>
				</li>
				<li class="categories-title">
					<a
						href="/admin/finances"
						class="sidebar-title btn btn-ghost {$page.url.pathname === '/admin/finances'
							? 'active'
							: ''}"
						><img src="/finances.png" alt="placeholder logo" class="categories-img" /><span
							class="middle-dot">&middot;</span
						><span class="title" style="margin-right: 75px;">Finances</span></a
					>
				</li>
			</div>

			<div class="flex-grow"></div>
			<!-- TODO Add a settings icon to logout n sh -->
			<div class="lowbar flex items-center justify-between">
				<div class="dropdown dropdown-top">
					<div tabindex="0" role="button" class="btn m-1">
						Theme
						<svg
							width="12px"
							height="12px"
							class="inline-block h-2 w-2 fill-current opacity-60"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 2048 2048"
						>
							<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
						</svg>
					</div>
					<ul class="dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow-2xl">
						<li>
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-ghost btn-sm btn-block justify-start"
								aria-label="Dark"
								value="dark"
								checked={currentTheme === 'dark'}
								on:change={() => setTheme('dark')}
							/>
						</li>
						<li>
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-ghost btn-sm btn-block justify-start"
								aria-label="Light"
								value="light"
								checked={currentTheme === 'light'}
								on:change={() => setTheme('light')}
							/>
						</li>
						<li>
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-ghost btn-sm btn-block justify-start"
								aria-label="Matcha"
								value="matcha"
								checked={currentTheme === 'matcha'}
								on:change={() => setTheme('matcha')}
							/>
						</li>
					</ul>
				</div>
				<a href="/logout" class="btn btn-ghost">Logout</a>
			</div>
		</ul>
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
	.logo {
		padding: 1.5rem;
		display: flex;
		align-items: center;
		margin-bottom: 2rem;
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
		margin-right: 0.49rem;
		margin-top: -5.1rem;
		margin-left: 1.35rem;
		padding-top: 1.71rem;
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
		background: oklch(0.44 0.06 141.63);
		color: white;
	}
</style>
