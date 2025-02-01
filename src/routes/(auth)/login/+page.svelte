<script>
	const bgImage = '/login-background.png'; // Replace with your actual image path
</script>

<div class="login-container" style="background-image: url({bgImage});">
	<div class="overlay">
		<div class="login-box">
			<div class="logo">
				<div class="flex items-center">
					<img src="/logo.png" alt="placeholder logo" />
					<span class="title-logo">Matcha Mixer</span>
				</div>
			</div>
			<!-- <h1 class="title">Login</h1> -->
			<h1 class="title">Employee Login</h1>
			<p class="subtitle font-bold">Manage your event in efficiency.</p>
			<p class="sub-subtitle">Please, enter your details to get sign in to your account.</p>

			<form class="login-form" action="?/login" method="POST">
				<h2 class="label-text">Email</h2>
				<input type="email" name="email" required placeholder="Enter Email." class="input-box" />

				<h2 class="label-text">Password</h2>
				<input type="password" name="password" required placeholder="Password" class="input-box" />

				<button class="btn">Sign In</button>
			</form>
		</div>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		/* align-items: center; */
		height: 100vh;
		background-position: center;
		background-size: cover;
		padding-left: 70%;
	}

	.login-box {
		background: #ffffff;
		margin-top: 5rem;
		width: 400px;
	}

	.logo {
		margin-bottom: 15rem;
	}

	img {
		width: 4.25rem;
		height: 4rem;
	}

	.title-logo {
		font-size: 2.5rem;
		line-height: 2.25rem;
		font-weight: 900;
		color: #364617;
	}

	.title {
		font-size: 2rem;
		line-height: 2.25rem;
		font-weight: 900;
		color: #364617;
		margin-bottom: 4rem;
	}

	.subtitle {
		margin-top: 1rem;
		font-size: 1.15rem;
		margin-bottom: 1rem;
		color: #364617;
	}

	.sub-subtitle {
		margin-top: 1rem;
		font-size: 1rem;
		margin-bottom: 2rem;
		color: grey;
	}

	.label-text {
		font-size: 1.25rem;
		font-weight: 700;
		margin-top: 1rem;
		text-align: left;
		color: #364617;
	}

	.input-box {
		width: 100%;
		padding: 0.8rem;
		margin-top: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 1rem;
		background-color: #364617;
		color: white;
	}

	.btn {
		background: #364617;
		color: white;
		padding: 0.8rem;
		margin-top: 1.5rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 1rem;
		width: 100%;
	}

	.btn:hover {
		background: #364617;
		box-shadow:
			1px 1px 40px rgb(10, 29, 10) inset,
			-1px -1px 50px rgb(9, 26, 9) inset;
	}

	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		-webkit-box-shadow: 0 0 0 30px #364617 inset !important;
	}

	@media (max-width: 768px) {
		.login-container {
			justify-content: center;
			padding-left: 0;
		}

		.overlay {
			width: 100%;
			background: rgba(0, 0, 0, 0.7);
		}
	}
</style>
