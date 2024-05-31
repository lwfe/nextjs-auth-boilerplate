import bcrypt from "bcrypt";

async function hash(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function compare(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export default Object.freeze({ hash, compare });
