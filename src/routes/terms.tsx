import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Nawab" },
      { name: "description", content: "Terms for using the Nawab Asian Bistro and Nawab Gardens website." },
      { property: "og:title", content: "Terms & Conditions — Nawab" },
      { property: "og:description", content: "Terms for using the Nawab website." },
    ],
  }),
  component: () => (
    <LegalPage title="Terms & Conditions">
      <p>These terms cover use of this website. Full terms will be finalised by Nawab's management.</p>
      <h2>Reservation requests</h2>
      <p>Submitting a reservation request through this website does not guarantee a table. A booking is confirmed only when our team contacts you to confirm it.</p>
      <h2>Images</h2>
      <p>Photographs show Nawab Asian Bistro, Nawab Gardens, and dishes from our kitchens. Menus and table settings can change.</p>
      <h2>Information</h2>
      <p>We aim to keep information accurate, but menus, facilities and availability may change. Please contact us to confirm details before your visit.</p>
    </LegalPage>
  ),
});
