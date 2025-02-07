<script lang="ts">
	import { enhance } from '$app/forms';

	interface EmployeePayout {
			eventID: number;
			eventName: string;
			name: string;
			payoutAmount: number;
			status: string;
			employees: Employee[];
	}

	interface Employee {
		employeeName: string;
		status:string;
	}

	interface FinanceData {
		eventResults: EmployeePayout[];
	}

	export let data: FinanceData = {
		eventResults: []
	};
	console.log(data);


	let confirmationDelete: HTMLDialogElement;
	let currentDeletingEvent: number | null = null;

	function confirmRemove(id: number) {
		currentDeletingEvent = id;
		confirmationDelete.showModal();
	}

	    // Merge eventResults with financesdata to get the correct status
    function mergeStatus(eventResults: EmployeePayout[], financesdata: any[]) {
        for (const payout of eventResults) {
            for (const employee of payout.employees) {
                // Find the matching status in financesdata
                const financeRecord = financesdata.find(
                    (fin) => fin.eventName === payout.eventName && fin.employeeName === employee.employeeName
                );

                // If we find a match in financesdata, update the status
                if (financeRecord) {
                    employee.status = financeRecord.status;
                } else {
                    // Default to 'Unpaid' if no record in financesdata
                    employee.status = 'Unpaid';
                }
            }
        }
    }

    // Call the merge function to update the statuses
    mergeStatus(data.eventResults, data.financesdata);

    // Function to toggle the employee's status (locally in the frontend)
	const toggleStatus = (eventName: string, employeeName: string) => {
    for (const payout of data.eventResults) {
        if (payout.eventName === eventName) {
            const employee = payout.employees.find(emp => emp.employeeName === employeeName);
            if (employee) {
                // Toggle the status
                employee.status = employee.status === 'Paid' ? 'Unpaid' : 'Paid';
            }
        }
    }
};



	// 	if (currentDeletingEvent !== null) {
	// 		data.employeePayouts = data.employeePayouts.filter(
	// 			(payout) => payout.id !== currentDeletingEvent
	// 		);
	// 		currentDeletingEvent = null;
	// 	}
	// 	confirmationDelete.close();
	// }

	// in php
	let payoutAmount = 1500;
</script>

<dialog bind:this={confirmationDelete} class="modal">
	<form action="?/delete" method="post" use:enhance>
		<input type="hidden" name="equipID" value={currentDeletingEvent} />
		<div class="modal-box">
			<h3 class="text-lg font-bold">Confirm Delete</h3>
			<p class="py-4">Are you sure you want to remove this employee payout?</p>
			<div class="modal-action">
				<button type="submit" class="btn btn-error">Delete</button>
				<button type="button" class="btn" on:click={() => confirmationDelete.close()}>Cancel</button
				>
			</div>
		</div>
	</form>
</dialog>

<!-- <h2 class="text-4xl font-extrabold">Finance Management</h2> -->
<!-- TODO add logic for this, loop through the event and find each employee  -->
<!-- Todo monthly graph report? -->
<!-- as for the status we its paid or not / change the finances table to have amount, eventid, status, date -->
<!-- for the cost basically just do add subtract based on whether they're paid or not -->
<div class="space-y-8 mt-4">
	<h3 class="text-2xl font-bold">Employee Payouts</h3>
	<table class="table">
		<thead>
			<tr class="border-b-2">
				<th class="first-column w-20 p-3 text-xl font-extrabold text-white">ID</th>
				<th class="w-48 p-3 text-xl font-extrabold text-white">Event Name</th>
				<th class="w-48 p-3 text-xl font-extrabold text-white">Employee Name</th>
				<th class="w-32 p-3 text-xl font-extrabold text-white">Amount</th>
				<th class="last-column w-32 p-3 text-xl font-extrabold text-white">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each data.eventResults as payout}
				{#each payout.employees as employee}
					<tr class="border-b-2 hover">
						<td class="w-20 p-3">{payout.eventID}</td>
						<td class="w-48 p-3">{payout.eventName}</td>
						<td class="w-48 p-3">{employee.employeeName}</td>
						<td class="w-32 p-3">{payoutAmount}</td>
						<td class="w-32 p-3">
							<!-- Button will default to 'Unpaid' if no record in financesemployees, or show actual status -->
							<form method="POST" action="?/update">
								<input type="hidden" name="eventID" value={payout.eventID} />
								<input type="hidden" name="eventName" value={payout.eventName} />
								<input type="hidden" name="employeeName" value={employee.employeeName} />
								<input type="hidden" name="payoutAmount" value={payoutAmount} />
								<input type="hidden" name="currentStatus" value={employee.status} />
								<button
								class="btn w-full font-bold {employee.status === 'Paid' ? 'text-green-600 text-xl font-extrabold' : 'text-red-600'}"
								type="submit"
								on:click={() => toggleStatus(payout.eventName, employee.employeeName)} 
							>
								{#if employee.status === 'Unpaid'}
									Unpaid
								{:else}
									Paid
								{/if}
							</button>
							
							</form>
						</td>

					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>

<style>
	th {
		background: oklch(33.4052% 0.059945 126.98602 / 1);
	}

	.first-column {
		border-top-left-radius: 1rem;
	}

	.last-column {
		border-top-right-radius: 1rem;
	}
</style>
