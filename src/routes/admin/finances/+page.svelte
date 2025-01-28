<script lang="ts">
	import { enhance } from '$app/forms';

	interface MonthlyFinanceReport {
		id: number;
		title: string;
		summary: string;
		totalRevenue: number;
	}

	interface EmployeePayout {
		id: number;
		name: string;
		payoutAmount: number;
	}

	interface MonthlyBill {
		id: number;
		biller: string;
		totalBillAmount: number;
	}

	interface FinanceData {
		monthlyFinanceReports: MonthlyFinanceReport[];
		employeePayouts: EmployeePayout[];
		monthlyBills: MonthlyBill[];
	}

	export let data: FinanceData = {
		monthlyFinanceReports: [],
		employeePayouts: [],
		monthlyBills: []
	};

	let modalOpenState = {};

	function toggleModal(id: number) {
		modalOpenState[id] = !modalOpenState[id];
	}

	function addFinanceReport() {
		const newReport: MonthlyFinanceReport = {
			id: Math.floor(Math.random() * 100000),
			title: '',
			summary: '',
			totalRevenue: 0
		};
		data.monthlyFinanceReports = [...data.monthlyFinanceReports, newReport];
	}

	function addEmployeePayout() {
		const newPayout: EmployeePayout = {
			id: Math.floor(Math.random() * 100000),
			name: '',
			payoutAmount: 0
		};
		data.employeePayouts = [...data.employeePayouts, newPayout];
	}

	function addMonthlyBill() {
		const newBill: MonthlyBill = {
			id: Math.floor(Math.random() * 100000),
			biller: '',
			totalBillAmount: 0
		};
		data.monthlyBills = [...data.monthlyBills, newBill];
	}

	$: {
		data = {
			monthlyFinanceReports: data?.monthlyFinanceReports || [],
			employeePayouts: data?.employeePayouts || [],
			monthlyBills: data?.monthlyBills || []
		};

		data.monthlyFinanceReports.forEach((item) => {
			if (!(item.id in modalOpenState)) modalOpenState[item.id] = false;
		});

		data.employeePayouts.forEach((item) => {
			if (!(item.id in modalOpenState)) modalOpenState[item.id] = false;
		});

		data.monthlyBills.forEach((item) => {
			if (!(item.id in modalOpenState)) modalOpenState[item.id] = false;
		});
	}
</script>

<h2 class="text-4xl font-extrabold">Finance Management</h2>

<div class="space-y-8">
	<!-- Monthly Finance Reports -->
	<div>
		<h3 class="text-2xl font-bold">Monthly Finance Reports</h3>
		<button class="btn btn-primary my-4" on:click={addFinanceReport}>+ Add Finance Report</button>
		<table class="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Title</th>
					<th>Summary</th>
					<th>Total Revenue</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.monthlyFinanceReports as report (report.id)}
					<tr>
						<td>{report.id}</td>
						<td>{report.title}</td>
						<td>{report.summary}</td>
						<td>{report.totalRevenue}</td>
						<td>
							<button class="btn" on:click={() => toggleModal(report.id)}>Details</button>
							<div class="modal" class:modal-open={modalOpenState[report.id]}>
								<div class="modal-box">
									<form>
										<h3 class="text-lg font-bold">Edit Monthly Finance Report</h3>
										<div class="form-control">
											<label for="report-title-{report.id}" class="label">Title</label>
											<input
												id="report-title-{report.id}"
												type="text"
												class="input input-bordered"
												bind:value={report.title}
											/>
										</div>
										<div class="form-control">
											<label for="report-summary-{report.id}" class="label">Summary</label>
											<input
												id="report-summary-{report.id}"
												type="text"
												class="input input-bordered"
												bind:value={report.summary}
											/>
										</div>
										<div class="form-control">
											<label for="report-total-revenue-{report.id}" class="label"
												>Total Revenue</label
											>
											<input
												id="report-total-revenue-{report.id}"
												type="number"
												class="input input-bordered"
												bind:value={report.totalRevenue}
											/>
										</div>
										<div class="modal-action">
											<button class="btn btn-primary">Save Changes</button>
											<button class="btn btn-error" formaction="?/delete">Delete</button>
											<button class="btn" on:click={() => toggleModal(report.id)}>Close</button>
										</div>
									</form>
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Employee Payouts -->
	<div>
		<h3 class="text-2xl font-bold">Employee Payouts</h3>
		<button class="btn btn-primary my-4" on:click={addEmployeePayout}>+ Add Employee Payout</button>
		<table class="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Payout Amount</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.employeePayouts as payout (payout.id)}
					<tr>
						<td>{payout.id}</td>
						<td>{payout.name}</td>
						<td>{payout.payoutAmount}</td>
						<td>
							<button class="btn" on:click={() => toggleModal(payout.id)}>Details</button>
							<div class="modal" class:modal-open={modalOpenState[payout.id]}>
								<div class="modal-box">
									<form>
										<h3 class="text-lg font-bold">Edit Employee Payout</h3>
										<div class="form-control">
											<label for="payout-name-{payout.id}" class="label">Name</label>
											<input
												id="payout-name-{payout.id}"
												type="text"
												class="input input-bordered"
												bind:value={payout.name}
											/>
										</div>
										<div class="form-control">
											<label for="payout-amount-{payout.id}" class="label">Payout Amount</label>
											<input
												id="payout-amount-{payout.id}"
												type="number"
												class="input input-bordered"
												bind:value={payout.payoutAmount}
											/>
										</div>
										<div class="modal-action">
											<button class="btn btn-primary">Save Changes</button>
											<button class="btn btn-error" formaction="?/delete">Delete</button>
											<button class="btn" on:click={() => toggleModal(payout.id)}>Close</button>
										</div>
									</form>
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Monthly Bills -->
	<div>
		<h3 class="text-2xl font-bold">Monthly Bills</h3>
		<button class="btn btn-primary my-4" on:click={addMonthlyBill}>+ Add Monthly Bill</button>
		<table class="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Biller</th>
					<th>Total Bill Amount</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.monthlyBills as bill (bill.id)}
					<tr>
						<td>{bill.id}</td>
						<td>{bill.biller}</td>
						<td>{bill.totalBillAmount}</td>
						<td>
							<button class="btn" on:click={() => toggleModal(bill.id)}>Details</button>
							<div class="modal" class:modal-open={modalOpenState[bill.id]}>
								<div class="modal-box">
									<form>
										<h3 class="text-lg font-bold">Edit Monthly Bill</h3>
										<div class="form-control">
											<label for="bill-biller-{bill.id}" class="label">Biller</label>
											<input
												id="bill-biller-{bill.id}"
												type="text"
												class="input input-bordered"
												bind:value={bill.biller}
											/>
										</div>
										<div class="form-control">
											<label for="bill-total-{bill.id}" class="label">Total Bill Amount</label>
											<input
												id="bill-total-{bill.id}"
												type="number"
												class="input input-bordered"
												bind:value={bill.totalBillAmount}
											/>
										</div>
										<div class="modal-action">
											<button class="btn btn-primary">Save Changes</button>
											<button class="btn btn-error" formaction="?/delete">Delete</button>
											<button class="btn" on:click={() => toggleModal(bill.id)}>Close</button>
										</div>
									</form>
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
