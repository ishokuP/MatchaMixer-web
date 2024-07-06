<script>
    
</script>

<div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col p-14">
      <slot />
      <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
        Open drawer
      </label>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <input type="date" />
        <li><a href="/employee/events">Events</a></li>
        <li><a href="/employee/equipment">Equipments</a></li>
        <li><a href="/employee/employees">Employees</a></li>
        <li><a href="/employee/finances">Finances</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    </div>
  </div>