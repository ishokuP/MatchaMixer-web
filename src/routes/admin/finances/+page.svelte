<script lang="ts">
	import { enhance } from '$app/forms';

	interface EmployeePayout {
		id: number;
		eventName: string;
		name: string;
		payoutAmount: number;
		status: 'Paid' | 'Unpaid';
	}

	interface FinanceData {
		employeePayouts: EmployeePayout[];
	}

	export let data: FinanceData = {
		employeePayouts: []
	};

	// dummy data
	$: data = {
		employeePayouts: [
			{
				id: 1001,
				eventName: 'Annual Company Retreat',
				name: 'Alice Johnson',
				payoutAmount: 1500,
				status: 'Paid'
			},
			{
				id: 1002,
				eventName: 'Quarterly Sales Bonus',
				name: 'Bob Smith',
				payoutAmount: 2000,
				status: 'Unpaid'
			},
			{
				id: 1003,
				eventName: 'Project X Completion Bonus',
				name: 'Charlie Davis',
				payoutAmount: 2500,
				status: 'Paid'
			},
			{
				id: 1004,
				eventName: 'Holiday Bonus',
				name: 'Diana Evans',
				payoutAmount: 1800,
				status: 'Unpaid'
			},
			{
				id: 1005,
				eventName: 'Customer Service Excellence Award',
				name: 'Edward Brown',
				payoutAmount: 1200,
				status: 'Paid'
			}
		]
	};

	let confirmationDelete: HTMLDialogElement;
	let currentDeletingEvent: number | null = null;

	function confirmRemove(id: number) {
		currentDeletingEvent = id;
		confirmationDelete.showModal();
	}

	function removeConfirmed() {
		if (currentDeletingEvent !== null) {
			data.employeePayouts = data.employeePayouts.filter(
				(payout) => payout.id !== currentDeletingEvent
			);
			currentDeletingEvent = null;
		}
		confirmationDelete.close();
	}
</script>

<dialog bind:this={confirmationDelete} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Confirm Delete</h3>
		<p class="py-4">Are you sure you want to remove this employee payout?</p>
		<div class="modal-action">
			<button type="button" class="btn btn-error" on:click={removeConfirmed}>Delete</button>
			<button type="button" class="btn" on:click={() => confirmationDelete.close()}>Cancel</button>
		</div>
	</div>
</dialog>

<!-- <h2 class="text-4xl font-extrabold">Finance Management</h2> -->
<!-- TODO add logic for this, loop through the event and find each employee  -->
 <!-- Todo monthly graph report? -->
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
			{#each data.employeePayouts as payout (payout.id)}
				<tr class="border-b-2">
					<td class="w-20 p-3">{payout.id}</td>
					<td class="w-48 p-3">{payout.eventName}</td>
					<td class="w-48 p-3">{payout.name}</td>
					<td class="w-32 p-3">{payout.payoutAmount}</td>
					<td class="w-32 p-3">
						<button
							class="btn w-full font-bold {payout.status === 'Paid'
								? 'text-xl font-extrabold'
								: ''}"
							on:click={() => (payout.status = payout.status === 'Paid' ? 'Unpaid' : 'Paid')}
						>
							{payout.status}
						</button>
					</td>
					<td class="w-40 p-3">
						<button class="btn btn-error w-full" on:click={() => confirmRemove(payout.id)}
							>Delete</button
						>
					</td>
				</tr>
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
