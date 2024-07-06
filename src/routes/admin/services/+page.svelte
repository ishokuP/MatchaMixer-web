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

<h2 class="text-4xl font-extrabold">Services</h2>
<div class="sticky top-4 z-50 p-4 ">
	<button class="btn w-40" on:click={addNewEvent}>
	  + Add Service
	</button>
  </div>
<div class="flex flex-wrap ">
	{#each data.data as service}
		<div class=" w-full self-auto p-2 mx-2.5  my-2.5">
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

</div>


