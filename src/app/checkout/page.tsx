"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Truck, Clock } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/lib/store";
import { formatPrice, getDeliveryDate } from "@/lib/utils";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { items, getTotal } = useCartStore();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-28 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center py-20">
            <p className="font-body text-charcoal/40 dark:text-white/40">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid =
    form.fullName.trim() &&
    form.mobile.trim().length >= 10 &&
    form.address.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.pincode.trim().length === 6;

  const handleProceed = () => {
    if (!isValid) return;
    // Store checkout info in sessionStorage
    sessionStorage.setItem("aura-checkout", JSON.stringify(form));
    router.push("/payment");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 font-body text-sm text-charcoal/50 dark:text-white/50 hover:text-aura-600 mb-8"
            >
              <ArrowLeft size={14} /> Back to Cart
            </Link>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-10">
              {["Details", "Payment", "Confirmation"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm ${
                      i === 0
                        ? "bg-aura-600 text-white"
                        : "bg-aura-100 dark:bg-aura-900/40 text-charcoal/40 dark:text-white/40"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`font-body text-sm hidden sm:inline ${
                      i === 0
                        ? "text-aura-600 font-medium"
                        : "text-charcoal/40 dark:text-white/40"
                    }`}
                  >
                    {step}
                  </span>
                  {i < 2 && (
                    <div className="w-8 sm:w-16 h-px bg-aura-200 dark:bg-aura-800" />
                  )}
                </div>
              ))}
            </div>

            <h1 className="section-title mb-8">Delivery Details</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-5">
                <div className="card">
                  <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-aura-500" /> Shipping Address
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1.5 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1.5 block">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1.5 block">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="House/Flat no., Street, Locality"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1.5 block">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1.5 block">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-charcoal/60 dark:text-white/60 uppercase tracking-wider mb-1.5 block">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="card bg-aura-50 dark:bg-aura-950/30 border-aura-200 dark:border-aura-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-aura-100 dark:bg-aura-900/40 flex items-center justify-center shrink-0">
                      <Truck size={18} className="text-aura-600" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-charcoal dark:text-white">
                        Estimated Delivery
                      </p>
                      <p className="font-body text-sm text-charcoal/60 dark:text-white/60 flex items-center gap-1 mt-1">
                        <Clock size={12} /> Delivery within 7 days (maximum)
                      </p>
                      <p className="font-body text-xs text-aura-600 dark:text-aura-400 mt-1">
                        Expected by: {getDeliveryDate()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card sticky top-28">
                  <h3 className="font-display text-xl mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="flex justify-between font-body text-sm"
                      >
                        <span className="text-charcoal/60 dark:text-white/60 line-clamp-1 flex-1 mr-2">
                          {item.name} ({item.size}) x{item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-aura-100 dark:border-aura-900/30 pt-3 space-y-2">
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-charcoal/60 dark:text-white/60">Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-aura-100 dark:border-aura-900/30">
                      <span className="font-body font-medium">Total</span>
                      <span className="font-display text-xl text-aura-600 dark:text-aura-400">
                        {formatPrice(getTotal())}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleProceed}
                    disabled={!isValid}
                    className="btn-primary w-full mt-6 gap-2"
                  >
                    Proceed to Payment <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
