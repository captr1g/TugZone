import { connectToDatabase } from '@/lib/mongoose';
import War from '@/lib/models/War';
import { success, failure } from '@/utils/response';

// returns data for all the active wars  
export async function GET() {
    try {
        await connectToDatabase();

        const wars = await War.find({ isActive: true }).sort({ startTime: -1 });

        return success(wars);
    } catch (err) {
        return failure(err);
    }
}
