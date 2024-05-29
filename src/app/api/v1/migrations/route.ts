import { join } from "path";
import database from "@/infra/database";
import { NextResponse } from "next/server";
import migrationRunner, { RunnerOption } from "node-pg-migrate";

const defaultMigrationOptions: RunnerOption = {
  dbClient: {} as any,
  dryRun: true,
  dir: join("src", "infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

export async function GET() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return NextResponse.json(pendingMigrations, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  } finally {
    if (dbClient) await dbClient.end();
  }
}

export async function POST() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return NextResponse.json(migratedMigrations, { status: 201 });
    }

    return NextResponse.json(migratedMigrations, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  } finally {
    if (dbClient) await dbClient.end();
  }
}
