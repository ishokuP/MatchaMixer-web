<script lang="ts">
	import { enhance } from '$app/forms';
	import Select from 'svelte-select';
	import { onMount } from 'svelte';
	let startDate = null;
	let endDate = null;

	function formatDate2(date) {
		return date ? date.toLocaleDateString('en-US') : 'None';
	}
	interface Event {
		eventID: number;
		eventName: string;
		eventStart: Date; // Date of the event
		eventEnd: Date; // Date of the event
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
	interface allServicesOriginal {
		id: number;
		name: number;
	}

	interface Equipment {
		equipmentID: string;
		equipmentName: string;
		equipmentStatus: string;
		equipmentCondition: string;
	}
	interface Services {
		serviceID: string;
		serviceName: string;
		servicePrice: string;
		serviceInclusion: string;
		serviceRate: string;
		serviceimage: string;
	}

	export let data: {
		eventResults: Event[];
		employeeResults: { [key: number]: Employee[] };
		equipmentResults: { [key: number]: Equipment[] };
		serviceResults: { [key: number]: Services[] };
		allEmployees: allEmployOriginal[];
		allEquipment: allEquipOriginal[];
		allServices: allServicesOriginal[];
	};

	// console.log(data.serviceResults);

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
			return 'input input-bordered w-full edit-mode'; // Apply the edit-mode class
		} else {
			return 'input read-only'; // Apply the read-only class
		}
	}

	function addNewEvent() {
		const newEvent: Event = {
			eventID: Math.floor(Math.random() * 100000),
			eventName: 'New Event',
			eventStart: new Date(),
			eventEnd: new Date(),
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
	let servicesSelections = {};

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

	function prepareServiceSelected(eventID) {
		return (
			data.serviceResults[eventID]?.map((service) => ({
				value: service.serviceID,
				label: service.serviceName
			})) ?? []
		);
	}

	onMount(() => {
		Object.keys(data.employeeResults).forEach((eventID) => {
			staffSelections[eventID] = prepareStaffSelected(eventID);
			equipmentSelections[eventID] = prepareEquipmentSelected(eventID);
			servicesSelections[eventID] = prepareServiceSelected(eventID);
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

	let serviceItems = data.allServices.map((serv) => ({
		value: serv.id,
		label: serv.name
	}));

	function formatDateTime(date: Date): string {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true // You can set this to false for 24-hour format
		};
		return date.toLocaleString('en-US', options);
	}
	function formatDateForInput(date: Date): string {
		return date.toISOString().slice(0, 16);
	}
</script>


<div class="flex flex-col space-y-4">
	{#each data.eventResults as event}
		<div class="collapse bg-base-200">
			<input type="checkbox" name="my-accordion-1" />
			<div class="collapse-title text-xl">
				<span class="font-medium">{formatDateTime(new Date(event.eventStart))}</span>
				{event.eventName} @ {event.eventVenue}
			</div>
			<div class="collapse-content">
				<form method="post" action="?/update" use:enhance>
					<input type="text" hidden name="eventID" bind:value={event.eventID} />
					<input type="text" hidden name="paymentID" bind:value={event.paymentID} />
					<div class="grid grid-cols-1 gap-4 rounded-lg bg-secondary p-4">
						<!-- Event Name (Full row, first row) -->
						<input
							type="text"
							name="eventName"
							bind:value={event.eventName}
							readonly={!editModes[event.eventID]}
							class="{inputClasses(editModes[event.eventID])} base w-full mb-4"
							placeholder="Event Name"
							style="font-size: 2rem; font-weight: 700; "
						/>

						<!-- Client Name (Full row, second row) -->
						<input
							type="text"
							name="clientName"
							bind:value={event.eventClientName}
							readonly={!editModes[event.eventID]}
							class="{inputClasses(editModes[event.eventID])} base w-full"
							placeholder="Client Name"
							style="font-size: 1.5rem; font-weight: 600; margin-top: -1rem; height: 2rem"
						/>
					</div>

					<!-- Other fields in multi-column layout -->
					<div class="grid grid-cols-3 gap-4 rounded-lg bg-secondary p-4">
						<!-- Date - Start Date -->
						<div>
							<label for="eventStart" class="block text-xl font-bold">Start Date</label>
							<input
								type="datetime-local"
								name="eventStart"
								bind:value={event.eventStart}
								readonly={!editModes[event.eventID]}
							/>
						</div>

						<!-- End Date -->
						<div>
							<label for="eventEnd" class="block text-xl font-bold">End Date</label>
							<input
								type="datetime-local"
								name="eventEnd"
								bind:value={event.eventEnd}
								readonly={!editModes[event.eventID]}
							/>
						</div>

						<div></div>

						<!-- Venue -->
						<div>
							<h1 class="font-bold">Venue</h1>
							<input
								type="text"
								name="eventVenue"
								bind:value={event.eventVenue}
								readonly={!editModes[event.eventID]}
								class={inputClasses(editModes[event.eventID])}
							/>
						</div>

						<!-- Event Type -->
						<div>
							<h1 class="font-bold">Event Type</h1>
							<input
								type="text"
								name="eventType"
								bind:value={event.eventType}
								readonly={!editModes[event.eventID]}
								class={inputClasses(editModes[event.eventID])}
							/>
						</div>

						<div></div>

						<!-- Contact -->
						<div>
							<h1 class="font-bold">Contact</h1>
							<input
								type="text"
								name="clientNum"
								bind:value={event.eventClientContact}
								readonly={!editModes[event.eventID]}
								class={inputClasses(editModes[event.eventID])}
							/>
						</div>

						<!-- Total PHP -->
						<div>
							<h1 class="font-bold">Total PHP</h1>
							<input
								type="text"
								name="paymentCost"
								bind:value={event.paymentCost}
								readonly
								class={inputClasses(editModes[event.eventID])}
							/>
						</div>

						<div>
							<h1 class="font-bold">Payment Status</h1>
							{#if editModes[event.eventID]}
								<select
									name="paymentStatus"
									bind:value={event.paymentStatus}
									class={inputClasses(true)}
									style="background-color: transparent; opacity: 1; outline: none;"
								>
									<option value="Pending">Pending</option>
									<option value="Paid">Paid</option>
								</select>
							{:else}
								<input
									type="text"
									name="paymentStatus"
									bind:value={event.paymentStatus}
									readonly
									class={inputClasses(false)}
								/>
							{/if}
						</div>

						<!-- Staff Assigned -->
						<div class="col-span-3">
							<h1 class="font-bold">Staff Assigned</h1>
							<Select
								{items}
								multiple={true}
								name="employeesNeeded"
								bind:value={staffSelections[event.eventID]}
								placeholder="Select employees"
								disabled={!editModes[event.eventID]}
								containerStyles="background-color: transparent; color: black; opacity: 1; outline: none; border:none;"
							/>
						</div>

						<!-- Equipment Needed -->
						<div class="col-span-3">
							<h1 class="font-bold">Equipment Needed</h1>
							<Select
								items={equipmentItems}
								multiple={true}
								name="equipmentNeeded"
								bind:value={equipmentSelections[event.eventID]}
								placeholder="Select equipment"
								disabled={!editModes[event.eventID]}
								containerStyles="background: #ebedef00 !important; color: black; opacity: 1; outline: none; border:none;"
							/>
						</div>

						<div class="col-span-3">
							<h1 class="font-bold">Services Included</h1>
							<Select
								items={serviceItems}
								multiple={true}
								name="servicesNeeded"
								bind:value={servicesSelections[event.eventID]}
								placeholder="Select services"
								disabled={!editModes[event.eventID]}
								containerStyles="background: #ebedef00 !important; color: black; opacity: 1; outline: none; border:none;"
							/>
						</div>

						<!-- Additional Request -->
						<div class="col-span-3">
							<h1 class="font-bold">Additional Request</h1>
							<input
								type="text"
								name="additionalReq"
								bind:value={event.additionalRequests}
								readonly={!editModes[event.eventID]}
								class={inputClasses(editModes[event.eventID])}
							/>
						</div>
					</div>


				</form>
			</div>
		</div>
	{/each}
</div>

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
	/* Ensure the date input has a visible background and icon */
	input[type='datetime-local'] {
		/* White background for the input */
		font-size: 1rem; /* Font size */
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid; /* Border color */
	}

	/* Style the date icon (for Webkit browsers) */
	input[type='datetime-local']::-webkit-calendar-picker-indicator {
		background-color: #4caf50; /* Example color for the icon */
		color: white; /* Ensure the icon itself has a contrasting color */
	}

	/* For Firefox */
	input[type='datetime-local']::-moz-calendar-picker-indicator {
		background-color: #4caf50; /* Example color for the icon */
		color: white; /* Ensure the icon itself has a contrasting color */
	}
	input {
		background-color: transparent;
		font-size: 1.125rem;
		font-weight: 600;
		padding: 0.5rem;
		border: none;
		width: 100%;
	}

	input[readonly] {
		background-color: transparent;
		cursor: default;
		border: none;
	}

	input.edit-mode {
		border: 1px solid;
	}

	h1,
	label {
		font-weight: 900;
		font-size: 20px;
	}

	select {
		border: 1px solid !important;
		font-size: 1.125rem;
		font-weight: 600;
		padding: 0.5rem;
		width: 100%;
		background-color: transparent;
		outline: none;
	}

	.collapse-title {
		background: oklch(33.4052% 0.059945 126.98602 / 1);
		color: white;
	}
</style>
