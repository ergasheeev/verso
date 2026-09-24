import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Toaster } from "@/components/ui/Toaster";
import Landing from "@/pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
