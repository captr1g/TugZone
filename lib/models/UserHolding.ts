import { Schema, Document, model, models } from 'mongoose';

export interface IUserHolding extends Document {
    userId: Schema.Types.ObjectId;
    tokenId: Schema.Types.ObjectId;
    warId?: Schema.Types.ObjectId;
    amount: number;
    averageBuyPrice: number;
    pnl: number;
    walletAddress: string;
    lastUpdated: Date;
}

const UserHoldingSchema = new Schema<IUserHolding>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    tokenId: { type: Schema.Types.ObjectId, ref: 'Token', index: true },
    warId: { type: Schema.Types.ObjectId, ref: 'War', index: true },
    amount: Number,
    averageBuyPrice: Number,
    pnl: Number,
    walletAddress: String,
    lastUpdated: Date
});

export default models.UserHolding || model<IUserHolding>('UserHolding', UserHoldingSchema);
