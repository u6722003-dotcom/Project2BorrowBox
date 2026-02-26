import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Item from "@/models/Item"; // <-- ADDED THIS to talk to the Items database
 
export async function POST(req) {
  try {
    await dbConnect();
    // Added itemId so the database knows what to delete
    let { borrowerId, lenderId, itemId } = await req.json();
 
    if (!borrowerId || !lenderId) {
      return Response.json({ success: false, error: "IDs missing" }, { status: 400 });
    }
 
    const bId = borrowerId.trim();
    const lId = lenderId.trim();
 
    // 1. Deduct from Borrower
    await User.findByIdAndUpdate(bId, { $inc: { credits: -10 } }, { new: true, upsert: true });
 
    // 2. Add to Lender
    await User.findByIdAndUpdate(lId, { $inc: { credits: 10 } }, { new: true, upsert: true });
 
    // 3. NEW: Delete the item so it disappears from the screen
    if (itemId) {
      await Item.findByIdAndDelete(itemId);
    }
 
    return Response.json({ success: true, message: "Credits exchanged and item removed!" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}