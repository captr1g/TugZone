'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import FactoryAbi from '@/abis/TokenFactory.json';
import TokenAbi from '@/abis/PumpToken.json';
import PoolAbi from '@/abis/PumpPool.json';
import { useWallet } from '@/hooks/walletContext';

const TOKEN_FACTORY_ADDRESS = '0xA541a5a652D7CA0bFD45Df5c1352c3983E3D7bF7';

export default function CreateTokenForm() {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [metadataUrl, setMetadataUrl] = useState('');
    const [ethLiquidity, setEthLiquidity] = useState('');
    const [loading, setLoading] = useState(false);

    const { address, signer, provider, connected } = useWallet();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        try {

            if (!connected) {
                throw new Error('Please connect your wallet first');
            }

            setLoading(true);

            // create contract instances to call
            const factory = new ethers.Contract(TOKEN_FACTORY_ADDRESS, FactoryAbi, signer);
            const createTx = await factory.createToken(name, symbol, metadataUrl, {
                value: 0
            }); // no ETH sent yet
            const createRcpt = await createTx.wait();


            // parsing events 
            const iface = new ethers.Interface(FactoryAbi);
            let tokenAddr = '', poolAddr = '';
            for (const log of createRcpt.logs) {
                try {
                    const parsed = iface.parseLog(log);
                    if (parsed?.name === 'TokenCreated') tokenAddr = parsed.args[0];
                    if (parsed?.name === 'PoolCreated') poolAddr = parsed.args[1];
                } catch { }
            }
            if (!tokenAddr || !poolAddr) throw new Error('Factory events not found');

            // approve pool for full supply
            const token = new ethers.Contract(tokenAddr, TokenAbi, signer);
            const totalSupply = await token.totalSupply();
            await (await token.approve(poolAddr, totalSupply)).wait();

            // initialise pool with ETH liquidity 
            const pool = new ethers.Contract(poolAddr, PoolAbi, signer);
            const initTx = await pool.initialize(tokenAddr, address, {
                value: ethers.parseEther(ethLiquidity || '0')
            });
            const initRcpt = await initTx.wait();


            // call backend
            await fetch('/api/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ txHash: initRcpt.hash })
            });

            alert('Token & pool created');
            setName(''); setSymbol(''); setMetadataUrl(''); setEthLiquidity('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
            <input
                placeholder="Token Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="input input-bordered"
            />
            <input
                placeholder="Symbol"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                required
                className="input input-bordered"
            />
            <input
                placeholder="Metadata URL (IPFS / https://...)"
                value={metadataUrl}
                onChange={e => setMetadataUrl(e.target.value)}
                required
                className="input input-bordered"
            />
            <input
                placeholder="ETH Liquidity (e.g. 0.01)"
                value={ethLiquidity}
                onChange={e => setEthLiquidity(e.target.value)}
                required
                className="input input-bordered"
            />
            <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Creating…' : 'Create Token'}
            </button>
        </form>
    );
}
