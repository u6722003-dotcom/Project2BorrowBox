import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    let { borrowerId, lenderId } = await req.json();

    console.log("Processing Borrow - Borrower:", borrowerId, "Lender:", lenderId);

    if (!borrowerId || !lenderId) {
      return Response.json({ success: false, error: "IDs missing" }, { status: 400 });
    }

    // Clean any accidental spaces or characters
    const bId = borrowerId.trim();
    const lId = lenderId.trim();

    // 1. Deduct from Borrower
    // { $set: { credits: ... } } fallback ensures the field exists
    await User.findByIdAndUpdate(bId, 
      { $inc: { credits: -10 } }, 
      { new: true, upsert: true }
    );

    // 2. Add to Lender
    await User.findByIdAndUpdate(lId, 
      { $inc: { credits: 10 } }, 
      { new: true, upsert: true }
    );

    console.log("MongoDB Update Sent successfully");
    return Response.json({ success: true });
  } catch (error) {
    console.error("Borrow API Error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}