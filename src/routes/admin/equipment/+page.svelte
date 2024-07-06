<script lang="ts">
	import { enhance } from '$app/forms';

	interface Equipment {
		id: string;
		name: string;
		status: string;
		Econdition: string;
	}

	interface EquipmentData {
		data: Equipment[];
	}
	let editModes = {};

	function handleEditSaveToggle(event, equipID) {
		if (editModes[equipID]) {
			editModes[equipID] = false;
		} else {
			event.preventDefault();
			editModes[equipID] = true;
		}
	}
	function promptDelete(equipID) {
		currentDeletingEvent = equipID;
		confirmationDelete.showModal();
	}

	export let data: EquipmentData = { data: [] };

	function addNewEvent() {
		const newEquipment: Equipment = {
			id: 'new' + Math.random().toString(16).slice(2),
			name: '',
			status: '',
			Econdition: '',
		};
		data.data = [...data.data, newEquipment];
	}

	let confirmationDelete;
	let currentDeletingEvent = null;

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
			<p class="py-4">Are you sure you want to delete this Equipment?</p>
			<div class="modal-action">
				<button type="submit" class="btn btn-error">Delete</button>
				<button type="button" class="btn" on:click={() => confirmationDelete.close()}>Cancel</button
				>
			</div>
		</div>
	</form>
</dialog>

<!-- TODO fix spacing -->
<div class="flex flex-wrap justify-center space-x-10 space-y-3">
	{#each data.data as equipment}
		<div class="card w-96 bg-base-100">
			<figure>
				<img
					src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
					alt="Equipment"
				/>
			</figure>
			<div class="card-body">
				<form method="post" action="?/update" use:enhance>
					<h2 class="card-title">
						<input
							type="text"
							name="equipName"
							bind:value={equipment.name}
							readonly={!editModes[equipment.id]}
							class={inputClasses(editModes[equipment.id])}
							placeholder="Equipment Name"
						/>
					</h2>
					<p>
						<input
							type="text"
							name="equipStatus"
							bind:value={equipment.status}
							readonly={!editModes[equipment.id]}
							class={inputClasses(editModes[equipment.id])}
							placeholder="Equipment Status"
						/>
					</p>
					<p>
						<input
							type="text"
							name="equipCondition"
							bind:value={equipment.Econdition}
							readonly={!editModes[equipment.id]}
							class={inputClasses(editModes[equipment.id])}
							placeholder="Equipment Condition"
						/>
					</p>

					<div class="card-actions justify-end">
						<button
							type="submit"
							class="btn btn-primary flex-1"
							on:click={(e) => handleEditSaveToggle(e, equipment.id)}
						>
							{editModes[equipment.id] ? 'Save' : 'Edit'}
						</button>

						<button
							class="btn btn-error flex-1"
							on:click|preventDefault={() => promptDelete(equipment.id)}
						>
							Delete
						</button>
					</div>
				</form>
			</div>
		</div>
	{/each}

	<div class="card h-96 w-96 bg-base-100 shadow-xl">
		<button class="btn h-full w-full bg-base-200" on:click={addNewEvent}>
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
</div>
