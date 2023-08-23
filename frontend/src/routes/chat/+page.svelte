<script>
    // @ts-nocheck
    import { onMount, afterUpdate } from "svelte"
	import axios from "axios"
	import { goto } from "$app/navigation"

    let currentMessage = ''
    let answer = ''

    let messageFeed = []
    let answerFeed = []
    
    let loading = true

    //create function for saving the input message to /chat/savechat

    const answerChat = async () => {
        const userId = window.localStorage.getItem('userID')
        saveChat()
        loading = true

        try {
            const inputMessage = currentMessage
            await addMessage(inputMessage)
            const response = await axios.post("http://localhost:5000/chat/ask", {userId, message: inputMessage })
            console.log(response.data.answer)

            answer = (response.data.answer).replace(/\n/g, '<br>')
            await addAnswer(answer)
        }catch (error) {
            console.error("Error:", error)
            answer = "Error. Please try again."
            await addAnswer(answer)
        }finally {
            loading = false;
        }
    }

    const saveChat = async () => {
        const userId = window.localStorage.getItem('userID')
        try {
            const response = await axios.post("http://localhost:5000/chat/savechat",{ 
                userId: userId,  
                message: currentMessage
            })

        }catch (error) {
            console.error("Error:", error)
        }
    }
   
  
    async function addMessage(message) {
      const newMessage = {
        id: messageFeed.length,
        host: true,
        name: 'Anya',
        message: message,
        color: 'variant-soft-primary'
      }
  
      // @ts-ignore
      messageFeed = [...messageFeed, newMessage]
      currentMessage = ''
    }

    async function addAnswer(answer) {
        const newAnswer = {
        id: answerFeed.length,
        host: false,
        name: 'Yor',
        answer: answer,
        color: 'variant-soft-primary'
      }
  
      // @ts-ignore
      answerFeed = [...answerFeed, newAnswer]
      console.log(answerFeed)

    }

    let lastAnswerRef

    afterUpdate(() => {
        if (lastAnswerRef) {
        lastAnswerRef.scrollIntoView({ behavior: 'smooth' })
        }
    })
</script>
  
<div>
<h1>Hello World!</h1>
<div class="px-4 overflow-scroll" style="height: 70vh;">
    <div class="grid grid-cols-1 grid-rows-[auto] w-full justify-start gap-2 overflow-y-auto">
        {#each messageFeed as message (message.id)}
            <div class="card p-4 variant-soft rounded-tl-none h-min space-y-2">
                <header class="flex justify-between items-center">
                    <p class="font-bold">{message.name}</p>
                </header>
                <p>{message.message}</p>
                
                {#if loading}
                <div class="card p-4 rounded-tr-none space-y-2" bind:this={lastAnswerRef}>
                    <!-- loading -->
                    <div class="animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 h-8 w-8"></div>
                </div>
                {:else}
                    {#each answerFeed as answer (answer.id)}
                        {#if answer.id === message.id}
                            <div class="card p-4 rounded-tr-none space-y-2" id="{answer.id}" bind:this={lastAnswerRef}>
                                <header class="flex justify-between items-center">
                                <p class="font-bold">{answer.name}</p>
                                </header>
                                {@html `<p>${answer.answer}</p>`}
                            </div>   
                        {/if}
                    {/each}
                {/if}     
            </div>
        {/each}

    </div>
</div>

<div class="absolute bottom-3 left-0 w-full">
    <form class="stretch mx-2 flex flex-row gap-3 last:mb-2">

        <div class="relative flex h-full flex-1 bg-indigo-700 items-stretch rounded px-4">
            <div class="flex flex-col w-full flex-grow relative rounded-container-token mx-3">
                <textarea
                bind:value={currentMessage}
                class="m-0 w-full bg-transparent border-0 ring-0 resize-none overflow-auto"
                name="prompt"
                id="prompt"
                placeholder="Send a message..."
                rows="1" 
                style="max-height:200px; height:70px; overflow-y:hidden;"
                ></textarea>
                <button class="absolute md:right-3 right-0 p-1 md:p-2 variant-filled-primary" style="height:70px;" on:click={answerChat}>Send</button>
            </div>
        </div>
    </form>
</div>
</div>


