import database from "@/infra/database";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: "default" | "admin";
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserCreateDTO
  extends Omit<IUser, "id" | "created_at" | "updated_at"> {}

async function create(user: IUserCreateDTO): Promise<IUser> {
  const query = await database.query({
    text: `INSERT INTO "USERS" (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    values: [user.name, user.email, user.password],
  });
  return query?.rows[0];
}

async function findOneByEmail(email: string): Promise<IUser | null> {
  const query = await database.query({
    text: `SELECT * FROM "USERS" WHERE email = $1`,
    values: [email],
  });

  if (!query?.rows[0]) return null;

  return query?.rows[0];
}

export default Object.freeze({ create, findOneByEmail });
