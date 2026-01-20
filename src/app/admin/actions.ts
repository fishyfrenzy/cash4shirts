"use server";

export async function verifyAdminPassword(password: string): Promise<boolean> {
    const correctPassword = process.env.ADMIN_PASSWORD || "averymatt2026";
    return password === correctPassword;
}
