<script lang="ts">
	import { enhance } from '$app/forms';

	interface EmployeePayout {
		eventID: number;
		eventName: string;
		name: string;
		payoutAmount: number;
		status: 'Paid' | 'Unpaid';
		employees: Employee[];
	}

	interface Employee {
		employeeName: string;
	}

	interface FinanceData {
		eventResults: EmployeePayout[];
	}

	export let data: FinanceData = {
		eventResults: []
	};
	console.log(data);

	// dummy data
	// $: data = {
	// 	employeePayouts: [
	// 		{
	// 			id: 1001,
	// 			eventName: 'Annual Company Retreat',
	// 			name: 'Alice Johnson',
	// 			payoutAmount: 1500,
	// 			status: 'Paid'
	// 		},
	// 		{
	// 			id: 1002,
	// 			eventName: 'Quarterly Sales Bonus',
	// 			name: 'Bob Smith',
	// 			payoutAmount: 2000,
	// 			status: 'Unpaid'
	// 		},
	// 		{
	// 			id: 1003,
	// 			eventName: 'Project X Completion Bonus',
	// 			name: 'Charlie Davis',
	// 			payoutAmount: 2500,
	// 			status: 'Paid'
	// 		},
	// 		{
	// 			id: 1004,
	// 			eventName: 'Holiday Bonus',
	// 			name: 'Diana Evans',
	// 			payoutAmount: 1800,
	// 			status: 'Unpaid'
	// 		},
	// 		{
	// 			id: 1005,
	// 			eventName: 'Customer Service Excellence Award',
	// 			name: 'Edward Brown',
	// 			payoutAmount: 1200,
	// 			status: 'Paid'
	// 		}
	// 	]
	// };

	let confirmationDelete: HTMLDialogElement;
	let currentDeletingEvent: number | null = null;

	function confirmRemove(id: number) {
		currentDeletingEvent = id;
		confirmationDelete.showModal();
	}

	// function removeConfirmed() {
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
				<th class="w-32 p-3 text-xl font-extrabold text-white">Status</th>
				<th class="last-column w-40 p-3 text-xl font-extrabold text-white">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each data.eventResults as payout}
				{#each payout.employees as employee}
					<tr class="border-b-2">
						<td class="w-20 p-3">{payout.eventID}</td>
						<td class="w-48 p-3">{payout.eventName}</td>
						<td class="w-48 p-3">{employee.employeeName}</td>
						<td class="w-32 p-3">{payoutAmount}</td>
						<td class="w-32 p-3">
							<!-- Hidden Form to Toggle Status -->
							<form method="POST" action="?/update" use:enhance>
								<input type="hidden" name="eventID" value={payout.eventID} />
								<input type="hidden" name="eventName" value={payout.eventName} />
								<input type="hidden" name="employeeName" value={employee.employeeName} />
								<input type="hidden" name="payoutAmount" value={payoutAmount} />
								<input type="hidden" name="currentStatus" value={payout.status} />
								<button
									class="btn w-full font-bold {payout.status === 'Paid'
										? 'text-green-600 text-xl font-extrabold'
										: 'text-red-600'}"
									type="submit"
								>
									{#if !payout.status || payout.status === 'Unpaid'}
										Unpaid
									{:else}
										{payout.status}
									{/if}
								</button>
							</form>
						</td>
						<td class="w-40 p-3">
							<!-- Delete Button Opens Confirmation Dialog -->
							<button
								class="btn btn-error w-full"
								type="button"
								on:click={() => confirmRemove(payout.eventID)}>Delete</button
							>
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
