import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetailsForm from "./components/DetailsForm";
import HealthOptions from "./components/HealthOptions";
import Intro from "./components/Intro";
import CompanionChat from "./components/CompanionChat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/details" element={<DetailsForm />} />
        <Route path="/health-options" element={<HealthOptions />} />
        {/* chatbot ke liye ek naya route */}
        <Route path="/companion" element={<CompanionChat />} />
      </Routes>
    </BrowserRouter>
  );
}
