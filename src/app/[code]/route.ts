import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return new NextResponse("Link not found", { status: 404 });
  }

  // Update stats without blocking
  prisma.link
    .update({
      where: { id: link.id },
      data: {
        clicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    })
    .catch((e) => console.error("Stats update failed", e));

  // 👇 THIS IS THE CRITICAL CHANGE
  return NextResponse.redirect(link.originalUrl, { status: 302 });
}
