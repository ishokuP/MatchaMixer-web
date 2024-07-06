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
<h2 class="text-4xl font-extrabold">Equipments</h2>

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

<div class="sticky top-4 z-50 p-4 ">
	<button class="btn w-40" on:click={addNewEvent}>
	  + Add Equipment
	</button>
  </div>
<div class="flex flex-wrap justify-center ">
	{#each data.data as equipment}
		<div class="card w-96 bg-base-100 mx-2.5 my-2.5">
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


</div>
