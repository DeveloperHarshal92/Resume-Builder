import { generateToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: RegisterBody = await req.json();

    const { name, email, password, mobile } = body;

    if (!name || !email || !password) {
      return (
        NextResponse.json<ApiResponse>({
          success: false,
          message: "All the fields are required",
        }),
        { status: 400 }
      );
    }

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return (
        NextResponse.json<ApiResponse>({
          success: false,
          message: "User already exists",
        }),
        { status: 409 }
      );
    }

    const newUser = new userModel({
      name,
      email,
      password,
      mobile,
    });

    await newUser.save();

    const token = generateToken({ userId: newUser._id.toString(), email: newUser.email });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User registered successfully",
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
        },
      },
      {
        status: 201,
      },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 days
    });

    return response;

  } catch (error) {
    console.log("Error in register API: ", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal Server Error",
        error: {error},
      },
      { status: 500 },
    );
  }
}
