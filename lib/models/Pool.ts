import { Schema, Document, model, models } from 'mongoose';

export interface IPool extends Document {
    poolAddress: string;
    tokenAddress: string;
    creator: string;
    launchDate: Date;
    launchBlock: number;

    // analytics – incremented by a worker / cron
    volume24h: number;
    priceChange24h: number;
    totalVolume: number;
    txCount: number;

    tradingPaused: boolean;
    sellingEnabled: boolean;
}

const PoolSchema = new Schema<IPool>({
    poolAddress: { type: String, unique: true, index: true },
    tokenAddress: { type: String, index: true },
    creator: { type: String, index: true },
    launchDate: Date,
    launchBlock: Number,

    volume24h: { type: Number, default: 0 },
    priceChange24h: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },
    txCount: { type: Number, default: 0 },

    tradingPaused: Boolean,
    sellingEnabled: Boolean
});

export default models.Pool || model<IPool>('Pool', PoolSchema);
