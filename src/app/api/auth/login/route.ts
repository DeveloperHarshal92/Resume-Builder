import { generateToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { LoginBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: LoginBody = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All the fields are required",
        },
        { status: 400 },
      );
    }

    const userExists = await userModel.findOne({ email });

    if (!userExists) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const isPasswordValid = userExists.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    const token = generateToken({
      userId: userExists._id.toString(),
      email: userExists.email,
    });

    const response = await NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User logged in successfully",
        data: {
          _id: userExists._id,
          name: userExists.name,
          email: userExists.email,
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 days
    });

    return response;
  } catch (err) {
    console.log("Error in login API: ", err);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
        error: {
          err,
        },
      },
      { status: 500 },
    );
  }
}
