import { createWalletClient, custom, createPublicClient } from 'https://esm.sh/viem'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const ethAmountInput = document.getElementById('ethAmount')

let walletClient
let publicClient

async function connect() {
    if (typeof window.ethereum !== 'undefined') { 
        console.log('MetaMask is installed!');
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        await walletClient.requestAddresses()
        connectButton.innerHTML = 'Connected!' 
    } 
    else { 
        connectButton.innerHTML = 'Please install MetaMask!' 
    }
}

async function fund() {
    const ethAmount = ethAmountInput.value
    console.log(`Funding with ${ethAmount}...`)

    if (typeof window.ethereum !== 'undefined') { 
        console.log('MetaMask is installed!')
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        await walletClient.requestAddresses()
        
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        await publicClient.simulateContract({
            address: '0xYourContractAddress', // Replace with your contract address
        })
    } 
    else { 
        connectButton.innerHTML = 'Please install MetaMask!' 
    }
}

connectButton.onclick = connect
fundButton.onclick = fund