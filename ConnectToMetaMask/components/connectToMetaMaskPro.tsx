import Web3Modal from "web3modal";
import {useState} from "react";
import {ethers} from "ethers";

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

const providerOptions: any = {
    binancechainwallet: {
        package: true,
    },
    // coinbasewallet: {
    //     package: CoinbaseWalletSDK, // Required
    //     options: {
    //         appName: "Coinbase", // Required
    //         infuraId: process.env.INFURA_ID, // Required
    //         chainId: 11155111, //4 for Rinkeby, 1 for mainnet (default)
    //     },
    // },

    // walletconnect: {
    //     package: WalletConnect, // required
    //     options: {
    //         infuraId: process.env.INFURA_ID // required
    //     }
}


export  default function ConnectToMetaMaskPro() {

    const [connectedAccount, setConnectedAccount] = useState<any>(null);
    const [balance, setBalance] = useState<any>(null);
    const [tokenBalance, setTokenBalance] = useState<any>(null);

    const ERC20ABI = require('./erc20.abi.json');

    async function getAccountAddress(library:any){

        await setConnectedAccount("Wait to fetch data");
        const web3Accounts = await library.listAccounts();
        await setConnectedAccount(web3Accounts[0]);
    }

    async function getAccountBalance(library:any){

        await setBalance("Wait to fetch data");
        const web3Accounts = await library.listAccounts();
        const data = await library.getBalance(web3Accounts[0]);
        await setBalance(ethers.utils.formatEther(data));
    }

    async function getAccountToken(library:any, tokenAddress:any){

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

    async function connectHandler (web3Provider: any) {

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
                    <DropdownButton
                        title="Select Token"
                        id="dropdown-menu"
                        onSelect={handleSelect}
                    >
                        <Dropdown.Item eventKey="0xdAC17F958D2ee523a2206206994597C13D831ec7">Tether USD</Dropdown.Item>
                        <Dropdown.Item eventKey="0xB8c77482e45F1F44dE1745F52C74426C631bDD52">BNB</Dropdown.Item>
                        <Dropdown.Item eventKey="0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0">Matic Token</Dropdown.Item>
                        <Dropdown.Item eventKey="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984">Uniswap</Dropdown.Item>
                    </DropdownButton>
                ) : (
                    <h6> token balance is {tokenBalance} </h6>
                )
                }
            </header>
        </div>
    );
}
