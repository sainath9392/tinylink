import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  // 1. Find the link [cite: 25]
  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  // 2. If deleted or missing, return 404 [cite: 29, 77]
  if (!link) {
    return new NextResponse("Link not found", { status: 404 });
  }

  // 3. Async: Update stats (Increment clicks & timestamp) [cite: 26, 76]
  // We do not 'await' this so the redirect is instant for the user.
  prisma.link
    .update({
      where: { id: link.id },
      data: {
        clicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    })
    .catch((e) => console.error("Stats update failed", e));

  // 4. Perform 302 Redirect to original URL [cite: 25, 64]
  return NextResponse.redirect(link.originalUrl);
}
