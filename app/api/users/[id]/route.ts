import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({
        where: { id: parseInt(params.id) }
    });

    return NextResponse.json({});
}
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();

    const updatedUser = await prisma.user.update({
        where: {id: parseInt(params.id)},
        data: {
            name: body.name,
            email: body.email,
            age: parseInt(body.age)
        }
    });

    return NextResponse.json(updatedUser);
}
