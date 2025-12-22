import request from "supertest";
import app from "../../app";
import { prisma } from "../../config";
import { cleanDatabase } from "../helper";

describe("Auth & Access Control Verification", () => {
  // Credentials for our test user
  const testUser = {
    email: "trader@test.com",
    password: "Password123!",
    firstName: "Test",
    lastName: "Trader",
  };

  let userToken: string;

  beforeAll(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- 1. REGISTRATION ---
  it("should allow a new user to register", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // --- 2. LOGIN & TOKEN GENERATION ---
  it("should return a JWT on successful login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
    userToken = res.body.data.accessToken; // Save for next tests
  });

  // --- 3. PROTECTED ROUTE ACCESS ---
  it("should allow a logged-in user to access /me", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });

  // --- 4. ADMIN SECURITY (The 'Don't Worry' Test) ---
  it("should block a regular user from admin endpoints", async () => {
    const res = await request(app)
      .get("/api/admin/pending-users") // This route is in your new admin.routes.ts
      .set("Authorization", `Bearer ${userToken}`);

    // This proves your requireAdmin middleware is working!
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toContain("Admin access required");
  });
});
