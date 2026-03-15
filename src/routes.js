import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DetailsForm from "./components/DetailsForm";
import HealthOptions from "./components/HealthOptions";
import PhysicalHealth from "./pages/PhysicalHealth";
import MentalHealth from "./pages/MentalHealth";
import ChatbotPage from "./pages/ChatbotPage";
import ISRO from "./pages/ISRO";
import NASA from "./pages/NASA";
import HealthGraph from "./pages/HealthGraph";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/astronaut-details" element={<DetailsForm />} />
      <Route path="/details" element={<DetailsForm />} />
      <Route path="/health-options" element={<HealthOptions />} />
      <Route path="/physical-health" element={<PhysicalHealth />} />
      <Route path="/monitor" element={<PhysicalHealth />} />
      <Route path="/mental-health" element={<MentalHealth />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/isro" element={<ISRO />} />
      <Route path="/nasa" element={<NASA />} />
      <Route path="/health-graph" element={<HealthGraph />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
