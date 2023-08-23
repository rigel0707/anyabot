<script>
	import { onMount } from "svelte"
	import axios from "axios"
	import { goto } from "$app/navigation";


	let username = ""
	let password = ""
  
	const handleLogin = async () => {
	  try {
		const response = await axios.post("http://localhost:5000/auth/login", {
		  username,
		  password,
		})
		if (response.status === 200) {

        window.localStorage.setItem('userID', response.data.userID)
        window.localStorage.setItem('username', response.data.username)
        window.localStorage.setItem('sessionToken', response.data.token)

        goto('/chat')
      }
	  } catch (error) {
		alert('Wrong Username or Password!')
		console.error("Error:", error)
	  }
	}
</script>

<div class="flex justify-center pt-10">
	<div class="w-60">
		<div class="pb-5">
			<label class="label">
				<span>Username:</span>
				<input class="input px-4 py-3 rounded-full" title="username" type="text"  bind:value={username}/>
			</label>
			<label class="label">
				<span>Password:</span>
				<input class="input px-4 py-3 rounded-full" title="password" type="password"  bind:value={password}/>
			</label>
		</div>
		<div class="flex flex-row-reverse">
			<button type="button" on:click={handleLogin} class="btn variant-filled">Login</button>
		</div>
	</div>
</div>
