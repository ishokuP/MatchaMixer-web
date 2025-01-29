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

	function addEmployeePayout() {
		const newPayout: EmployeePayout = {
			id: Math.floor(Math.random() * 100000),
			eventName: '',
			name: '',
			payoutAmount: 0,
			status: 'Unpaid'
		};
		data.employeePayouts = [...data.employeePayouts, newPayout];
	}

	function removeEmployeePayout(id: number) {
		data.employeePayouts = data.employeePayouts.filter((payout) => payout.id !== id);
	}
</script>

<h2 class="text-4xl font-extrabold">Finance Management</h2>

<div class="space-y-8">
	<!-- Monthly Finance Reports -->

	<!-- Employee Payouts -->
	<h3 class="text-2xl font-bold">Employee Payouts</h3>
	<button class="btn btn-primary my-4" on:click={addEmployeePayout}>+ Add Employee Payout</button>
	<table class="table">
		<thead>
			<tr class="border-b-2">
				<th class="w-20 p-3 text-xl font-extrabold">ID</th>
				<th class="w-48 p-3 text-xl font-extrabold">Event Name</th>
				<th class="w-48 p-3 text-xl font-extrabold">Employee Name</th>
				<th class="w-32 p-3 text-xl font-extrabold">Amount</th>
				<th class="w-32 p-3 text-xl font-extrabold">Status</th>
				<th class="w-40 p-3 text-xl font-extrabold">Actions</th>
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
						<button class="btn btn-error w-full" on:click={() => removeEmployeePayout(payout.id)}
							>Clear</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
