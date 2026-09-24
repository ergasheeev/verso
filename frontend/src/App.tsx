import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/Toaster";
import Landing from "@/pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
