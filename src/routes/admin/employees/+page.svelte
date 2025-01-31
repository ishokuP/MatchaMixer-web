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
    password:string;
	}

	interface employeedata {
		data: Employee[];
	}

	export let data: employeedata = { data: [] };

	function addNewEvent() {
		const newEmployee: Employee = {
			id: Math.floor(Math.random() * 100000),
			name: '',
			email: '',
			number: '',
			address: '',
			fbname: '',
			role: '',
      password:''
		};
		data.data = [...data.data, newEmployee];
	}

  let modalOpenState = {};

  function toggleModal(employeeId) {
        modalOpenState[employeeId] = !modalOpenState[employeeId];
    }


// Whenever new data is added, ensure we have a modal state for each employee
$: data.data.forEach(employee => {
    if (!(employee.id in modalOpenState)) {
        modalOpenState[employee.id] = false;
    }
});

</script>
<!-- <h2 class="text-4xl font-extrabold">Employees</h2> -->

<div class="sticky top-4 z-50 p-4 mt-4">
  <button class="btn w-40" on:click={addNewEvent}>
    + Add Employee
  </button>
</div>
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
                <form method="post" action="?/update" use:enhance>
                  <div class="modal" class:modal-open={modalOpenState[Employee.id]}>
                    <div class="modal-box">
                      <div>
                        <h6 class="text-lg font-bold" >ID</h6>

                        <h2>
                          <input type="text" name="employeeID" class="input input-bordered w-full max-w-xs"  bind:value={Employee.id}  readonly/>
                        </h2>
                      </div>
                      <br>
                      <div class="flex space-x-4">
                        <div>
                          <h6 class="text-lg font-bold" >Name</h6>
                          <h2>

                            <input type="text" name="employeeName" class="input input-bordered w-full max-w-xs" bind:value={Employee.name} />
                          </h2>

                          <h6 class="text-lg font-bold" >Number</h6>

                          <h2>
                            <input type="text" name="employeeNumber"class="input input-bordered w-full max-w-xs"  bind:value={Employee.number} />
                          </h2>

                          <h6 class="text-lg font-bold" >Address</h6>

                          <h2>
                            <input type="text" name="employeeAddress" class="input input-bordered w-full max-w-xs" bind:value={Employee.address} />
                          </h2>

                        </div>
                        <div>
                          <h6 class="text-lg font-bold" >FB Name</h6>

                          <h2>
                            <input type="text" name="employeeFBName" class="input input-bordered w-full max-w-xs" bind:value={Employee.fbname} />
                          </h2>

                          <h6 class="text-lg font-bold" >Role</h6>

                          <h2>
                            <input type="text" name="employeeRole" class="input input-bordered w-full max-w-xs" bind:value={Employee.role} />
                          </h2>

                        </div>


                      </div>
                      <br>
                      <div class="w-full">

                        <h6 class="text-lg font-bold" >Email</h6>

                        <h2>
                          <input type="text" name="employeeEmail" class="input input-bordered w-full " bind:value={Employee.email} />
                        </h2>
                          
                        <h6 class="text-lg font-bold" >Password</h6>

                        <h2>
                          <input type="password" name="employeePassword" class="input input-bordered w-full " bind:value={Employee.password} />
                        </h2>

                        <br>


                      </div>
                      <br>
                        <div class="modal-action flex w-full justify-between">
                            <button class="btn btn-primary" on:click={() => toggleModal(Employee.id)} formaction="?/delete">Delete</button>
                            <div class="flex space-x-4">
                                <button class="btn btn-primary" on:click={() => toggleModal(Employee.id)}>Save Changes</button>
                                <button type="button"class="btn btn-error" on:click={() => toggleModal(Employee.id)}>Close</button>
                            </div>
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

