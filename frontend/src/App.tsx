import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthModal } from "@/components/auth/AuthModal";
import { Toaster } from "@/components/ui/Toaster";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Chat from "@/pages/Chat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route element={<MainLayout />}>
          <Route path="/"     element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
      <AuthModal />
      <Toaster />
    </BrowserRouter>
  );
}
