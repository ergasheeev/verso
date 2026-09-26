// LEGAL DISCLAIMER (dev/maintainer note, not shown to users):
// This is a reasonable MVP starting draft, generated to satisfy Google's
// OAuth consent-screen requirement for a publicly reachable privacy
// policy. It has NOT been reviewed by a lawyer. Before a real public
// launch, have counsel review this in full — the "Data Retention",
// "Third-Party Services", and jurisdiction-dependent language below vary
// significantly by where the business is actually registered and which
// users' data protection laws apply (GDPR, etc.).
//
// TODO(i18n): currently English-only. Google's OAuth verification only
// requires an accessible English (or any single-language) policy, but
// this should eventually get UZ/RU/ZH/DE/FR versions to match the rest
// of the app — this content is long-form legal text, not short UI
// chrome strings, so it deliberately isn't in i18n/translations.ts (see
// the same reasoning already applied to Uzbekistan.tsx's page content).
import { LegalLayout } from "@/components/legal/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="July 30, 2026">
      <section>
        <h2>1. Introduction</h2>
        <p>
          Verso ("we", "our", "the app") is an editorial travel atlas covering fifty-one
          countries, helping travellers research destinations, build itineraries with the help of
          an AI assistant ("Verso AI"), and read and leave reviews. This Privacy Policy explains
          what information we collect, how we use it, and the choices you have — whether you're
          browsing as a guest or have created an account.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p><strong>Account information.</strong> If you create an account with your email, we
          collect your name, email address, and password (stored only as a securely hashed value —
          we never store or have access to your plain-text password).</p>
        <p><strong>Google Sign-In.</strong> If you sign in with Google, we receive your name,
          email address, and profile photo. We only request the basic <code>openid</code>,
          <code> email</code>, and <code>profile</code> scopes — we do not request access to your
          Google Drive, contacts, calendar, or any other Google data.</p>
        <p><strong>Usage data.</strong> To provide the service, we store the places you save,
          trip plans and itineraries you build, messages you send to Verso AI, and reviews you
          submit.</p>
        <p><strong>Technical data.</strong> Like most web services, we automatically collect
          standard technical information such as IP address, browser type, and device/OS
          information for security and analytics purposes.</p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>Personalizing place recommendations and itinerary suggestions</li>
          <li>Powering Verso AI's conversational trip-planning features</li>
          <li>Operating your account (login, saved places, your review history)</li>
          <li>Maintaining, securing, and improving the service</li>
          <li>Communicating important service updates (e.g. security notices)</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <p>We rely on the following third-party services to operate Verso. Using the app means
          your data may be processed by:</p>
        <ul>
          <li><strong>Google OAuth</strong> — for Google Sign-In authentication.</li>
          <li><strong>Groq</strong> (our AI/LLM inference provider) — when you chat with Verso AI
            or request a smart review summary, the text of your message is sent to Groq's API to
            generate a response. Review the content of anything sensitive you type accordingly.</li>
          <li><strong>Vercel</strong> — hosts our frontend web application.</li>
          <li><strong>Render</strong> — hosts our backend API server.</li>
          <li><strong>Neon</strong> — hosts our PostgreSQL database.</li>
        </ul>
        <p>Each of these providers has its own privacy practices governing infrastructure-level
          processing of data that passes through their systems.</p>
      </section>

      <section>
        <h2>5. Data Storage &amp; Security</h2>
        <p>All traffic between your browser and our servers is encrypted in transit (HTTPS/TLS).
          Passwords are hashed before storage and never stored in plain text. We take reasonable,
          industry-standard measures to protect your data, but no method of transmission or
          storage is 100% secure, and we cannot guarantee absolute security.</p>
      </section>

      <section>
        <h2>6. Cookies &amp; Local Storage</h2>
        <p>We use:</p>
        <ul>
          <li>A short-lived JWT access token and a longer-lived refresh token (stored as an
            httpOnly cookie) to keep you signed in</li>
          <li>Local storage to remember your theme (light/dark) and language preference</li>
          <li>Local storage to keep your saved places/trip plan in sync before you sign in</li>
        </ul>
        <p>We do not use third-party advertising or tracking cookies.</p>
      </section>

      <section>
        <h2>7. Your Rights</h2>
        <p>You can access or correct your account information at any time from your Profile page.
          To request deletion of your account and associated data, use the "Delete account" option
          in Profile → Settings, or contact us at the address below.</p>
      </section>

      <section>
        <h2>8. Data Retention</h2>
        <p>We retain your account data for as long as your account is active. When you delete
          your account, we remove your personal information within a reasonable period, except
          where retaining certain records is required for legal, security, or fraud-prevention
          purposes.</p>
      </section>

      <section>
        <h2>9. Children's Privacy</h2>
        <p>Verso is not directed at children under 13, and we do not knowingly collect personal
          information from children under 13. If you believe a child has provided us with personal
          information, please contact us so we can remove it.</p>
      </section>

      <section>
        <h2>10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. If we make material changes,
          we'll update the "Last updated" date above and, where appropriate, notify you in-app.</p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions about this policy? Contact us at{" "}
          <span className="italic text-[var(--muted-foreground)]">
            [PLACEHOLDER: support email]
          </span>.
        </p>
        <p className="text-xs text-[var(--muted-foreground)]/70 italic">
          Registered business entity and jurisdiction: [PLACEHOLDER: fill in before production launch]
        </p>
      </section>
    </LegalLayout>
  );
}
