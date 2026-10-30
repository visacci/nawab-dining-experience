import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const opt = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const enquirySchema = z.object({
  kind: z.enum(["reservation", "contact", "event"]),
  venue: opt(60),
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s()-]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: opt(150),
  event_type: opt(60),
  preferred_date: opt(10),
  preferred_time: opt(10),
  guests: z.coerce.number().int().min(1).max(1000).optional(),
  message: opt(2000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

const blank = (value?: string) => (value && value.length ? value : null);

export async function submitEnquiry(data: EnquiryInput) {
  if (data.website) return { ok: true as const };
  const { error } = await supabase.from("enquiries").insert({
    kind: data.kind,
    venue: blank(data.venue),
    full_name: data.full_name,
    email: blank(data.email),
    phone: blank(data.phone),
    subject: blank(data.subject),
    event_type: blank(data.event_type),
    preferred_date: blank(data.preferred_date),
    preferred_time: blank(data.preferred_time),
    guests: data.guests ?? null,
    message: blank(data.message),
  });
  if (error) {
    console.error("enquiry insert failed", error);
    throw new Error("We couldn't send your request. Please try again or call us.");
  }
  return { ok: true as const };
}
