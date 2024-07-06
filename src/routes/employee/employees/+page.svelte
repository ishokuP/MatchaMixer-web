<script lang="ts">
	import { enhance } from '$app/forms';

	interface Employee {
		id: number;
		name: string;
		email: string;
		number: string;
		address: string;
		fbname: string;
		role: string;
	}

	interface employeedata {
		data: Employee[];
	}

	export let data: employeedata = { data: [] };


  let modalOpenState = {};

  function toggleModal(employeeId) {
        modalOpenState[employeeId] = !modalOpenState[employeeId];
    }


</script>
<h2 class="text-4xl font-extrabold">Employees</h2>


<br>
<div class="w-auto">
	<table class="table">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Job</th>
				<th>Role</th>
			</tr>
		</thead>
    <tbody>
      {#each data.data as Employee (Employee.id)}
          <tr class="hover">
              <th>{Employee.id}</th>
              <td>{Employee.name}</td>
              <td>{Employee.address}</td>
              <td>{Employee.role}</td>
              <td>
                <form method="post"  use:enhance>
                  <div class="modal" class:modal-open={modalOpenState[Employee.id]}>
                    <div class="modal-box">
                      <div>
                        <h6 class="text-lg font-bold" >ID</h6>

                        <h2>
                          <input type="text" name="employeeName" class="input input-bordered w-full max-w-xs"  bind:value={Employee.id}  readonly/>
                        </h2>
                      </div>
                      <br>
                      <div class="flex space-x-4">
                        <div>
                          <h6 class="text-lg font-bold" >Name</h6>
                          <h2>

                            <input type="text" name="employeeName" class="input input-bordered w-full max-w-xs" bind:value={Employee.name} readonly/>
                          </h2>

                          <h6 class="text-lg font-bold" >Number</h6>

                          <h2>
                            <input type="text" name="employeeName"class="input input-bordered w-full max-w-xs"  bind:value={Employee.number} readonly/>
                          </h2>

                          <h6 class="text-lg font-bold" >Address</h6>

                          <h2>
                            <input type="text" name="employeeName" class="input input-bordered w-full max-w-xs" bind:value={Employee.address} readonly/>
                          </h2>

                        </div>
                        <div>
                          <h6 class="text-lg font-bold" >FB Name</h6>

                          <h2>
                            <input type="text" name="employeeName" class="input input-bordered w-full max-w-xs" bind:value={Employee.fbname} readonly />
                          </h2>

                          <h6 class="text-lg font-bold" >Role</h6>

                          <h2>
                            <input type="text" name="employeeName" class="input input-bordered w-full max-w-xs" bind:value={Employee.role} readonly/>
                          </h2>
                        </div>

                      </div>
                      <br>
                        <div class="modal-action flex w-full">
                            <div class="flex space-x-4 justify-end">
                                <button type="button"class="btn btn-error" on:click={() => toggleModal(Employee.id)}>Close</button>
`                            </div>
                        </div>
                    </div>
                </div>
                </form>
                  <button class="modal-button btn" on:click={() => toggleModal(Employee.id)}>Details</button>

              </td>
          </tr>
      {/each}
  </tbody>
  

		<tfoot>

		</tfoot>
	</table>

  
</div>

