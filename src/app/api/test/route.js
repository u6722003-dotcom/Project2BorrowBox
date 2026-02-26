import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: 'Massive Win! The database is connected!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Oh no, connection failed.' }, { status: 500 });
  }
}