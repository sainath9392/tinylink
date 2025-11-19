import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  // 1. AWAIT params here too
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
