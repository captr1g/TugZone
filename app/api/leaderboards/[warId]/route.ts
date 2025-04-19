import { connectToDatabase } from '@/lib/mongoose';
import Leaderboard from '@/lib/models/Leaderboard';
import { success, failure } from '@/utils/response';
import { Types } from 'mongoose';


// returns the data by warId 
export async function GET(
    req: Request,
    { params }: { params: { warId: string } }
) {
    try {
        await connectToDatabase();

        const { warId } = params;

        if (!Types.ObjectId.isValid(warId)) {
            return failure('Invalid war ID', 400);
        }

        const leaderboard = await Leaderboard.findOne({ warId });

        if (!leaderboard) return failure('Leaderboard not found', 404);

        return success(leaderboard);
    } catch (err) {
        return failure(err);
    }
}
