// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert into officers table
    const q = `
      INSERT INTO officers (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;
    const result = await pool.query(q, [name, email, hashed]);

    return NextResponse.json({ message: "User created", user: result.rows[0] }, { status: 201 });
  } catch (err: any) {
    console.error("Signup error:", err);
    // Unique violation code for Postgres
    if (err?.code === "23505") {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
