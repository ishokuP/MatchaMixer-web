<script lang="ts">
	import { DateInput, DatePicker } from 'date-picker-svelte';
	import { enhance } from '$app/forms';
	import Select from 'svelte-select';
	import { onMount } from 'svelte';
	interface Event {
		eventID: number;
		eventName: string;
		eventDate: Date; // Date of the event
		eventTime: string; // Time of the event
		eventClientName: string; // Name of the client hosting the event
		eventClientContact: string; // Contact information for the client
		eventVenue: string; // Venue where the event is held
		eventType: string; // Type of the event (e.g., Wedding, Corporate)
		equipmentNeeded: string[]; // List of equipment needed for the event
		paymentID: number; // Associated payment ID
		paymentStatus: string; // Status of the payment (e.g., Paid, Due)
		paymentCost: string; // Cost of the event
		additionalRequests: string; // Any additional requests or requirements
		service: number; // Service package associated with the event
		employeeAssigned: number; // ID of the employee assigned to the event
	}

	interface Employee {
		employeeID: number;
		employeeName: string;
		employeeRole: string;
		email: string;
		contactNumber: string;
	}
	interface allEmployOriginal {
		id: number;
		name: number;
	}
	interface allEquipOriginal {
		id: number;
		name: number;
	}

	interface Equipment {
		equipmentID: string;
		equipmentName: string;
		equipmentStatus: string;
		equipmentCondition: string;
	}

	export let data: {
		eventResults: Event[];
		employeeResults: { [key: number]: Employee[] };
		equipmentResults: { [key: number]: Equipment[] };
		allEmployees: allEmployOriginal[];
		allEquipment: allEquipOriginal[];
	};

	// console.log(data.allEquipment);

	function formatTime(time: string): string {
		const [hours, minutes] = time.split(':');
		const hour = parseInt(hours, 10);
		const suffix = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${suffix}`;
	}
	let editModes = {};

	let confirmationDelete;
	let currentDeletingEvent = null;

	function promptDelete(eventID) {
		currentDeletingEvent = eventID;
		confirmationDelete.showModal();
	}

	function inputClasses(isEditMode) {
		if (isEditMode) {
			return 'input input-bordered w-full';
		} else {
			return 'bg-transparent border-0 p-0 cursor-default text-base leading-normal';
		}
	}

	function addNewEvent() {
		const newEvent: Event = {
			eventID: Math.floor(Math.random() * 100000),
			eventName: 'New Event',
			eventDate: new Date(),
			eventTime: '12:00:00',
			eventClientName: '',
			eventClientContact: '',
			eventVenue: '',
			eventType: '',
			paymentID: Math.floor(Math.random() * 100000),
			paymentStatus: 'Unpaid',
			paymentCost: '0',
			additionalRequests: '',
			equipmentNeeded: [],
			service: 0,
			employeeAssigned: 0
		};
		data.eventResults = [...data.eventResults, newEvent];
		data.employeeResults[newEvent.eventID] = [];
		data.equipmentResults[newEvent.eventID] = [];
		editModes[newEvent.eventID] = true;
	}

	let selectedDate;

	let staffSelections = {};
	let equipmentSelections = {};

	function prepareStaffSelected(eventID) {
		return (
			data.employeeResults[eventID]?.map((emp) => ({
				value: emp.employeeID,
				label: `${emp.employeeName}`
			})) ?? []
		);
	}

	function prepareEquipmentSelected(eventID) {
		return (
			data.equipmentResults[eventID]?.map((equip) => ({
				value: equip.equipmentID,
				label: equip.equipmentName
			})) ?? []
		);
	}

	onMount(() => {
		Object.keys(data.employeeResults).forEach((eventID) => {
			staffSelections[eventID] = prepareStaffSelected(eventID);
			equipmentSelections[eventID] = prepareEquipmentSelected(eventID);
		});
	});

	// Function to handle toggle between edit and save
	function handleEditSaveToggle(event, eventID) {
		editModes[eventID] = !editModes[eventID];
		if (editModes[eventID]) {
			// Going into edit mode, prevent form submission
			event.preventDefault();
		} else {
			// Saving changes, allow form submission
			// Here, you don't call preventDefault, and the form should submit
		}
	}
	// Prepare items for the select component for both staff and equipment
	let items = data.allEmployees.map((emp) => ({
		value: emp.id,
		label: emp.name
	}));
	let equipmentItems = data.allEquipment.map((equip) => ({
		value: equip.id,
		label: equip.name
	}));

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<style>
	.select-disabled {
    background-color: green;
    color: green;
	font-weight: bold;
}
.open-left {
		position: absolute;
		right: 100%; /* Align the right edge of the dropdown with the left edge of the button */
		top: 0; /* Align the top of the dropdown with the top of the button */
	}
</style>

<h2 class="text-4xl font-extrabold">Events</h2>
<div class="sticky top-4 z-50 flex items-center justify-between p-4">
	<button class="btn w-40" on:click={addNewEvent}> + Add Event </button>

	<details class="dropdown">
		<summary class="btn w-40">+ Filter</summary>
		<ul class="open-left menu dropdown-content z-[1] rounded-box bg-base-100 p-2 shadow">
			<form method="POST" action="?/pickdate" use:enhance>
				<DatePicker bind:value={selectedDate} />
				<input type="hidden" name="selectedDate" bind:value={selectedDate} />
			</form>
		</ul>
	</details>
</div>
<dialog bind:this={confirmationDelete} class="modal">
	<form method="post" action="?/delete">
		<input type="hidden" name="eventID" value={currentDeletingEvent} />
		<div class="modal-box">
			<h3 class="text-lg font-bold">Confirm Delete</h3>
			<p class="py-4">Are you sure you want to delete this event?</p>
			<div class="modal-action">
				<button type="submit" class="btn btn-error">Delete</button>
				<button type="button" class="btn" on:click={() => confirmationDelete.close()}>Cancel</button
				>
			</div>
		</div>
	</form>
</dialog>

<div class="flex flex-col space-y-4">
	{#each data.eventResults as event}
		<div class="collapse bg-base-200">
			<input type="checkbox" name="my-accordion-1" />
			<div class="collapse-title text-xl">
				<span class="font-medium">
					{formatTime(event.eventTime)}
					{formatDate(event.eventDate)}
				</span>
				{event.eventName} @ {event.eventVenue}
			</div>
			<div class="collapse-content">
				<div class="card bg-secondary">
					<div class="card-body bg-primary">
						<form method="post" action="?/update" use:enhance>
							<input type="text" hidden name="eventID" bind:value={event.eventID} />
							<input type="text" hidden name="eventDate" bind:value={event.eventDate} />
							<input type="text" hidden name="paymentID" bind:value={event.paymentID} />

							<input
								type="text"
								name="eventName"
								bind:value={event.eventName}
								readonly={!editModes[event.eventID]}
								class="{inputClasses(editModes[event.eventID])} w-full text-2xl font-bold"
							/>
							<br />
							<input
								type="text"
								name="clientName"
								bind:value={event.eventClientName}
								readonly={!editModes[event.eventID]}
								class="{inputClasses(editModes[event.eventID])} base w-full"
							/>

							<div class="flex w-full flex-col border-opacity-50">
								<div class="card grid rounded-box p-5">
									<div class="flex flex-row space-x-4">
										<div class="flex flex-col space-y-4">
											<h3 class="text-2xl font-bold">Date</h3>
											<h2>
												<DateInput
													bind:value={event.eventDate}
													disabled={!editModes[event.eventID]}
													format="MM/dd/yyyy"
												/>
											</h2>

											<h1 class="text-2xl font-bold">Time</h1>
											<h2>
												<input
													type="time"
													name="eventTime"
													bind:value={event.eventTime}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>

											<h1 class="text-2xl font-bold">Venue</h1>
											<h2>
												<input
													type="text"
													name="eventVenue"
													bind:value={event.eventVenue}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>
											<h1 class="text-2xl font-bold">Event Type</h1>
											<h2>
												<input
													type="text"
													name="eventType"
													bind:value={event.eventType}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>
										</div>
										<div class="flex flex-col space-y-4">
											<h1 class="text-2xl font-bold">Contact</h1>
											<h2>
												<input
													type="text"
													name="clientNum"
													bind:value={event.eventClientContact}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>

											<h1 class="text-2xl font-bold">Total</h1>
											<h2>
												<span>PHP</span>
												<input
													type="text"
													name="paymentCost"
													bind:value={event.paymentCost}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>
										</div>
										<div class="flex flex-col space-y-4">
											<h1 class="text-2xl font-bold">Staff Assigned</h1>

											<Select
												{items}
												multiple={true}
												name="employeesNeeded"
												bind:value={staffSelections[event.eventID]}
												placeholder="Select employees"
												disabled={!editModes[event.eventID]}
										containerStyles="background-color: transparent; color: black; opacity: 1; outline: none; border:none;"
												
												/>

											<h1 class="text-2xl font-bold">Payment Status</h1>
											<h2>
												<input
													type="text"
													name="paymentStatus"
													bind:value={event.paymentStatus}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/> <br />
											</h2>
										</div>
									</div>
									<div class="pt-6">
										<h1 class="text-2xl font-bold">Additional Request</h1>
										<h2>
											<input
												type="text"
												name="additionalReq"
												bind:value={event.additionalRequests}
												readonly={!editModes[event.eventID]}
												class={inputClasses(editModes[event.eventID])}
											/>
										</h2>
									</div>
									<div class="pt-6">
										<h1 class="text-2xl font-bold">Equipment Needed</h1>

										<Select
										items={equipmentItems}
										multiple={true}
										name="equipmentNeeded"
										bind:value={equipmentSelections[event.eventID]}
										placeholder="Select equipment"
										disabled={!editModes[event.eventID]}
										containerStyles="background-color: transparent; color: black; opacity: 1; outline: none; border:none;"
									/>
									
									
									</div>
								</div>

								<div class="card-actions flex w-full justify-between">
									<button
										type="submit"
										class="btn btn-primary flex-1"
										on:click={(e) => handleEditSaveToggle(e, event.eventID)}
									>
										{editModes[event.eventID] ? 'Save' : 'Edit'}
									</button>

									<button
										class="btn btn-error flex-1"
										on:click|preventDefault={() => promptDelete(event.eventID)}
									>
										Delete
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
