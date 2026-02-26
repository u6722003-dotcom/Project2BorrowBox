import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

// Handle Creating a new User
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Ensure new users always start with 50 credits to prevent demo errors
    const userData = {
      ...body,
      credits: body.credits !== undefined ? body.credits : 50
    };

    const newUser = await User.create(userData);
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    // If a user with the same email exists, this will catch it
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Handle Fetching all Users (Useful for your admin/testing)
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).select("-password"); // Hide passwords for security
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}