import { connectToDatabase } from '@/lib/mongoose';
import Token from '@/lib/models/Token';
import { success, failure } from '@/utils/response';

// returns all the tokens registered in the db 
export async function GET() {
    try {
        console.log("Sending tokens data from backend")
        await connectToDatabase();
        console.log("Connected to db")
        const tokens = await Token.find({ isActive: true }).sort({ marketCap: -1 });
        console.log("mil gaye tokens")
        return success(tokens);
    } catch (err) {
        return failure(err);
    }
}
