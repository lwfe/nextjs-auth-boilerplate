import bcrypt from "bcrypt";
import { userCreateSchema } from "./schemas";
import user, { IUserCreateDTO } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // pegar informações do usuário
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

    // verificar se o usuário já existe no db
    const userExists = await user.findOneByEmail(body.email);

    if (userExists) {
      return NextResponse.json(
        { error: "Esse email já está sendo usado por outro usuário" },
        { status: 409 }
      );
    }

    // criptograr a senha
    const password = body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    // inserir no bd
    const createdUser = await user.create({
      ...body,
      password: hashedPassword,
    });

    // retornar usuário criado
    return NextResponse.json(createdUser, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
