import { connectToDatabase } from '@/lib/mongoose';
import Leaderboard from '@/lib/models/Leaderboard';
import { success, failure } from '@/utils/response';


// returns all the leaderboards data 
export async function GET() {
    try {
        await connectToDatabase();

        const boards = await Leaderboard.find({}).sort({ lastUpdated: -1 });

        return success(boards);
    } catch (err) {
        return failure(err);
    }
}
