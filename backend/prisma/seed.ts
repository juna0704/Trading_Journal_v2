import "../src/config/env";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import argon2 from "argon2";
import { Decimal } from "../src/generated/prisma/runtime/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional)
  await prisma.trade.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "trader@example.com",
      password: await argon2.hash("Password123!"),
      firstName: "Test",
      lastName: "Trader",
      isEmailVerified: true,
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  const strategy = await prisma.strategy.create({
    data: {
      name: "Breakout Strategy",
      userId: user.id,
    },
  });

  console.log(`✅ Created strategy: ${strategy.name}`);

  await prisma.trade.create({
    data: {
      userId: user.id,
      strategyId: strategy.id,
      symbol: "BTC/USDT",
      side: "LONG",
      entryPrice: new Decimal("45000.5"),
      exitPrice: new Decimal("47000.75"),
      quantity: new Decimal("0.5"),
      leverage: 2,
      fees: new Decimal("10.25"),
      pnlNet: new Decimal("990.13"),
      pnlPercentage: new Decimal("4.44"),
      entryTimestamp: new Date("2024-01-15T10:00:00Z"),
      exitTimestamp: new Date("2024-01-15T16:30:00Z"),
      notes: "Strong breakout above resistance",
    },
  });

  console.log("✅ Created sample trade");
  console.log("🎉 Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
