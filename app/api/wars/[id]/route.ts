import { connectToDatabase } from '@/lib/mongoose';
import War from '@/lib/models/War';
import { success, failure } from '@/utils/response';
import { Types } from 'mongoose';

// returns data for a specific war 
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();

        const { id } = params;

        if (!Types.ObjectId.isValid(id)) {
            return failure('Invalid war ID', 400);
        }

        const war = await War.findById(id);

        if (!war) return failure('War not found', 404);

        return success(war);
    } catch (err) {
        return failure(err);
    }
}
