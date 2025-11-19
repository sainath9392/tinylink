import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  try {
    // Delete the link [cite: 27-28]
    await prisma.link.delete({
      where: { shortCode: code },
    });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    // Return 404 if it doesn't exist
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }
}
