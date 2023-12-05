import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const user = await prisma.user.create({
        data: { name: body.name, email: body.email, age: parseInt(body.age), isActive: true }
    });

    return NextResponse.json(user, { status: 201 })
}