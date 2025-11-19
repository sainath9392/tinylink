import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. POST: Create a new link
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, shortCode } = body;

    // Get the User ID from headers
    const userId = request.headers.get("x-user-id");

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let code = shortCode;

    if (code) {
      // Validation: Must be 6-8 alphanumeric characters
      const isValid = /^[a-zA-Z0-9]{6,8}$/.test(code);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid code. Must be 6-8 alphanumeric characters." },
          { status: 400 }
        );
      }

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
      code = Math.random().toString(36).substring(2, 8);
    }

    // Save to Database WITH the User ID
    const newLink = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode: code,
        userId: userId || "anonymous", // Fallback if no ID found
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

// 2. GET: List links ONLY for the current user
export async function GET(request: Request) {
  // Get the User ID from headers
  const userId = request.headers.get("x-user-id");

  const links = await prisma.link.findMany({
    where: {
      userId: userId || "anonymous", // Only show links for this user
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}
