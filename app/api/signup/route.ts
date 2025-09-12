export async function POST(req: Request) {
  console.log("Signup route hit");  // log 1
  try {
    const { name, email, password } = await req.json();
    console.log("Body received:", { name, email, password });  // log 2

    if (!email || !password) {
      console.log("Missing fields");  // log 3
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    console.log("Exists result:", exists);  // log 4
    if (exists) {
      console.log("Email already registered");  // log 5
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log("Password hashed");  // log 6

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    console.log("User created:", user);  // log 7

    const { password: _p, ...publicUser } = user as any;
    return NextResponse.json({ user: publicUser }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);   // log error
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
