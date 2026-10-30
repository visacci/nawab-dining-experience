import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { submitEnquiry, enquirySchema } from "@/lib/enquiries";
import { BISTRO } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Kind = "reservation" | "contact" | "event";
type Field =
  | "venue" | "full_name" | "email" | "phone" | "subject" | "event_type"
  | "preferred_date" | "preferred_time" | "guests" | "message";

const FIELDS: Record<Kind, Field[]> = {
  reservation: ["venue", "full_name", "phone", "email", "preferred_date", "preferred_time", "guests", "message"],
  contact: ["full_name", "email", "phone", "venue", "subject", "message"],
  event: ["full_name", "email", "phone", "event_type", "venue", "preferred_date", "guests", "message"],
};

const LABELS: Record<Field, string> = {
  venue: "Venue",
  full_name: "Full name",
  email: "Email address",
  phone: "Phone number",
  subject: "Subject",
  event_type: "Event type",
  preferred_date: "Preferred date",
  preferred_time: "Preferred time",
  guests: "Number of guests",
  message: "",
};

const REQUIRED: Record<Kind, Field[]> = {
  reservation: ["venue", "full_name", "phone", "preferred_date", "preferred_time", "guests"],
  contact: ["full_name", "email", "message"],
  event: ["full_name", "email", "phone", "event_type", "venue"],
};

const fieldCls =
  "peer w-full border-0 border-b border-current/25 bg-transparent px-0 pb-2 pt-6 text-base outline-none transition-colors focus:border-primary placeholder:text-transparent";

export function EnquiryForm({
  kind,
  defaultVenue,
  dark,
  className,
}: {
  kind: Kind;
  defaultVenue?: string;
  dark?: boolean;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [serverError, setServerError] = useState("");
  const fields = FIELDS[kind];
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw: Record<string, unknown> = { kind };
    fd.forEach((v, k) => (raw[k] = String(v)));
    if (!raw["guests"]) delete raw["guests"];

    const errs: Partial<Record<Field, string>> = {};
    for (const f of REQUIRED[kind]) if (!String(raw[f] ?? "").trim()) errs[f] = "This field is required";
    const parsed = enquirySchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as Field;
        if (k && !errs[k]) errs[k] = issue.message;
      }
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("loading");
    setServerError("");
    try {
      await submitEnquiry(parsed.data!);
      setStatus("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={cn("py-10 text-center", className)} role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-5 text-3xl">
          {kind === "reservation" ? "Reservation request received" : "Thank you — message received"}
        </h3>
        <p className={cn("mx-auto mt-3 max-w-md text-sm", dark ? "text-on-ink-muted" : "text-muted-foreground")}>
          {kind === "reservation"
            ? "This is a request, not yet a confirmed booking. Our team will be in touch to confirm availability."
            : "Our team will get back to you as soon as possible."}{" "}
          For anything urgent at the Bistro, call{" "}
          <a href={`tel:${BISTRO.tel}`} className="text-primary underline">{BISTRO.phone}</a>.
        </p>
        <button onClick={() => setStatus("idle")} className="eyebrow mt-6 text-primary">Send another</button>
      </div>
    );
  }

  const input = (f: Field) => {
    const id = `${kind}-${f}`;
    const req = REQUIRED[kind].includes(f);
    const label = (
      <label htmlFor={id} className="eyebrow absolute left-0 top-0 text-[0.62rem] opacity-70">
        {f === "message" ? (kind === "reservation" ? "Special requests" : kind === "event" ? "Additional information" : "Message") : LABELS[f]}
        {req && <span className="text-primary"> *</span>}
      </label>
    );
    let control;
    if (f === "venue") {
      control = (
        <select id={id} name={f} defaultValue={defaultVenue ?? ""} className={cn(fieldCls, "cursor-pointer")}>
          <option value="" className="text-ink">Select a venue</option>
          <option className="text-ink">Nawab Asian Bistro</option>
          <option className="text-ink">Nawab Gardens</option>
          {kind !== "reservation" && <option className="text-ink">Not sure yet</option>}
        </select>
      );
    } else if (f === "event_type") {
      control = (
        <select id={id} name={f} defaultValue="" className={cn(fieldCls, "cursor-pointer")}>
          <option value="" className="text-ink">Select an occasion</option>
          {["Wedding", "Birthday", "Anniversary", "Private party", "Corporate meeting", "Business lunch", "Family gathering", "Other"].map((o) => (
            <option key={o} className="text-ink">{o}</option>
          ))}
        </select>
      );
    } else if (f === "message") {
      control = <textarea id={id} name={f} rows={4} maxLength={2000} className={cn(fieldCls, "resize-none")} />;
    } else {
      const type =
        f === "email" ? "email" : f === "phone" ? "tel" : f === "preferred_date" ? "date" : f === "preferred_time" ? "time" : f === "guests" ? "number" : "text";
      control = (
        <input
          id={id}
          name={f}
          type={type}
          min={type === "date" ? today : type === "number" ? 1 : undefined}
          max={type === "number" ? 1000 : undefined}
          maxLength={f === "full_name" ? 100 : f === "subject" ? 150 : undefined}
          autoComplete={f === "full_name" ? "name" : f === "email" ? "email" : f === "phone" ? "tel" : undefined}
          className={fieldCls}
          aria-invalid={!!errors[f]}
        />
      );
    }
    return (
      <div key={f} className={cn("relative", (f === "message" || f === "subject") && "sm:col-span-2")}>
        {label}
        {control}
        {errors[f] && <p className="mt-1 text-xs text-destructive">{errors[f]}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className={cn("grid gap-x-8 gap-y-7 sm:grid-cols-2", className)}>
      {fields.map(input)}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={cn("text-xs", dark ? "text-on-ink-muted" : "text-muted-foreground")}>
          {kind === "reservation"
            ? "Submitting sends a reservation request. We'll contact you to confirm."
            : "We'll only use your details to respond to your enquiry. "}
          {kind !== "reservation" && <Link to="/privacy" className="underline">Privacy policy</Link>}
        </p>
        <Button type="submit" variant="brand" size="xl" disabled={status === "loading"}>
          {status === "loading" ? <Loader2 className="animate-spin" /> : null}
          {status === "loading" ? "Sending" : kind === "reservation" ? "Request table" : kind === "event" ? "Send enquiry" : "Send message"}
          {status !== "loading" && <ArrowRight className="transition-transform group-hover:translate-x-1" />}
        </Button>
      </div>
      {status === "error" && <p className="text-sm text-destructive sm:col-span-2" role="alert">{serverError}</p>}
    </form>
  );
}
