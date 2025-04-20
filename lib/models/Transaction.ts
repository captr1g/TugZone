import { Schema, Document, model, models } from 'mongoose';

export interface ITransaction extends Document {
    userId: Schema.Types.ObjectId;
    warId?: Schema.Types.ObjectId;
    tokenId: Schema.Types.ObjectId;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    total: number;
    timestamp: Date;
    txHash?: string;
    walletAddress?: string;
    source?: string;
}

const TransactionSchema = new Schema<ITransaction>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    warId: { type: Schema.Types.ObjectId, ref: 'War', index: true },
    tokenId: { type: Schema.Types.ObjectId, ref: 'Token', index: true },
    type: { type: String, enum: ['buy', 'sell'] },
    amount: Number,
    price: Number,
    total: Number,
    timestamp: { type: Date, default: Date.now, index: true },
    txHash: String,
    walletAddress: String,
    source: String
});

export default models.Transaction || model<ITransaction>('Transaction', TransactionSchema);
