import { Schema, Document, model, models } from 'mongoose';

interface PricePoint {
    timestamp: Date;
    price: number;
}

export interface IToken extends Document {
    name: string;
    symbol: string;
    totalSupply: number;
    price: number;
    priceHistory: PricePoint[];
    change24h: number;
    description: string;
    marketCap: number;
    volume24h: number;
    holders: number;
    creatorId: Schema.Types.ObjectId;
    launchDate: Date;
    isActive: boolean;
    imageURL: string;
    initialBuyAmount: number;
    warCount: number;
}

const TokenSchema = new Schema<IToken>({
    name: { type: String, index: true },
    symbol: { type: String, unique: true, index: true },
    totalSupply: Number,
    price: Number,
    priceHistory: [{ timestamp: Date, price: Number }],
    change24h: Number,
    description: String,
    marketCap: Number,
    volume24h: Number,
    holders: Number,
    creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    launchDate: Date,
    isActive: { type: Boolean, default: true },
    imageURL: String,
    initialBuyAmount: Number,
    warCount: { type: Number, default: 0 }
});

export default models.Token || model<IToken>('Token', TokenSchema);
