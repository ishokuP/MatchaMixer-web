<script>

</script>

<!-- svelte-ignore a11y-missing-attribute -->
<html data-theme="matcha"></html>


<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content flex-col lg:flex-row-reverse">
	  <div class="text-center lg:text-left">
		<h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight  md:text-5xl lg:text-6xl ">MatchaMixer</h1>
		<p class="py-6">
			Your go-to event management solution. Effortlessly plan, organize, and execute your events with precision. Whether you're arranging a corporate conference, a dream wedding, or any celebration in between, MatchaMixer makes event management seamless. Log in to start creating unforgettable experiences today!
		</p>
	  </div>
	  <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
		<form class="card-body" action="?/login" method="POST">
		  <div class="form-control">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label">
			  <span class="label-text">Email</span>
			</label>
			<label class="input input-bordered flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
				  </svg>
				  
				<input type="text" class="grow" placeholder="Email" name="email" required/>
			</label>
		  </div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
		  <div class="form-control">
			<label class="label">
			  <span class="label-text">Password</span>
			</label>
			<label class="input input-bordered flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
					<path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd"/>
				</svg>
				<input type="password" class="grow" placeholder="Password" name="password" required/>
			</label>
		  </div>
		  <div class="form-control mt-6">
			<button class="btn btn-primary" name="login">Login</button>
		  </div>
		</form>
	  </div>
	</div>
  </div>