import { connectToDatabase } from '@/lib/mongoose';
import Token from '@/lib/models/Token';
import { success, failure } from '@/utils/response';

// gets details for a specific token, key: symbol
export async function GET(
    req: Request,
    { params }: { params: { symbol: string } }
) {
    try {
        await connectToDatabase();

        const { symbol } = params;

        const token = await Token.findOne({ symbol: symbol.toUpperCase() });

        if (!token) return failure('Token not found', 404);

        return success(token);
    } catch (err) {
        return failure(err);
    }
}
