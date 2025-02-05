<script lang="ts">
	import { enhance } from '$app/forms';
	import Select from 'svelte-select';
	import { onMount } from 'svelte';

	interface services {
		id: number;
		name: string;
		price: number;
		inclusion: string;
		rate: string;
		imagepath: string | null;
	}
	interface Equipment {
		equipmentID: string;
		equipmentName: string;
		equipmentStatus: string;
		equipmentCondition: string;
	}

	interface allEquipOriginal {
		id: number;
		name: number;
	}

	interface servicesdata {
		data: services[];
	}

	export let data: {
		data: services[];
		allEquipment: allEquipOriginal[];
		equipmentResults: { [key: number]: Equipment[] };
	};

	let equipmentSelections = {};

	console.log(data);

	let modalOpenState: Record<number, boolean> = {};
	let addServiceModalOpen = false;
	let newService: services = {
		id: Math.floor(Math.random() * 100000),
		name: '',
		price: 0,
		inclusion: '',
		rate: '',
		imagepath: null
	};

	function toggleModal(serviceid) {
		modalOpenState[serviceid] = !modalOpenState[serviceid];
	}

	function toggleAddServiceModal() {
		addServiceModalOpen = !addServiceModalOpen;
	}

	// Whenever new data is added, ensure we have a modal state for each employee
	$: data.data.forEach((service) => {
		if (!(service.id in modalOpenState)) {
			modalOpenState[service.id] = false;
		}
	});

	let equipmentItems = data.allEquipment.map((equip) => ({
		value: equip.id,
		label: equip.name
	}));

	function prepareEquipmentSelected(eventID) {
		return (
			data.equipmentResults[eventID]?.map((equip) => ({
				value: equip.equipmentID,
				label: equip.equipmentName
			})) ?? []
		);
	}

	onMount(() => {
		Object.keys(data.equipmentResults).forEach((serviceID) => {
			equipmentSelections[serviceID] = prepareEquipmentSelected(serviceID);
		});
	});
</script>

<!-- TODO add if else logic to the image, equipment if possible grab it from the equipment thing?  -->
<!-- <h2 class="text-4xl font-extrabold">Services</h2> -->
<div class="p-4 mt-4">
	<button class="btn w-40" on:click={toggleAddServiceModal}> + Add Service </button>
</div>

<!-- Add Service Modal -->
<div class="modal" class:modal-open={addServiceModalOpen}>
	<div class="modal-box">
		<h2 class="text-2xl font-bold">Add New Service</h2>
		<form
			method="post"
			action="?/update"
			enctype="multipart/form-data"
			use:enhance
			class="space-y-2"
		>
			<input type="hidden" name="serviceID" bind:value={newService.id} />
			<label for="serviceName" class="block font-bold">Name</label>
			<input
				id="serviceName"
				type="text"
				name="serviceName"
				class="input input-bordered w-full"
				bind:value={newService.name}
			/>

			<label for="servicePrice" class="block font-bold">Price</label>
			<input
				id="servicePrice"
				type="number"
				name="servicePrice"
				class="input input-bordered w-full"
				bind:value={newService.price}
			/>

			<label for="serviceRate" class="block font-bold">Rate</label>
			<select
				id="serviceRate"
				name="serviceRate"
				class="select select-bordered w-full"
				bind:value={newService.rate}
			>
				<option value="hourly">Hourly</option>
				<option value="daily">Daily</option>
			</select>

			<label for="serviceInclusion" class="block font-bold">Inclusions</label>
			<input
				id="serviceInclusion"
				type="text"
				name="serviceInclusion"
				class="input input-bordered w-full"
				bind:value={newService.inclusion}
			/>

			<div class="col-span-3">
				<h1 class="font-bold">Equipment Needed</h1>

				<Select
					items={equipmentItems}
					multiple={true}
					name="equipmentNeeded"
					bind:value={equipmentSelections[newService.id]}
					placeholder="Select equipment"
					containerStyles="background: #ebedef00 !important; color: black; opacity: 1; outline: none; border:none;"
				/>
			</div>

			<label class="block mb-2">
				Upload Image:
				<input
					type="file"
					accept="image/*"
					class="file-input file-input-bordered w-full"
					name="serviceImage"
				/>
			</label>

			<div class="modal-action flex w-full justify-between">
				<button class="btn btn-primary" type="submit" on:click={toggleAddServiceModal}
					>Add Service</button
				>
				<button type="button" class="btn btn-error" on:click={toggleAddServiceModal}>Close</button>
			</div>
		</form>
	</div>
</div>

<div class="flex flex-wrap">
	{#each data.data as service}
		<div class=" mx-2.5 my-2.5 w-full self-auto p-2">
			<div class="card bg-base-100 shadow-xl lg:card-side">
				<figure>
					<img
						src={service.imagepath
							? service.imagepath
							: 'https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp'}
						alt="serviceImage"
						class="h-400 w-400 object-none"
					/>

					<!-- debug stuff ignore  -->
					<!-- <img
					src={service.imagepath}
						alt="serviceImage"
						class="h-full w-full"
					/> -->
				</figure>
				<div class="card-body w-full">
					<h3 class="card-title text-3xl font-bold">{service.name}</h3>

					<h6 class="text-lg font-bold">Price</h6>
					<p>{service.price}</p>

					<h6 class="text-lg font-bold">Rate</h6>
					<p>{service.rate}</p>

					<h6 class="text-lg font-bold">Inclusions</h6>
					<p>{service.inclusion}</p>

					<h6 class="text-lg font-bold">Equipment Needed</h6>
					<Select
						items={equipmentItems}
						multiple={true}
						name="equipmentNeeded"
						disabled
						bind:value={equipmentSelections[service.id]}
						placeholder="Select equipment"
						containerStyles="background: #ebedef00 !important; color: black; opacity: 1; outline: none; border:none;"
					/>

					<div class="card-actions justify-end">
						<form method="post" action="?/update" use:enhance>
							<div class="modal" class:modal-open={modalOpenState[service.id]}>
								<div class="modal-box">
									<div>
										<h6 class="text-lg font-bold">ID</h6>

										<h2>
											<input
												type="text"
												name="serviceID"
												class="input input-bordered w-full max-w-xs"
												bind:value={service.id}
												readonly
											/>
										</h2>
										<br />
									</div>
									<div class="flex space-x-4">
										<div>
											<h6 class="text-lg font-bold">Name</h6>
											<h2>
												<input
													type="text"
													name="serviceName"
													class="input input-bordered w-full max-w-xs"
													bind:value={service.name}
												/>
											</h2>
										</div>

										<div>
											<h6 class="text-lg font-bold">Price</h6>
											<h2>
												<input
													type="text"
													name="servicePrice"
													class="input input-bordered w-full max-w-xs"
													bind:value={service.price}
												/>
											</h2>

											<h6 class="text-lg font-bold">Rate</h6>
											<select
												name="serviceRate"
												class="select select-bordered w-full max-w-xs"
												bind:value={service.rate}
											>
												<option value="Hourly">Hourly</option>
												<option value="Daily">Daily</option>
											</select>
										</div>
									</div>
									<br />
									<div>
										<h6 class="text-lg font-bold">Inclusion</h6>
										<h2>
											<input
												type="text"
												name="serviceInclusion"
												class="input input-bordered w-full"
												bind:value={service.inclusion}
											/>
										</h2>
									</div>
									<div>
										<h6 class="text-lg font-bold">Equipment Needed</h6>
										<Select
											items={equipmentItems}
											multiple={true}
											name="equipmentNeeded"
											bind:value={equipmentSelections[newService.id]}
											placeholder="Select equipment"
											containerStyles="background: #ebedef00 !important; color: black; opacity: 1; outline: none; border:none;"
										/>
									</div>
									<br /><br />
									<div class="modal-action flex w-full justify-between">
										<button
											class="btn btn-primary"
											on:click={() => toggleModal(service.id)}
											formaction="?/delete">Delete</button
										>
										<div class="flex space-x-4">
											<button class="btn btn-primary" on:click={() => toggleModal(service.id)}
												>Save Changes</button
											>
											<button
												type="button"
												class="btn btn-error"
												on:click={() => toggleModal(service.id)}>Close</button
											>
										</div>
									</div>
								</div>
							</div>
						</form>
						<button class="modal-button btn btn-primary" on:click={() => toggleModal(service.id)}
							>Details</button
						>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
