import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/constants";

/**
 * Privacy policy, required by the Google Play and App Store data-safety
 * forms. Kept standalone (locale-free) so store reviewers and app users
 * always have one stable English URL to link to.
 */
export const metadata: Metadata = {
  title: "Privacy Policy — Prince Jahknow Crown Interior Services",
  description:
    "How Prince Jahknow Crown Interior Services collects, uses and protects your information on our website and apps.",
  robots: { index: false, follow: true },
};

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "Who we are",
    body: [
      `${BUSINESS_INFO.name} ("we", "us") is an interior-design studio in Lagos, Nigeria (BN Reg. No. ${BUSINESS_INFO.regNo}, CAC). This policy covers our website, our progressive web app and our store apps on Apple and Google.`,
      `Contact: ${BUSINESS_INFO.email} · ${BUSINESS_INFO.phone} · ${BUSINESS_INFO.address}`,
    ],
  },
  {
    heading: "What we collect",
    body: [
      "Quote and contact details that you send us: your name, phone number, project location, property type, the service you are interested in and any message or photos you share (mostly over WhatsApp).",
      "Basic technical data served by our hosting platform (Vercel) and Google Analytics-style aggregates, such as page views and device type. We do not use this to identify individuals.",
    ],
  },
  {
    heading: "What we do NOT do",
    body: [
      "We do not sell your information to anyone.",
      "We do not use advertising or cross-site tracking.",
      "Our apps and site are free: we never ask for payment details in browsing flows. Payments are agreed and handled personally on your project, not here.",
    ],
  },
  {
    heading: "Where your data lives",
    body: [
      "Website form submissions and content shown on the site are stored with our hosting and database providers (Vercel and Supabase). Enquiries sent on WhatsApp stay in the official WhatsApp Business platform.",
      "Our store apps open our live website inside the app, so the same rules apply there as on the web.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep your project enquiry only as long as we need it to quote, plan or complete your project, or to meet record-keeping obligations.",
      "Ask us at any time to correct or delete your details, and we will action it promptly.",
    ],
  },
  {
    heading: "Store policies",
    body: [
      "Both the Apple App Store and Google Play ask us to declare data usage. To summarise for those forms: we collect contact information (name, phone number, project location) voluntarily sent by you, and basic usage analytics. Nothing is resold or used for advertising.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "If this policy changes materially, the updated version appears on this page with a revised date. Continued use of the site or apps means you accept the current version.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
      <p className="eyebrow text-primary/80">Prince Jahknow Crown Interior Services</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-muted-foreground">Last updated: October 2026</p>

      <div className="mt-10 flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
            <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-muted-foreground">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        Questions? Email{" "}
        <Link
          href={`mailto:${BUSINESS_INFO.email}`}
          className="text-primary underline underline-offset-4"
        >
          {BUSINESS_INFO.email}
        </Link>
        . <br />
        <Link href="/en" className="text-primary underline underline-offset-4">
          Back to the site
        </Link>
      </p>
    </main>
  );
}
