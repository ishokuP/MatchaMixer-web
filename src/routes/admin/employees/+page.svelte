<script lang="ts">
	import { enhance } from '$app/forms';

	interface Employee {
		id: string;
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

	function addNewEvent() {
		const newEmployee: Employee = {
			id: '',
			name: '',
			email: '',
			number: '',
			address: '',
			fbname: '',
			role: ''
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

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Name</th>
				<th>Job</th>
				<th>role</th>
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
                        <h1>ID</h1>
                        <h2>
                          <input type="text" name="employeeName" bind:value={Employee.id}  readonly/>
                        </h2>
                      </div>
                      <div class="flex flex-wrap space-x-4">
                        <div>
                          <h1>Name</h1>
                          <h2>
                            <input type="text" name="employeeName" bind:value={Employee.name} />
                          </h2>
                        </div>
                        <div>
                          <h1>number</h1>
                          <h2>
                            <input type="text" name="employeeName" bind:value={Employee.number} />
                          </h2>
                        </div>
                        <div>
                          <h1>Address</h1>
                          <h2>
                            <input type="text" name="employeeName" bind:value={Employee.address} />
                          </h2>
                        </div>
                        <div>
                          <h1>fbname</h1>
                          <h2>
                            <input type="text" name="employeeName" bind:value={Employee.fbname} />
                          </h2>
                        </div>
                        <div>
                          <h1>Role</h1>
                          <h2>
                            <input type="text" name="employeeName" bind:value={Employee.role} />
                          </h2>
                        </div>
                      </div>
    
                        <div class="modal-action flex w-full justify-between">
                            <button class="btn btn-primary" on:click={() => toggleModal(Employee.id)} formaction="?/delete">Delete</button>
                            <div class="flex space-x-4">
                                <button class="btn btn-primary" on:click={() => toggleModal(Employee.id)}>Save Changes</button>
                                <button class="btn btn-error" on:click={() => toggleModal(Employee.id)}>Close</button>
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
			<button class="btn h-full w-full bg-base-200" on:click={addNewEvent}>
				<div class="card-body w-full">
					<div class="card-actions justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						Add Employee
					</div>
				</div>
			</button>
		</tfoot>
	</table>
</div>
