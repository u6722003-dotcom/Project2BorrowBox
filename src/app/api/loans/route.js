import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Loan from "@/models/Loan";

// Handle creating a new Borrow Record (Loan)
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newLoan = await Loan.create(body);
    return NextResponse.json({ success: true, data: newLoan }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Handle fetching all Borrow History
export async function GET() {
  try {
    await dbConnect();
    const loans = await Loan.find({});
    return NextResponse.json({ success: true, data: loans }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}