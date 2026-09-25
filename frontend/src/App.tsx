import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthModal } from "@/components/auth/AuthModal";
import { Toaster } from "@/components/ui/Toaster";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Chat from "@/pages/Chat";
import Locations from "@/pages/Locations";
import LocationDetail from "@/pages/LocationDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route element={<MainLayout />}>
          <Route path="/"              element={<Landing />} />
          <Route path="/chat"          element={<Chat />} />
          <Route path="/locations"     element={<Locations />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
        </Route>
      </Routes>
      <AuthModal />
      <Toaster />
    </BrowserRouter>
  );
}
