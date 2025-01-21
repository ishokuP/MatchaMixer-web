<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	interface Equipment {
		id: string;
		name: string;
		status: string;
		Econdition: string;
		AssignedEvents: string;
	}

	interface EquipmentData {
		data: Equipment[];
	}

	export let data: EquipmentData = { data: [] };
	let editModes = {};
	let currentDeletingEvent = null;
	let confirmationDelete;
	let confirmationAdd; // Bind the dialog element
	let newEquipment = {
		id: '',
		name: '',
		status: '',
		Econdition: '',
		AssignedEvents: ''
	};

	const closeModal = () => {
		confirmationAdd.close();
	};

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
	<form method="post" action="?/delete" use:enhance>
		<input type="hidden" name="equipID" value={currentDeletingEvent} />
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

<dialog bind:this={confirmationAdd} class="modal">
	<form method="post" action="?/update" use:enhance>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Add New Equipment</h3>
			<div class="py-4">
				<!-- Equipment Name -->
				<label class="block mb-2">
					Name:
					<input
						type="text"
						bind:value={newEquipment.name}
						class="input input-bordered w-full"
						placeholder="Enter equipment name"
						name="equipName"
						required
					/>
				</label>

				<!-- Equipment Status Dropdown -->
				<label class="block mb-2">
					Status:
					<select
						bind:value={newEquipment.status}
						class="select select-bordered w-full"
						required
						name="equipStatus"
					>
						<option value="In-Studio">In-Studio</option>
						<option value="Deployed">Deployed</option>
						<option value="For Repair">For Repair</option>
						<option value="For Replacement">For Replacement</option>
						<option value="For Testing">For Testing</option>
						<option value="Lost">Lost</option>
						<option value="Retired">Retired</option>
					</select>
				</label>

				<!-- Equipment Condition Dropdown -->
				<label class="block mb-2">
					Condition:
					<select
						bind:value={newEquipment.Econdition}
						class="select select-bordered w-full"
						required
						name="equipCondition"
					>
						<option value="Good-to-Go">Good-to-Go</option>
						<option value="Requires Cleaning">Requires Cleaning</option>
						<option value="Minor Damage">Minor Damage</option>
						<option value="Needs Repair">Needs Repair</option>
						<option value="End-of-Life">End-of-Life</option>
						<option value="Under Inspection">Under Inspection</option>
					</select>
				</label>
			</div>
			<div class="modal-action">
				<button type="submit" class="btn btn-success" on:click={() => confirmationAdd.close()}
					>Add Equipment</button
				>
				<button type="button" class="btn" on:click={() => confirmationAdd.close()}> Cancel </button>
			</div>
		</div>
	</form>
</dialog>

<div class="sticky top-4 z-50 p-4">
	<button class="btn w-40" on:click={() => confirmationAdd.showModal()}> + Add Equipment </button>
</div>

<div class="flex flex-wrap justify-center">
	{#each data.data as equipment}
		<div class="card mx-2.5 my-2.5 w-96 bg-base-100">
			<figure>
				<img
					src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
					alt="Equipment"
				/>
			</figure>
			<div class="card-body">
				<form method="post" action="?/update" use:enhance>
					<input type="text" hidden name="equipID" bind:value={equipment.id} />
					<div class="p-5">
						<div>
							<h2 class="card-title text-xl font-bold">
								<input
									type="text"
									name="equipName"
									bind:value={equipment.name}
									readonly={!editModes[equipment.id]}
									class="{inputClasses(editModes[equipment.id])} text-xl font-bold"
									placeholder="Equipment Name"
								/>
							</h2>
						</div>
						<div>
							<p><b>Status</b></p>
							<input
								type="text"
								name="equipStatus"
								bind:value={equipment.status}
								readonly={!editModes[equipment.id]}
								class={inputClasses(editModes[equipment.id])}
								placeholder="Equipment Status"
							/>
						</div>
						<div>
							<p><b>Condition</b></p>
							<input
								type="text"
								name="equipCondition"
								bind:value={equipment.Econdition}
								readonly={!editModes[equipment.id]}
								class={inputClasses(editModes[equipment.id])}
								placeholder="Equipment Condition"
							/>
						</div>

						<div>
							<span class="font-bold">Assigned Events:</span>
							{#if equipment.AssignedEvents.length > 0}
								<ul>
									{#each equipment.AssignedEvents as event}
										<li>{event}</li>
									{/each}
								</ul>
							{:else}
								<br /><span>None</span>
							{/if}
						</div>
					</div>

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
