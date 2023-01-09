import Web3Modal from "web3modal";
import {useState} from "react";
import {ethers} from "ethers";

const providerOptions = {
    binancechainwallet: {
        package: true,
    },
}

export  default function ConnectToMetaMaskPro() {

    const [connectedAccount, setConnectedAccount] = useState<null | string>(null);
    const [balance, setBalance] = useState<null | number | string>(null);
    const [tokenBalance, setTokenBalance] = useState<null | number | string>(null);

    const ERC20ABI = require('./erc20.abi.json');

    async function getAccountAddress(library: any){

        await setConnectedAccount("Wait to fetch data");
        const web3Accounts = await library.listAccounts();
        await setConnectedAccount(web3Accounts[0]);
    }

    async function getAccountBalance(library: any){

        await setBalance("Wait to fetch data");
        const web3Accounts = await library.listAccounts();
        const data = await library.getBalance(web3Accounts[0]);
        await setBalance(ethers.utils.formatEther(data));
    }

    async function getAccountToken(library: any, tokenAddress: string){

        try {
            await setTokenBalance("Wait to fetch data");
            const contract = new ethers.Contract(tokenAddress, ERC20ABI, library);
            const network = await library.getNetwork();

            const web3Accounts = await library.listAccounts();
            const chainID = network.chainId;

            if (chainID !== 1){

                alert("Connect to Main net");
            }else {

                const data = await contract.balanceOf(web3Accounts[0]);
                await setTokenBalance(ethers.utils.formatEther(data));
            }

        }catch (e) {
            console.log(e);
        }
    }

    const handleSelect = async (e:any)=>{

        if (connectedAccount){

            let library = new ethers.providers.Web3Provider(window.$web3Provider);
            await getAccountToken(library, e);
        }else {

            alert("Connect to wallet first");
        }
    }

    async function connectHandler (web3Provider: any ) {

        let library = new ethers.providers.Web3Provider(web3Provider);

        await getAccountAddress(library);
        await getAccountBalance(library);
    }

    const connectWeb3Wallet = async () => {

        try{
            window.$web3Modal = new Web3Modal({
                // network: "sepolia",
                theme: "dark",
                cacheProvider:false,
                providerOptions,
            });

            window.$web3Provider = await window.$web3Modal.connect();
            await connectHandler(window.$web3Provider);

        }catch (error){

            console.error(error);
        }
    };

    const disconnectWeb3Modal = async () => {
        await window.$web3Modal.clearCachedProvider();
        setConnectedAccount("");
        setTokenBalance("");
    };

    window.ethereum.on('accountsChanged', async ()=> {

        if(connectedAccount) {
            await setTokenBalance("");
            await connectHandler(window.$web3Provider);
            console.log("account changed");
        }
    });

    window.ethereum.on('chainChanged', async ()=>{

        if(connectedAccount){
            await setTokenBalance("");
            await connectHandler(window.$web3Provider);
            console.log("chain changed");
        }
    });

    return (
        <div>
            <header>
                <br />
                {connectedAccount && <h6>Connected to<p>{connectedAccount}</p> Balance : <p>{balance}</p> </h6>}
                {!connectedAccount ? (
                    <button onClick={connectWeb3Wallet}>Connect Wallet</button>
                ) : (
                    <button onClick={disconnectWeb3Modal}>Disconnect</button>
                )}
                {!tokenBalance ? (
                    <button
                        onClick={handleSelect}>
                        Connect to Nader Token
                    </button>
                ) : (
                    <h6> token balance is {tokenBalance} </h6>
                )
                }
            </header>
        </div>
    );
}
