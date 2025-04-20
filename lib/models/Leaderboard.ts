import { Schema, Document, model, models } from 'mongoose';

interface Ranking {
    userId: Schema.Types.ObjectId;
    username: string;
    position: number;
    profit: number;
    volume: number;
}

export interface ILeaderboard extends Document {
    warId: Schema.Types.ObjectId;
    rankings: Ranking[];
    lastUpdated: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
    warId: { type: Schema.Types.ObjectId, ref: 'War', index: true, unique: true },
    rankings: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        username: String,
        position: Number,
        profit: Number,
        volume: Number
    }],
    lastUpdated: Date
});

export default models.Leaderboard || model<ILeaderboard>('Leaderboard', LeaderboardSchema);
