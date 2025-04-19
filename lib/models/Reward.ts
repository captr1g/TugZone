import { Schema, Document, model, models } from 'mongoose';

export interface IReward extends Document {
    userId: Schema.Types.ObjectId;
    warId: Schema.Types.ObjectId;
    tokenId: Schema.Types.ObjectId;
    rewardType: 'win' | 'volume' | 'airdrop';
    amount: number;
    status: 'pending' | 'distributed' | 'failed';
    distributedAt?: Date;
}

const RewardSchema = new Schema<IReward>({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    warId: { type: Schema.Types.ObjectId, ref: 'War' },
    tokenId: { type: Schema.Types.ObjectId, ref: 'Token' },
    rewardType: { type: String, enum: ['win', 'volume', 'airdrop'] },
    amount: Number,
    status: { type: String, enum: ['pending', 'distributed', 'failed'], default: 'pending' },
    distributedAt: Date
});

export default models.Reward || model<IReward>('Reward', RewardSchema);
