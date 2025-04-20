import { connectToDatabase } from '@/lib/mongoose';
import Token from '@/lib/models/Token';
import { success, failure } from '@/utils/response';

// returns all the tokens registered in the db 
export async function GET() {
    try {
        await connectToDatabase();

        const tokens = await Token.find({ isActive: true }).sort({ marketCap: -1 });

        return success(tokens);
    } catch (err) {
        return failure(err);
    }
}
