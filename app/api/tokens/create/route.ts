import { connectToDatabase } from '@/lib/mongoose';
import TokenModel from '@/lib/models/Token';
import PoolModel from '@/lib/models/Pool';
import { success, failure } from '@/utils/response';

import { ethers, formatEther } from 'ethers';
import FactoryAbi from '@/abis/TokenFactory.json';
import TokenAbi from '@/abis/PumpToken.json';
import PoolAbi from '@/abis/PumpPool.json';

const FACTORY = process.env.NEXT_PUBLIC_FACTORY!;
const RPC_URL = process.env.RPC_URL!;

export async function POST(req: Request) {
    const session = await (await connectToDatabase()).startSession();
    session.startTransaction();

    try {

        const { txHash } = await req.json();
        if (!txHash) return failure('Tx hash is required', 400);

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const iface = new ethers.Interface(FactoryAbi);
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt || receipt.status !== 1)
            return failure('Transaction failed or pending', 400);

        let tokenAddr = '', poolAddr = '', creator = '';
        for (const log of receipt.logs) {
            try {
                const parsed = iface.parseLog(log);
                if (parsed?.name === 'TokenCreated') {
                    [tokenAddr, , , , creator] = parsed.args as unknown as string[];

                }
                if (parsed?.name === 'PoolCreated') {
                    [, poolAddr] = parsed.args as unknown as string[];
                }
            } catch { }
        }
        if (!tokenAddr || !poolAddr)
            return failure('Factory events not found', 500);

        const token = new ethers.Contract(tokenAddr, TokenAbi, provider);
        const pool = new ethers.Contract(poolAddr, PoolAbi, provider);

        // read on-chain data 
        const [name, symbol, totalSupplyBn, tradingPaused, sellingEnabled] = await Promise.all([
            token.name(),
            token.symbol(),
            token.totalSupply(),
            pool.tradingPaused(),
            pool.sellingEnabled()
        ]);

        const decimals = await token.decimals();
        const totalSupply = Number(ethers.formatUnits(totalSupplyBn, decimals));

        const tx = await provider.getTransaction(txHash);
        if (!tx) {
            failure('No transaction hash found', 404);
        }

        if (tx?.value === undefined) {
            return failure("Transaction has no value to format", 400);
        }
        const initialEth = Number(formatEther(tx.value));

        const block = await provider.getBlock(receipt.blockNumber);
        if (!block) {
            failure('Block not found', 404);
        }

        if (block?.timestamp === undefined) {
            return failure('Block timestamp not found', 400);
        }

        const tokenDoc = await TokenModel.create([{
            tokenAddress: tokenAddr,
            poolAddr: poolAddr,
            name,
            symbol,
            totalSupply,
            creatorAddress: creator,
            launchData: new Date(block.timestamp * 1000),
            initialBuyAmount: initialEth,
        }], { session });


        await PoolModel.create([{
            poolAddress: poolAddr,
            tokenAddress: tokenAddr,
            creator: creator,
            launchDate: new Date(block.timestamp * 1000),
            tradingPaused,
            sellingEnabled,
        }], { session })

        await session.commitTransaction();
        return success(tokenDoc[0], 201);

    } catch (err: any) {
        await session.abortTransaction();
        if (err.code == 11000) return failure('Token or Pool aready indexed', 409);
        failure(err, 501);
    } finally {
        await session.endSession();
    }

}