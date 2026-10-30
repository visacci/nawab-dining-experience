import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Nawab" },
      { name: "description", content: "How Nawab Asian Bistro and Nawab Gardens handle the details you share through our website." },
      { property: "og:title", content: "Privacy Policy — Nawab" },
      { property: "og:description", content: "How we handle your enquiry and reservation details." },
    ],
  }),
  component: () => (
    <LegalPage title="Privacy Policy">
      <p>This summary explains how we handle information you share through this website. The full policy will be finalised by Nawab's management.</p>
      <h2>What we collect</h2>
      <p>When you send a reservation request, event enquiry or message, we collect the details you enter — such as your name, phone number, email address, preferred date and any notes.</p>
      <h2>How we use it</h2>
      <p>We use these details only to respond to your request and arrange your visit or event. We do not sell your information.</p>
      <h2>Contact</h2>
      <p>To ask about or remove your details, please contact us through the contact page.</p>
    </LegalPage>
  ),
});
