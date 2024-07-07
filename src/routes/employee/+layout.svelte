<script lang="ts">
  import { onMount } from 'svelte';

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
</script>




<div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col p-14">
      <label for="my-drawer-2" class="btn btn-primary drawer-button w-min lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        
      </label>
      <slot />

    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <br><br>
        <li><a href="/employee/events"class="btn btn-ghost text-xl">Events</a></li>
        <li><a href="/employee/equipment"class="btn btn-ghost text-xl">Equipments</a></li>
        <li><a href="/employee/employees" class="btn btn-ghost text-xl">Employees</a></li>
        <li><a href="/employee/services" class="btn btn-ghost text-xl">Services</a></li>
        <div class="flex-grow"></div>
        <!-- TODO Add a settings icon to logout n sh -->
        <div class="flex justify-between items-center">
          <div class="dropdown dropdown-top">
            <div tabindex="0" role="button" class="btn m-1">
              Theme
              <svg width="12px" height="12px" class="inline-block h-2 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul class="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Dark"
                  value="dark"
                  checked={currentTheme === 'dark'}
                  on:change={() => setTheme('dark')} />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Light"
                  value="light"
                  checked={currentTheme === 'light'}
                  on:change={() => setTheme('light')} />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Matcha"
                  value="matcha"
                  checked={currentTheme === 'matcha'}
                  on:change={() => setTheme('matcha')} />
              </li>
            </ul>
          </div>
          <a href="/logout" class="btn btn-ghost">Logout</a>
        </div>
        
        
      </ul>
    </div>
  </div>