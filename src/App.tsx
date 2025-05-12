
import { Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import CreatorPage from "@/pages/CreatorPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCanceled from "@/pages/PaymentCanceled";
import RewardPage from "@/pages/RewardPage";
import Terms from "@/pages/Terms";
import ExploreCreators from "@/pages/ExploreCreators";
import AdminDashboard from "@/pages/AdminDashboard";
import PackagesPage from "@/pages/PackagesPage";
import PackageFormPage from "@/pages/PackageFormPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import MyPageFullDashboard from "@/pages/MyPageFullDashboard";

// Import for auth-protected routes
import PrivateRoute from "@/components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/sobre" element={<AboutUs />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/explorar" element={<ExploreCreators />} />
      <Route path="/termos" element={<Terms />} />
      
      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      
      {/* Creator Pages */}
      <Route path="/criador/:username" element={<CreatorPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/dashboard/pacotes" element={
        <PrivateRoute>
          <PackagesPage />
        </PrivateRoute>
      } />
      <Route path="/dashboard/pacotes/:id" element={
        <PrivateRoute>
          <PackageFormPage />
        </PrivateRoute>
      } />
      <Route path="/dashboard/pacotes/novo" element={
        <PrivateRoute>
          <PackageFormPage />
        </PrivateRoute>
      } />
      <Route path="/dashboard/pacotes/editar/:id" element={
        <PrivateRoute>
          <PackageFormPage />
        </PrivateRoute>
      } />
      <Route path="/dashboard/perfil" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />
      <Route path="/dashboard/minha-pagina" element={
        <PrivateRoute>
          <MyPageFullDashboard />
        </PrivateRoute>
      } />
      <Route path="/dashboard/configuracoes" element={
        <PrivateRoute>
          <SettingsPage />
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute adminOnly>
          <AdminDashboard />
        </PrivateRoute>
      } />
      
      {/* Payment Pages */}
      <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
      <Route path="/pagamento/cancelado" element={<PaymentCanceled />} />
      <Route path="/recompensa/:id" element={<RewardPage />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
