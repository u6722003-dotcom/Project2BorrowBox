import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    
    // FIX: .trim() removes any hidden spaces or extra characters like that "i"
    const id = resolvedParams.id.trim().split(' ')[0]; 

    const user = await User.findById(id).select("-password");

    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}