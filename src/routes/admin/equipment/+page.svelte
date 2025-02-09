<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	interface Equipment {
		id: string;
		name: string;
		status: string;
		Econdition: string;
		AssignedEvents: string;
		imagePath: string;
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
			return 'input input-bordered w-full edit-mode';
		} else {
			return 'input input-bordered read-only';
		}
	}
</script>

<!-- <h2 class="text-4xl font-extrabold">Equipments</h2> -->

<dialog bind:this={confirmationDelete} class="modal">
	<form method="post" action="?/delete">
		<input type="hidden" name="equipID" value={currentDeletingEvent} />
		<div class="modal-box">
			<h3 class="text-lg font-bold">Confirm Delete</h3>
			<p class="py-4">Are you sure you want to delete this Equipment?</p>
			<div class="modal-action">
				<button type="submit" class="btn btn-error on:click={() => confirmationDelete.close()}">Delete</button>
				<button type="button" class="btn" on:click={() => confirmationDelete.close()}>Cancel</button
				>
			</div>
		</div>
	</form>
</dialog>

<dialog bind:this={confirmationAdd} class="modal">
	<form method="post" action="?/update" use:enhance enctype="multipart/form-data">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Add New Equipment</h3>
			<div class="py-4">
				<!-- Equipment Name -->
				<label class="block mb-3 text-xl font-extrabold">
					Name:
					<input
						type="text"
						bind:value={newEquipment.name}
						class="input input-bordered name mt-1"
						placeholder="Enter equipment name"
						name="equipName"
						required
					/>
				</label>

				<!-- Equipment Status Dropdown -->
				<label class="block mb-3 text-xl font-extrabold">
					Status:
					<select
						bind:value={newEquipment.status}
						class="select select-bordered w-full mt-1"
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
				<label class="block mb-3 text-xl font-extrabold">
					Condition:
					<select
						bind:value={newEquipment.Econdition}
						class="select select-bordered w-full mt-1"
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

				<!-- Image Upload -->
				<label class="block mb-3 text-xl font-extrabold">
					Upload Image:
					<input
						type="file"
						accept="image/*"
						class="file-input file-input-bordered w-full mt-1"
						name="equipImage"
					/>
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

<div class="p-4 mt-4">
	<button class="btn w-40" on:click={() => confirmationAdd.showModal()}> + Add Equipment </button>
</div>

<div class="flex flex-wrap justify-center gap-20 mt-4">
	{#each data.data as equipment}
		<div class="card mx-2.5 my-2.5 w-96 bg-base-100">
			<figure>
				<img
					src={equipment.imagePath
						? equipment.imagePath
						: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'}
					alt="Equipment"
				/>
			</figure>
			<div class="card-body bg-base-200">
				<form method="post" action="?/update" use:enhance>
					<input type="text" hidden name="equipID" bind:value={equipment.id} />
					<div class="p-5">
						<div>
							<h2 class="card-title">
								<input
									type="text"
									name="equipName"
									bind:value={equipment.name}
									readonly={!editModes[equipment.id]}
									class="{inputClasses(editModes[equipment.id])} text-center w-full"
									placeholder="Equipment Name"
									style="font-size: 2rem; font-weight: 700;"
								/>
							</h2>
						</div>
						<div>
							<p class="text-xl font-bold"><b>Status</b></p>


							{#if editModes[equipment.id]}
								<select
									name="equipStatus"
									bind:value={equipment.status}
									disabled={!editModes[equipment.id]}
									class={inputClasses(editModes[equipment.id])}
									placeholder="Equipment Status"
								>
									<option value="In-Studio">In-Studio</option>
									<option value="Deployed">Deployed</option>
									<option value="For Repair">For Repair</option>
									<option value="For Replacement">For Replacement</option>
									<option value="For Testing">For Testing</option>
									<option value="Lost">Lost</option>
									<option value="Retired">Retired</option>
								</select>
							{:else}
								<input
									type="text"
									name="equipStatus"
									bind:value={equipment.status}
									readonly={!editModes[equipment.id]}
									class={inputClasses(editModes[equipment.id])}
									placeholder="Equipment Status"
								/>
							{/if}

						</div>
						<div>
							<p class="text-xl font-bold"><b>Condition</b></p>

							{#if editModes[equipment.id]}
								<select
									name="equipCondition"
									bind:value={equipment.Econdition}
									disabled={!editModes[equipment.id]}
									class={inputClasses(editModes[equipment.id])}
									placeholder="Equipment Condition"
								>
									<option value="Good-to-Go">Good-to-Go</option>
									<option value="Requires Cleaning">Requires Cleaning</option>
									<option value="Minor Damage">Minor Damage</option>
									<option value="Needs Repair">Needs Repair</option>
									<option value="End-of-Life">End-of-Life</option>
									<option value="Under Inspection">Under Inspection</option>
								</select>
							{:else}
								<input
									type="text"
									name="equipCondition"
									bind:value={equipment.Econdition}
									readonly={!editModes[equipment.id]}
									class={inputClasses(editModes[equipment.id])}
									placeholder="Equipment Condition"
								/>
							{/if}
						</div>

						<div>
							<span class="text-xl font-extrabold">Assigned Events:</span>
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

<style>
	.equipment {
		display: flex;
	}

	.card-body {
		border-radius: 0rem 0rem 1rem 1rem;
		box-shadow:
		0px 8px 8px 0.1px rgba(0, 0, 0, 0.2),
			8px 0px 8px 0.1px rgba(0, 0, 0, 0.2),
			-8px 0px 8px 0.1px rgba(0, 0, 0, 0.2);
	}

	.card-title {
		margin-top: -1.5rem;
		margin-bottom: 1.5rem;
		padding: none !important;
	}

	.select-disabled {
		background-color: green;
		color: green;
		font-weight: bold;
	}

	input {
		background-color: transparent;
		font-size: 1.125rem;
		font-weight: 600;
		padding: 0.5rem;
		border: solid 1px;
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

	input {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	select {
		border: 1px solid !important;
		font-size: 1.125rem;
		font-weight: 600;
		padding: 0.5rem;
		width: 100%;
		outline: none;
	}

	.name {
		border: 1px solid;
		border-radius: 0.5rem;
	}

	figure {
		box-shadow:
			0px 8px 8px 0.1px rgba(0, 0, 0, 0.2),
			8px 0px 8px 0.1px rgba(0, 0, 0, 0.2),
			-8px 0px 8px 0.1px rgba(0, 0, 0, 0.2),
			0px -8px 8px 0.1px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		display: inline-block;
	}

	figure img {
		width: 100%;
		height: 300px;
		object-fit: cover;
	}

	.card-title {
		text-align: center;
		width: 100%;
	}
</style>
