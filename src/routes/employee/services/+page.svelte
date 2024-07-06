<script lang="ts">
	import { enhance } from '$app/forms';

	interface services {
		id: number;
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

<div class="flex flex-wrap">
	{#each data.data as service}
		<div class=" mx-2.5 my-2.5 w-full self-auto p-2">
			<div class="card bg-base-100 shadow-xl lg:card-side">
				<figure>
					<img
						class="h-full w-full"
						src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
						alt="Album"
					/>
				</figure>
				<div class="card-body w-full">
					<h3 class="card-title text-3xl font-bold">{service.name}</h3>
					<h6 class="text-lg font-bold">Type</h6>
					<p>{service.type}</p>

					<h6 class="text-lg font-bold">Price</h6>
					<p>{service.price}</p>

					<h6 class="text-lg font-bold">Rate</h6>
					<p>{service.rate}</p>

					<h6 class="text-lg font-bold">Inclusions</h6>
					<p>{service.inclusion}</p>
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
													readonly
												/>
											</h2>
											<h6 class="text-lg font-bold">Type</h6>
											<h2>
												<input
													type="text"
													name="serviceType"
													class="input input-bordered w-full max-w-xs"
													bind:value={service.type}
													readonly
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
													readonly
												/>
											</h2>

											<h6 class="text-lg font-bold">Rate</h6>
											<h2>
												<input
													type="text"
													name="serviceRate"
													class="input input-bordered w-full max-w-xs"
													bind:value={service.rate}
													readonly
												/>
											</h2>
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
												readonly
											/>
										</h2>
									</div>
									<br /><br />
									<div class="modal-action flex w-full justify-end">
	
										<div class="flex space-x-4">

											<button type="button"class="btn btn-error" on:click={() => toggleModal(service.id)}
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
