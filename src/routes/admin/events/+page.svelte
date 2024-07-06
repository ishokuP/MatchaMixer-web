<script lang="ts">
	import { enhance } from '$app/forms';
	interface Event {
		eventID: number;
		eventName: string;
		eventDate: string; // Date of the event
		eventTime: string; // Time of the event
		eventClientName: string; // Name of the client hosting the event
		eventClientContact: string; // Contact information for the client
		eventVenue: string; // Venue where the event is held
		eventType: string; // Type of the event (e.g., Wedding, Corporate)
		equipmentNeeded: string[]; // List of equipment needed for the event
		paymentID: string; // Associated payment ID
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
	};

	// console.log(data.employeeResults);

	function formatTime(time: string): string {
		const [hours, minutes] = time.split(':');
		const hour = parseInt(hours, 10);
		const suffix = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${suffix}`;
	}
	let editModes = {};
	let dropdownValues = {};

	function handleEditSaveToggle(event, eventID) {
		event.preventDefault();
		editModes[eventID] = !editModes[eventID];
		if (!dropdownValues[eventID]) {
			dropdownValues[eventID] = new Array(4).fill('');
			data.employeeResults[eventID].forEach((emp, index) => {
				if (index < 4) dropdownValues[eventID][index] = emp.employeeName;
			});
		}
	}

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
			eventDate: new Date().toISOString().split('T')[0],
			eventTime: '12:00:00',
			eventClientName: '',
			eventClientContact: '',
			eventVenue: '',
			eventType: '',
			paymentID: '',
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
</script>

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

<h1>Date</h1>
<br />
<input type="date" />

<div class="flex flex-col space-y-4">
	{#each data.eventResults as event}
		<div class="collapse bg-base-200">
			<input type="checkbox" name="my-accordion-1" />
			<div class="collapse-title text-xl">
				<span class="font-medium">
					{formatTime(event.eventTime)}
				</span>
				{event.eventName} @ {event.eventVenue}
			</div>
			<div class="collapse-content">
				<div class="card bg-neutral text-neutral-content">
					<div class="card-body">
						<form method="post" action="?/update" use:enhance>
							<input type="text" hidden name="eventID" bind:value={event.eventID} />
							<input type="text" hidden name="eventDate" bind:value={event.eventDate} />
							<input type="text" hidden name="employeeNames" bind:value={event.paymentID} />

							<input
								type="text"
								name="eventName"
								bind:value={event.eventName}
								readonly={!editModes[event.eventID]}
								class={inputClasses(editModes[event.eventID])}
							/>
							<br />
							<input
								type="text"
								name="clientName"
								bind:value={event.eventClientName}
								readonly={!editModes[event.eventID]}
								class={inputClasses(editModes[event.eventID])}
							/>

							<div class="flex w-full flex-col border-opacity-50">
								<div class="card grid rounded-box p-5">
									<div class="flex flex-row space-x-4">
										<div>
											<h1>date</h1>
											<h2>
												<input
													type="date"
													name="eventDate"
													class="input input-bordered w-full"
													bind:value={event.eventDate}
												/>
											</h2>

											<h1>time</h1>
											<h2>
												<input
													type="time"
													name="eventTime"
													bind:value={event.eventTime}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>

											<h1>venue</h1>
											<h2>
												<input
													type="text"
													name="eventVenue"
													bind:value={event.eventVenue}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>
											<h1>Event Type</h1>
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
										<div>
											<h1>contact</h1>
											<h2>
												<input
													type="text"
													name="clientNum"
													bind:value={event.eventClientContact}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>

											<h1>total</h1>
											<h2>
												<span>PHP</span>
												<input
													type="text"
													name="paymentStatus"
													bind:value={event.paymentCost}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>
										</div>
										<div>
											<!-- Other form fields -->
											<h1>Staff Assigned</h1>

											{#each data.eventResults as event}
												<select name="employees" class="select w-full max-w-xs">
													<option disabled value="">Select an employee</option>
													{#each data.allEmployees as allEmployee}
														<option value={allEmployee.name}>
															{allEmployee.name}
														</option>
													{/each}
												</select>
											{/each}

											<h1>Payment Status</h1>
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
										<h1>Additional Request</h1>
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
										<h1>Equipment Needed</h1>
										<h2>
											{#each data.equipmentResults[event.eventID] as equipment}
												<input
													type="text"
													name="equipNeeded"
													bind:value={equipment.equipmentName}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											{/each}
										</h2>
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
	<button class="btn bg-base-200" on:click={addNewEvent}>
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
		Add Event
	</button>
</div>
