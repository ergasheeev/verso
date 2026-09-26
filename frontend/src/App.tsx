import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthModal } from "@/components/auth/AuthModal";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { Toaster } from "@/components/ui/Toaster";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Chat from "@/pages/Chat";
import Locations from "@/pages/Locations";
import LocationDetail from "@/pages/LocationDetail";
import Atlas from "@/pages/Atlas";
import CountryHub from "@/pages/CountryHub";
import RestaurantDetail from "@/pages/RestaurantDetail";
import HotelDetail from "@/pages/HotelDetail";
import Profile from "@/pages/Profile";
import SavedPlaces from "@/pages/SavedPlaces";
import Pro from "@/pages/Pro";
import Community from "@/pages/Community";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms"   element={<Terms />} />
        <Route element={<MainLayout />}>
          <Route path="/"              element={<Landing />} />
          <Route path="/atlas"         element={<Atlas />} />
          <Route path="/c/:slug"       element={<CountryHub />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/saved"         element={<SavedPlaces />} />
          <Route path="/pro"           element={<Pro />} />
          <Route path="/community"     element={<Community />} />
          <Route path="/chat"          element={<Chat />} />
          <Route path="/locations"     element={<Locations />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/services/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/services/hotels/:id"      element={<HotelDetail />} />
        </Route>
      </Routes>
      <AuthModal />
      <CommandPalette />
      <Toaster />
    </BrowserRouter>
  );
}
