
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreatorPage from "./pages/CreatorPage";
import Dashboard from "./pages/Dashboard";
import RewardPage from "./pages/RewardPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EditCreatorPage from "./pages/EditCreatorPage";
import AboutUs from "./pages/AboutUs";
import ExploreCreators from "./pages/ExploreCreators";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/criador/:username" element={<CreatorPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editar-pagina" element={<EditCreatorPage />} />
          <Route path="/recompensa/:rewardId" element={<RewardPage />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<AboutUs />} />
          <Route path="/explorar" element={<ExploreCreators />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
