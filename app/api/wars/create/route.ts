import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem'
import { connectToDatabase } from '@/lib/mongoose';
import PoolModel, { IPool } from '@/lib/models/Pool';
import WarModel from '@/lib/models/War';
import TokenModel from '@/lib/models/Token';
import { success, failure } from '@/utils/response';
import { fail } from 'assert';

async function getTokenMeta(tokenAddress: string) {

    const poolDoc = await PoolModel.findOne({ tokenAddress: tokenAddress }) as IPool
    if (!poolDoc) throw new Error(`Pool not found for the ${tokenAddress}`)

    const tokenDoc = await TokenModel.findOne({ tokenAddress: tokenAddress })
    if (!tokenDoc) throw new Error(`Token document missing for address ${tokenAddress}`)

    console.log(tokenDoc);
    return {
        id: tokenDoc._id,   // needed by WarSchema
        name: tokenDoc.name,
        symbol: tokenDoc.symbol
        // you could also return poolDoc.poolAddress if you ever extend WarSchema
    }
}

export async function POST(req: NextRequest) {
    try {
        const { tokenAAddress, tokenBAddress, name, description } = await req.json();

        if (!tokenAAddress || !tokenBAddress) {
            return NextResponse.json(
                { success: false, error: 'tokenAAddress and tokenBAddress are required' },
                { status: 400 }
            )
        }
        if (tokenAAddress === tokenBAddress) {
            return NextResponse.json(
                { success: false, error: 'tokens must be different' },
                { status: 400 }
            )
        }

        await connectToDatabase();

        const [tokenA, tokenB] = await Promise.all([
            getTokenMeta(tokenAAddress),
            getTokenMeta(tokenBAddress)
        ]);

        const now = new Date()
        const warDoc = await WarModel.create({
            name: name ?? `${tokenA.symbol} vs ${tokenB.symbol}`,
            description: description ?? '',
            status: 'ongoing',
            isActive: true,

            tokenA,
            tokenB,

            startTime: now,
            endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // +2 h


            participants: [],
            totalParticipants: 0,
            totalVolume: 0,
            progress: 0
        })

        return NextResponse.json({ success: true, data: warDoc }, { status: 201 })

    } catch (err) {
        failure(err);
        return NextResponse.json(
            { success: false, error: (err as Error).message },
            { status: 500 }
        )
    }
}