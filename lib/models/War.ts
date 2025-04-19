import { Schema, Document, model, models } from 'mongoose';

interface Participant {
    userId: Schema.Types.ObjectId;
    walletAddress: string;
    tokenAHolding: number;
    tokenBHolding: number;
    joinedAt: Date;
}

export interface IWar extends Document {
    name: string;
    description: string;
    status: string;
    isActive: boolean;
    tokenA: {
        id: Schema.Types.ObjectId;
        name: string;
        symbol: string;
    };
    tokenB: {
        id: Schema.Types.ObjectId;
        name: string;
        symbol: string;
    };
    startTime: Date;
    endTime: Date;
    participants: Participant[];
    totalParticipants: number;
    totalVolume: number;
    progress: number;
    winnerTokenId?: Schema.Types.ObjectId;
    rewardDistribution?: {
        total: number;
        distributed: boolean;
    };
    createdAt: Date;
}

const WarSchema = new Schema<IWar>({
    name: { type: String, index: true },
    description: String,
    status: { type: String, index: true },
    isActive: { type: Boolean, index: true },
    tokenA: {
        id: { type: Schema.Types.ObjectId, ref: 'Token' },
        name: String,
        symbol: String
    },
    tokenB: {
        id: { type: Schema.Types.ObjectId, ref: 'Token' },
        name: String,
        symbol: String
    },
    startTime: { type: Date, index: true },
    endTime: { type: Date, index: true },
    participants: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        walletAddress: String,
        tokenAHolding: Number,
        tokenBHolding: Number,
        joinedAt: Date
    }],
    totalParticipants: Number,
    totalVolume: Number,
    progress: Number,
    winnerTokenId: { type: Schema.Types.ObjectId, ref: 'Token' },
    rewardDistribution: {
        total: Number,
        distributed: Boolean
    },
    createdAt: { type: Date, default: Date.now }
});

export default models.War || model<IWar>('War', WarSchema);
