<script lang="ts">
	import { enhance } from '$app/forms';

	interface Event {
		eventID: string;
		paymentID: string;
		eventName: string;
		eventType: string;
		clientName: string;
		clientNum: string;
		eventDate: string;
		eventTime: string;
		eventVenue: string;
		packageType: string;
		addOn: string;
		staff1: string;
		staff2: string;
		staff3: string;
		staff4: string;
		equipNeeded: string;
		additionalReq: string;
		paymentStatus: string;

	}

	interface Data {
		data: Event[];
	}

	export let data: Data = { data: [] };

	function formatTime(time: string): string {
		const [hours, minutes] = time.split(':');
		const hour = parseInt(hours, 10);
		const suffix = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${suffix}`;
	}
	function formatDate(dateString: string): string {
		const date = new Date(dateString);

		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		};
		return date.toLocaleDateString('en-US', options);
	}

	let editModes = {};
	function handleEditSaveToggle(event, eventID) {
		if (editModes[eventID]) {
			editModes[eventID] = false;
		} else {
			event.preventDefault();
			editModes[eventID] = true;
		}
	}

	function getCurrentFormattedDate(): string {
		const date = new Date();
		return date.toISOString().split('T')[0]; // Splits the ISO string and takes only the date part.
	}

	function getCurrentFormattedTime(): string {
		const date = new Date();
		let hours = date.getHours().toString().padStart(2, '0'); // Formats hours to two digits
		let minutes = date.getMinutes().toString().padStart(2, '0'); // Formats minutes to two digits
		return `${hours}:${minutes}`;
	}
	function addNewEvent() {
		const newEvent: Event = {
			eventID: 'new' + Math.random().toString(16).slice(2), // Generate a pseudo-random ID
			paymentID: '',
			eventName: 'New Event',
			eventType: '',
			clientName: '',
			clientNum: '',
			eventDate: getCurrentFormattedDate(),
			eventTime: getCurrentFormattedTime(),
			eventVenue: 'New Venue',
			packageType: '',
			addOn: '',
			staff1: '',
			staff2: '',
			staff3: '',
			staff4: '',
			equipNeeded: '',
			additionalReq: '',
			paymentStatus: ''
		};
		data.data = [...data.data, newEvent];
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

<div class="flex flex-col space-y-4">
	{#each data.data as event}
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
								bind:value={event.clientName}
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
													type="text"
													name="eventDate"
													bind:value={event.eventDate}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>

											<h1>time</h1>
											<h2>
												<input
													type="text"
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
										</div>
										<div>
											<h1>contact</h1>
											<h2>
												<input
													type="text"
													name="clientNum"
													bind:value={event.clientNum}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>

											<h1>package</h1>
											<h2>
												<input
													type="text"
													name="packageType"
													bind:value={event.packageType}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>

											<h1>total</h1>
											<h2>
												<input
													type="text"
													name="paymentStatus"
													bind:value={event.paymentStatus}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>
										</div>
										<div>
											<h1>Staff Assigned</h1>
											{#if event.staff1}
												<h2>
													<input
														type="text"
														name="staff1"
														bind:value={event.staff1}
														readonly={!editModes[event.eventID]}
														class={inputClasses(editModes[event.eventID])}
													/>
												</h2>
											{/if}
											{#if event.staff2}
												<h2>
													<h2>
														<input
															type="text"
															name="staff2"
															bind:value={event.staff2}
															readonly={!editModes[event.eventID]}
															class={inputClasses(editModes[event.eventID])}
														/>
													</h2>
												</h2>
											{/if}
											{#if event.staff3}
												<h2>
													<input
														type="text"
														name="staff3"
														bind:value={event.staff3}
														readonly={!editModes[event.eventID]}
														class={inputClasses(editModes[event.eventID])}
													/>
												</h2>
											{/if}
											{#if event.staff4}
												<h2>
													<input
														type="text"
														name="staff4"
														bind:value={event.staff4}
														readonly={!editModes[event.eventID]}
														class={inputClasses(editModes[event.eventID])}
													/>
												</h2>
											{/if}

											<h1>Payment Status</h1>
											<h2>
												<input
													type="text"
													name="paymentStatus"
													bind:value={event.paymentStatus}
													readonly={!editModes[event.eventID]}
													class={inputClasses(editModes[event.eventID])}
												/>
											</h2>
										</div>
									</div>
									<div class="pt-6">
										<h1>specified requests</h1>
										<h2>
											<input
												type="text"
												name="additionalReq"
												bind:value={event.additionalReq}
												readonly={!editModes[event.eventID]}
												class={inputClasses(editModes[event.eventID])}
											/>
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
