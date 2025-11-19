import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. POST: Create a new link [cite: 21-23, 75]
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, shortCode } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let code = shortCode;

    // Logic: Handle Custom Code
    if (code) {
      // Validation: Must be 6-8 alphanumeric characters [cite: 72]
      const isValid = /^[a-zA-Z0-9]{6,8}$/.test(code);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid code. Must be 6-8 alphanumeric characters." },
          { status: 400 }
        );
      }

      // Check uniqueness: Return 409 if exists [cite: 70, 75]
      const existing = await prisma.link.findUnique({
        where: { shortCode: code },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Code already in use" },
          { status: 409 }
        );
      }
    } else {
      // Generate random code if none provided
      code = Math.random().toString(36).substring(2, 8);
    }

    // Save to Database
    const newLink = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode: code,
      },
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 2. GET: List all links for the Dashboard [cite: 32-36]
export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}
