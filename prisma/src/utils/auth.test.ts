import { hashPassword, comparePassword } from "./auth";

describe("hashPassword & comparePassword", () => {
    it("should hash and verify password correctly", async () => {
        const plain = "secret123";
        const hash = await hashPassword(plain);

        expect(hash).not.toBe(plain);
        expect(hash).toMatch(/^\$2[aby]\$.{56}$/);

        const isMatch = await comparePassword(plain, hash);
        expect(isMatch).toBe(true);
    });

    it("should return false if password does not match", async () => {
        const plain = "secret123";
        const wrong = "wrongpassword";
        const hash = await hashPassword(plain);

        const isMatch = await comparePassword(wrong, hash);
        expect(isMatch).toBe(false);
    });
});
