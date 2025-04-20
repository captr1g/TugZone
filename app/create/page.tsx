'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

const TOKEN_FACTORY_ADDRESS = '0xA541a5a652D7CA0bFD45Df5c1352c3983E3D7bF7';
const TOKEN_FACTORY_ABI: any[] = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "poolAddress", "type": "address" }], "name": "PoolCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "string", "name": "symbol", "type": "string" }, { "indexed": false, "internalType": "string", "name": "metadataUrl", "type": "string" }, { "indexed": true, "internalType": "address", "name": "creator", "type": "address" }], "name": "TokenCreated", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "string", "name": "metadataUrl", "type": "string" }], "name": "createToken", "outputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getAllPools", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllTokens", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "getPoolForToken", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "getTokenMetadata", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "pools", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "tokenMetadata", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "tokenToPool", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "tokens", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
];

export default function CreateTokenForm() {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    // const [metadataUrl, setMetadataUrl] = useState('');
    const [ethValue, setEthValue] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!(window as any).ethereum) {
            alert('Please install MetaMask');
            return;
        }

        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const factory = new ethers.Contract(TOKEN_FACTORY_ADDRESS, TOKEN_FACTORY_ABI, signer);

        try {
            const tx = await factory.createToken(name, symbol, "http://localhost:3090", {
                value: ethers.parseEther(ethValue),
            });
            const receipt = await tx.wait();

            const iface = new ethers.Interface(TOKEN_FACTORY_ABI);
            let tokenAddress = '0x';

            // for (const log of receipt.logs) {
            //     try {
            //         const parsed = iface.parseLog(log);
            //         if (parse.name === 'TokenCreated') {
            //             tokenAddress = parsed.args.tokenAddress;
            //             break;
            //         }
            //     } catch { }
            // }

            // // Send token info to backend
            // await fetch('/api/tokens/create', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         name,
            //         symbol,
            //         metadataUrl,
            //         creator: await signer.getAddress(),
            //         address: tokenAddress
            //     })
            // });

            alert('Token created and saved!');
        } catch (err) {
            console.error('Token creation failed:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input placeholder="Token Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
            {/* <input placeholder="Metadata URL" value={metadataUrl} onChange={e => setMetadataUrl(e.target.value)} /> */}
            <input placeholder="ETH to send" value={ethValue} onChange={e => setEthValue(e.target.value)} />
            <button type="submit">Create Token</button>
        </form>
    );
}
