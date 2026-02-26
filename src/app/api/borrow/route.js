import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { borrowerId, lenderId } = await req.json();

    // This fulfills Andrei's request: Deduct from borrower, add to lender
    await User.findByIdAndUpdate(borrowerId, { $inc: { credits: -10 } });
    await User.findByIdAndUpdate(lenderId, { $inc: { credits: 10 } });

    return Response.json({ success: true, message: "10 Credits transferred!" });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}