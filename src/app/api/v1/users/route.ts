import { userCreateSchema } from "./schemas";
import { NextRequest, NextResponse } from "next/server";

import password from "@/models/password";
import validator from "@/models/validator";
import user, { IUserCreateDTO } from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IUserCreateDTO;

    const parsedBody = userCreateSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          errors: parsedBody.error.errors.map((err) => ({
            [err.path[0]]: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const userExists = await user.findOneByEmail(body.email);

    if (userExists) {
      return NextResponse.json(
        { error: "Esse email já está sendo usado por outro usuário" },
        { status: 409 }
      );
    }

    const passwordInput = body.password;
    const hashedPassword = await password.hash(passwordInput);

    const createdUser = await user.create({
      ...body,
      password: hashedPassword,
    });

    let serializedUser = validator.omit(createdUser, "password");
    return NextResponse.json(serializedUser, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
