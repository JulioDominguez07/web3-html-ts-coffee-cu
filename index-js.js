import { createWalletClient, custom, createPublicClient, parseEther, defineChain } from 'https://esm.sh/viem'
import { contractAddress, abi } from './constants-js.js'

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
        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)
        
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        await publicClient.simulateContract({
            address: contractAddress, // Sending the Contract address from constants-js.js
            abi: abi, // Sending the ABI from constants-js.js
            functionName: 'fund',
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount),
        })
    } 
    else { 
        connectButton.innerHTML = 'Please install MetaMask!' 
    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
        id: chainId,
        name: "Custom Chain",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: ["http://localhost:8545"],
            },
        },
    })
    return currentChain
}

connectButton.onclick = connect
fundButton.onclick = fund