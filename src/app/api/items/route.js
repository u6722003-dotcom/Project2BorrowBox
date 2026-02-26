import { dbConnect } from "@/lib/mongodb";
import Item from "@/models/Item";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Ensure all fields requested by Andrei are stored
    const newItem = await Item.create({
      name: body.name,
      description: body.description,
      imageUrl: body.imageUrl || "https://via.placeholder.com/150",
      ownerName: body.ownerName, // Stores the person who added it
      ownerId: body.ownerId,
      creditsRequired: 10 // Standard cost for the credit system
    });

    return Response.json({ success: true, data: newItem });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  await dbConnect();
  const items = await Item.find({});
  return Response.json({ success: true, data: items });
}