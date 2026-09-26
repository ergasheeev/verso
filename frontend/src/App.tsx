import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthModal } from "@/components/auth/AuthModal";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { TourProvider } from "@/components/ui/Tour";
import Landing from "@/pages/Landing";
import Atlas from "@/pages/Atlas";
import { useAppStore } from "@/store";

// Route-level code splitting. The app shipped as one ~785 KB script, so a
// first-time visitor paid for the chat screen, the legal pages, the whole
// services catalog and the auth flow before seeing a single pixel. Landing
// and Atlas stay in the entry bundle on purpose — they ARE the first paint
// for guests and returning visitors respectively, and lazy-loading the page
// someone actually landed on would just move the delay, not remove it.
const Auth           = lazy(() => import("@/pages/Auth"));
const Privacy        = lazy(() => import("@/pages/Privacy"));
const Terms          = lazy(() => import("@/pages/Terms"));
const Locations       = lazy(() => import("@/pages/Locations"));
const LocationDetail  = lazy(() => import("@/pages/LocationDetail"));
const Chat            = lazy(() => import("@/pages/Chat"));
const RestaurantDetail = lazy(() => import("@/pages/RestaurantDetail"));
const HotelDetail      = lazy(() => import("@/pages/HotelDetail"));
const Profile        = lazy(() => import("@/pages/Profile"));
const SavedPlaces    = lazy(() => import("@/pages/SavedPlaces"));
const CountryHub     = lazy(() => import("@/pages/CountryHub"));
const Pro            = lazy(() => import("@/pages/Pro"));
const Community      = lazy(() => import("@/pages/Community"));

// Chunk-fetch fallback. Deliberately quiet — a full-screen branded splash
// for what is usually a sub-second gap would flash more than it helps.
function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]" role="status" aria-label="Loading">
      <span className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-gold-400 animate-spin" />
    </div>
  );
}

// Must track the canvas tokens in index.css, so a phone paints its browser
// chrome in the page's own colours.
const THEME_COLOR = { dark: "#0C0A09", light: "#FAF6EF" } as const;

function ThemeApplier() {
  // Selectors rather than a whole-store destructure: this component sits
  // above the router and re-rendering it on every toast is pure waste.
  const theme = useAppStore((s) => s.theme);
  const lang  = useAppStore((s) => s.lang);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    // Mirror for the pre-paint script in index.html (which prefers the
    // zustand blob and only falls back to this key).
    localStorage.setItem("verso-theme", theme);
    // Repaint the mobile browser chrome to match. The two static
    // <meta theme-color media="..."> tags in index.html follow the OS
    // scheme, which is NOT what the app follows — someone using the app
    // in light mode on a phone set to dark got a black status bar over a
    // cream page. This overrides both with the app's actual theme.
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((m) => {
        m.removeAttribute("media");
        m.content = THEME_COLOR[theme];
      });
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}

export default function App() {
  const markTourSeen = useAppStore((s) => s.markTourSeen);
  return (
    // index.css collapses CSS animations under prefers-reduced-motion, but that rule
    // cannot touch framer-motion: framer drives transforms from JS as inline styles,
    // so `transition-duration: 0.01ms !important` never applies to it. Every page
    // transition, modal entrance, toast spring and layout-shared indicator in the app
    // is framer-driven. `reducedMotion="user"` makes framer read the same media query
    // and drop transform/layout animation while keeping opacity cross-fades, the
    // same trade-off the CSS block documents.
    <MotionConfig reducedMotion="user">
    <TourProvider onComplete={markTourSeen}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeApplier />
      <AuthModal />
      <CommandPalette />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Always renders — a public landing page reachable regardless of session state
            ("/" is the public page; the app lives at its own path). Landing itself adapts
            its header and CTAs for an already-signed-in visitor instead of the route
            redirecting them away. */}
        <Route path="/" element={<Landing />} />
        {/* Static, public, unauthenticated — deliberately outside
            MainLayout (no sidebar/app-shell) since Google's OAuth
            verification crawler and logged-out visitors both need to
            reach these without hitting any auth gate. */}
        {/* Standalone auth. The modal still exists for in-app prompts —
            it keeps the visitor's context — while these are real,
            shareable addresses reachable from the landing page. */}
        <Route path="/login"  element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms"   element={<Terms />} />
        <Route element={<MainLayout />}>
          {/* The atlas is the app's root: the product covers every country. */}
          <Route path="/atlas"         element={<Atlas />} />
          <Route path="/c/:slug"       element={<CountryHub />} />
          <Route path="/pro"           element={<Pro />} />
          {/* /home redirects to the atlas so old links and bookmarks still resolve. */}
          <Route path="/home"          element={<Navigate to="/atlas" replace />} />
          {/* Places and Services are one section — see the note at the top of Locations.tsx.
              /services redirects here; the detail routes it owned (a restaurant's menu, a
              hotel's booking form) keep their own pages. */}
          <Route path="/locations"     element={<Locations />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/services"      element={<Navigate to="/locations?tab=restoranlar" replace />} />
          <Route path="/chat"          element={<Chat />} />
          <Route path="/services/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/services/hotels/:id"      element={<HotelDetail />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/community"     element={<Community />} />
          {/* Legacy single-country URL: redirects so existing links and any indexed URL
              still resolve rather than 404ing into the catch-all. */}
          <Route path="/uzbekistan"    element={<Navigate to="/c/uzbekistan" replace />} />
          <Route path="/saved"         element={<SavedPlaces />} />
        </Route>
        <Route path="*" element={<Navigate to="/atlas" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </TourProvider>
    </MotionConfig>
  );
}
