import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: Fetch details for a single link (For the Stats Page)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

// 2. DELETE: Delete the link
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    await prisma.link.delete({
      where: { shortCode: code },
    });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }
}
