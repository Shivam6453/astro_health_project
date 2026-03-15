import React from "react";
import { useNavigate } from "react-router-dom";
import DetailsForm from "../components/DetailsForm";

export default function Details() {
  const navigate = useNavigate();

  return (
    <div className="page-layout">
      <button
        className="btn btn-secondary"
        onClick={() => navigate("/")}
        style={{ marginBottom: 20 }}
      >
        ← Back to home
      </button>
      <DetailsForm />
    </div>
  );
}
