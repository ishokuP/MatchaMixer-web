<script lang="ts">

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
        <li><a href="/admin/events">Events</a></li>
        <li><a href="/admin/equipment">Equipments</a></li>
        <li><a href="/admin/employees">Employees</a></li>
        <li><a href="/admin/services">Services</a></li>
        <div class="flex-grow"></div>
        <!-- TODO Add a settings icon to logout n sh -->
        <li><a href="/logout" class="self-end">Logout</a></li>
      </ul>
    </div>
  </div>