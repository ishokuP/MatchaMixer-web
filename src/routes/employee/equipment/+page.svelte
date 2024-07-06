<script lang="ts">
	import { enhance } from '$app/forms';


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

	function inputClasses(isEditMode) {
		if (isEditMode) {
			return 'input input-bordered w-full';
		} else {
			return 'bg-transparent border-0 p-0 cursor-default text-base leading-normal';
		}
	}
</script>

<h2 class="text-4xl font-extrabold">Equipments</h2>


<div class="flex flex-wrap justify-center">
	{#each data.data as equipment}
		<div class="card mx-2.5 my-2.5 w-96 bg-base-100">
			<figure>
				<img
					src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
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
								<span>None</span>
							{/if}
						</div>
					</div>


				</form>
			</div>
		</div>
	{/each}
</div>
