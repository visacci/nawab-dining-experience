import { createFileRoute } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Logo } from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Enquiry = Tables<"enquiries">;
type KindFilter = "all" | Enquiry["kind"];

const FILTERS: { id: KindFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "reservation", label: "Reservations" },
  { id: "contact", label: "Messages" },
  { id: "event", label: "Events" },
];

const KIND_LABEL: Record<string, string> = {
  reservation: "Reservation",
  contact: "Message",
  event: "Event",
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff — Nawab" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-ink text-on-ink">
      <div className="container-x flex items-center justify-between py-6">
        <Logo light />
        {session ? (
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 text-sm text-on-ink-muted hover:text-on-ink"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        ) : null}
      </div>
      <div className="container-x pb-20">
        {!ready ? (
          <p className="text-on-ink-muted">Loading…</p>
        ) : session ? (
          <Inbox email={session.user.email ?? "Staff"} />
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setPending(false);
    if (signInError) setError(signInMessage(signInError.message));
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-md bg-paper p-8 text-ink shadow-elegant sm:p-10">
      <p className="eyebrow text-primary">Staff</p>
      <h1 className="mt-3 text-4xl">Sign in</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Reservations, event enquiries and contact messages are listed after you sign in.
      </p>
      <label className="mt-8 block text-sm">
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full border border-ink/15 bg-background px-3 py-3 outline-none focus:border-primary"
        />
      </label>
      <label className="mt-5 block text-sm">
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full border border-ink/15 bg-background px-3 py-3 outline-none focus:border-primary"
        />
      </label>
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      <Button type="submit" variant="brand" size="lg" className="mt-8 w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

function Inbox({ email }: { email: string }) {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<KindFilter>("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (loadError) {
      setError(loadError.message);
      setRows([]);
      return;
    }
    setError("");
    setRows(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.kind === filter)),
    [rows, filter],
  );

  async function remove(id: string) {
    if (!window.confirm("Remove this enquiry? This cannot be undone.")) return;
    const { data, error: deleteError } = await supabase.from("enquiries").delete().eq("id", id).select("id");
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    if (!data?.length) {
      setError("That enquiry could not be removed. This account needs permission to delete rows in Supabase.");
      return;
    }
    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <div>
      <p className="eyebrow text-primary">Inbox</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl sm:text-5xl">Bookings & messages</h1>
        <p className="text-sm text-on-ink-muted">{email}</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "border px-4 py-2 text-xs uppercase tracking-[0.16em]",
              filter === item.id ? "border-primary bg-primary text-primary-foreground" : "border-on-ink/20 text-on-ink-muted",
            )}
          >
            {item.label}
            <span className="ml-2">
              {item.id === "all" ? rows.length : rows.filter((row) => row.kind === item.id).length}
            </span>
          </button>
        ))}
      </div>
      {error ? <p className="mt-6 max-w-2xl text-sm text-primary-glow">{error}</p> : null}
      {loading ? <p className="mt-10 text-on-ink-muted">Loading enquiries…</p> : null}
      {!loading && visible.length === 0 ? (
        <p className="mt-10 text-on-ink-muted">Nothing here yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {visible.map((row) => (
            <li key={row.id} className="bg-paper p-6 text-ink shadow-elegant">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-primary">{KIND_LABEL[row.kind] ?? row.kind}</p>
                  <h2 className="mt-2 text-3xl">{row.full_name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{formatWhen(row.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <Detail label="Phone" value={row.phone} />
                <Detail label="Email" value={row.email} />
                <Detail label="Venue" value={row.venue} />
                <Detail label="Date" value={row.preferred_date} />
                <Detail label="Time" value={row.preferred_time} />
                <Detail label="Guests" value={row.guests == null ? null : String(row.guests)} />
                <Detail label="Event" value={row.event_type} />
                <Detail label="Subject" value={row.subject} />
              </dl>
              {row.message ? <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed">{row.message}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function signInMessage(message: string) {
  if (/email.*(disabled|not enabled)/i.test(message)) {
    return "Email sign-in is turned off in Supabase. Enable the Email provider, create a staff user, then try again.";
  }
  return message;
}
