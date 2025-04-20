import mongoose, { Schema, Document, model, models } from 'mongoose';

interface Wallet {
    address: string;
    chain: string;
    connectedAt: Date;
}

interface Portfolio {
    totalValue: number;
    lastUpdated: Date;
}

interface Stats {
    tokensOwned: number;
    activeWars: number;
    warsWon: number;
    totalVolume: number;
    totalProfit: number;
}

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    profilePicture: string;
    wallets: Wallet[];
    portfolio: Portfolio;
    stats: Stats;
}

const WalletSchema = new Schema<Wallet>({
    address: String,
    chain: { type: String, default: 'ethereum' },
    connectedAt: Date
}, { _id: false });

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: String,
    createdAt: { type: Date, default: Date.now },
    profilePicture: String,
    wallets: [WalletSchema],
    portfolio: {
        totalValue: Number,
        lastUpdated: Date
    },
    stats: {
        tokensOwned: Number,
        activeWars: Number,
        warsWon: Number,
        totalVolume: Number,
        totalProfit: Number
    }
});

export default models.User || model<IUser>('User', UserSchema);