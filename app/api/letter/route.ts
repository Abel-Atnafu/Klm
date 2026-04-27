import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const letter = await prisma.letter.findFirst({ orderBy: { id: "desc" } });
  if (!letter) {
    return NextResponse.json({ error: "No letter found" }, { status: 404 });
  }
  return NextResponse.json(letter);
}

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, body: letterBody, signoff } = body;

  if (!title || !letterBody || !signoff) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.letter.findFirst({ orderBy: { id: "desc" } });

  let letter;
  if (existing) {
    letter = await prisma.letter.update({
      where: { id: existing.id },
      data: { title, body: letterBody, signoff },
    });
  } else {
    letter = await prisma.letter.create({
      data: { title, body: letterBody, signoff },
    });
  }

  return NextResponse.json(letter);
}
