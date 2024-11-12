"use client";
import React, { useEffect } from "react";
import LoginForm from "./components/Login";
import RegisterForm from "./components/Register";
import AuthManager from "@/services/AuthManager";

const AuthPage = () => {
  useEffect(() => {
    AuthManager.revokeTokens();
  }, []);

  return (
    <div className="grid grid-cols-3">
      <RegisterForm />
      <LoginForm />
    </div>
  );
};

export default AuthPage;
