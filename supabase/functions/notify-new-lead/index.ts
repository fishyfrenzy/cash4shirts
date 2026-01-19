// Supabase Edge Function: notify-new-lead
// Sends SMS notification via Twilio when a new lead is submitted

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const OWNER_PHONE_NUMBER = Deno.env.get("OWNER_PHONE_NUMBER");

interface LeadPayload {
  id: string;
  full_name: string;
  phone_number: string;
  location: string;
}

async function sendTwilioSMS(to: string, body: string): Promise<Response> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: to,
      From: TWILIO_PHONE_NUMBER!,
      Body: body,
    }),
  });

  return response;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Validate environment variables
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER || !OWNER_PHONE_NUMBER) {
      console.error("Missing Twilio configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse the lead data
    const lead: LeadPayload = await req.json();

    // Format the notification message
    let locationLabel = "";
    if (lead.location === "indianapolis") {
      locationLabel = "Indiana";
    } else if (lead.location === "florida") {
      locationLabel = "Florida";
    } else {
      locationLabel = lead.location; // Use the custom location string
    }

    const message = `🔔 New Cash4Shirts Lead!\n\nName: ${lead.full_name}\nPhone: ${lead.phone_number}\nLocation: ${locationLabel}\n\nCheck the admin dashboard for photos and details.`;

    // Send SMS to business owner
    const smsResponse = await sendTwilioSMS(OWNER_PHONE_NUMBER, message);

    if (!smsResponse.ok) {
      const errorData = await smsResponse.json();
      console.error("Twilio error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send SMS", details: errorData }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const smsResult = await smsResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent",
        sid: smsResult.sid,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
