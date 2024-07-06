<script lang="ts">
	import { enhance } from '$app/forms';

	interface services {
		id: string;
		name: string;
		type: string;
		price: string;
		inclusion: string;
		rate: number;
	}

	interface servicesdata {
		data: services[];
	}

	export let data: servicesdata = { data: [] };

	function addNewEvent() {
		const newService: services = {
			id: 'new' + Math.random().toString(16).slice(2),
			name: '',
			type: '',
			price: '',
			inclusion: '',
			rate: 0
		};
		data.data = [...data.data, newService];
	}

	let modalOpenState = {};

	function toggleModal(serviceid) {
		modalOpenState[serviceid] = !modalOpenState[serviceid];
	}

	// Whenever new data is added, ensure we have a modal state for each employee
	$: data.data.forEach((service) => {
		if (!(service.id in modalOpenState)) {
			modalOpenState[service.id] = false;
		}
	});
</script>

<h1>services</h1>

<div class="flex flex-wrap">
	{#each data.data as service}
		<div class="w-1/2 self-auto p-2">
			<div class="card bg-base-100 shadow-xl lg:card-side">
				<figure>
					<img
						class="h-full w-full"
						src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
						alt="Album"
					/>
				</figure>
				<div class="card-body w-full">
					<h2 class="card-title">{service.name}</h2>
					<p>{service.type}</p>
					<p>{service.price}</p>
					<p>{service.inclusion}</p>
					<p>{service.rate}</p>
					<div class="card-actions justify-end">
						<form method="post" action="?/update" use:enhance>
							<div class="modal" class:modal-open={modalOpenState[service.id]}>
								<div class="modal-box">
									<div>
										<h1>ID</h1>
										<h2>
											<input type="text" name="serviceID" bind:value={service.id} readonly />
										</h2>
									</div>
									<div class="flex flex-wrap space-x-4">
										<div>
											<h1>Name</h1>
											<h2>
												<input type="text" name="serviceName" bind:value={service.name} />
											</h2>
										</div>
										<div>
											<h1>type</h1>
											<h2>
												<input type="text" name="serviceType" bind:value={service.type} />
											</h2>
										</div>
										<div>
											<h1>price</h1>
											<h2>
												<input type="text" name="servicePrice" bind:value={service.price} />
											</h2>
										</div>
										<div>
											<h1>inclusion</h1>
											<h2>
												<input type="text" name="serviceInclusion" bind:value={service.inclusion} />
											</h2>
										</div>
										<div>
											<h1>rate</h1>
											<h2>
												<input type="text" name="serviceRate" bind:value={service.rate} />
											</h2>
										</div>
									</div>

									<div class="modal-action flex w-full justify-between">
										<button class="btn btn-primary" on:click={() => toggleModal(service.id)} formaction="?/delete"
											>Delete</button
										>
										<div class="flex space-x-4">
											<button class="btn btn-primary" on:click={() => toggleModal(service.id)}
												>Save Changes</button
											>
											<button class="btn btn-error" on:click={() => toggleModal(service.id)}
												>Close</button
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
	<div class="h-1/2 w-1/2 self-auto p-2">
		<div class="card bg-base-100 shadow-xl lg:card-side">
			<button class="btn h-full w-full bg-base-200" on:click={addNewEvent}>
				<div class="card-body w-full">
					<div class="card-actions justify-center">
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
					</div>
				</div>
			</button>
		</div>
	</div>
</div>
