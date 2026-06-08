"use server";

import { cookies } from "next/headers";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { Lead, LeadStatus, RecentBuyInsert } from "@/types";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE = "c4s_admin";

// httpOnly session token = hash of the admin password. The browser can't read or
// forge it; the server recomputes the expected value to authorize each action.
const sessionToken = () =>
  createHash("sha256").update(`c4s::${ADMIN_PASSWORD}`).digest("hex");

export async function verifyAdminPassword(password: string): Promise<boolean> {
  // Fail closed: if ADMIN_PASSWORD isn't configured, no password can authenticate.
  const ok = Boolean(ADMIN_PASSWORD) && password === ADMIN_PASSWORD;
  if (ok) {
    (await cookies()).set(COOKIE, sessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
  }
  return ok;
}

async function assertAdmin(): Promise<void> {
  const c = await cookies();
  if (c.get(COOKIE)?.value !== sessionToken()) {
    throw new Error("Not authorized — please log in again.");
  }
}

// ── Lead operations (service role — bypasses RLS after admin check) ──
export async function getLeads(filterStatus: string, filterLocation: string): Promise<Lead[]> {
  await assertAdmin();
  const supabase = createAdminClient();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (filterStatus !== "all") query = query.eq("status", filterStatus);
  if (filterLocation !== "all") query = query.eq("location", filterLocation);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Lead[];
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await assertAdmin();
  const { error } = await createAdminClient().from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setLeadNotes(id: string, adminNotes: string): Promise<void> {
  await assertAdmin();
  const { error } = await createAdminClient().from("leads").update({ admin_notes: adminNotes }).eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Recent Buys (Hall of Fame) write operations ──
export async function addRecentBuy(buy: RecentBuyInsert): Promise<void> {
  await assertAdmin();
  const { error } = await createAdminClient().from("recent_buys").insert([buy]);
  if (error) throw new Error(error.message);
}

export async function removeRecentBuy(id: string): Promise<void> {
  await assertAdmin();
  const { error } = await createAdminClient().from("recent_buys").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
