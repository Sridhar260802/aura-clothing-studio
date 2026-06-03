"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-aura-50 via-white to-aura-100 dark:from-aura-950 dark:via-charcoal dark:to-aura-900/40 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="card !p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-4 overflow-hidden rounded-full">
              <Image src="/logo.jpeg" alt="Aura" fill className="object-cover" />
            </div>
            <h1 className="font-display text-2xl text-charcoal dark:text-white">Admin Login</h1>
            <p className="font-body text-sm text-charcoal/50 dark:text-white/50 mt-1">
              Aura Clothing Studio Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-white/40"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 font-body text-sm">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
