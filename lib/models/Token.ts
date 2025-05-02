import { Schema, Document, model, models } from 'mongoose';

export interface IToken extends Document {
    tokenAddress: string;
    poolAddress: string;
    name: string;
    symbol: string;
    totalSupply: number;

    description?: string;
    imageURL?: string;

    creatorAddress: string;
    launchDate: Date;

    initialBuyAmount: number;
    warCount: number;
    isActive: boolean;
}

const TokenSchema = new Schema<IToken>({
    tokenAddress: { type: String, unique: true, index: true },
    poolAddress: { type: String, index: true },

    name: { type: String, index: true },
    symbol: { type: String, unique: true, index: true },

    totalSupply: Number,
    description: String,
    imageURL: String,

    creatorAddress: { type: String, index: true },
    launchDate: { type: Date, default: Date.now },

    initialBuyAmount: { type: Number, default: 0 },
    warCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
});

export default models.Token || model<IToken>('Token', TokenSchema);
