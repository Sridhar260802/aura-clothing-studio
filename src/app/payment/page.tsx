"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function PaymentPage() {
  const [mounted, setMounted] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [checkoutInfo, setCheckoutInfo] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem("aura-checkout");
    if (stored) {
      setCheckoutInfo(JSON.parse(stored));
    }
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

  if (!checkoutInfo || items.length === 0) {
    if (!orderPlaced) {
      router.push("/cart");
      return null;
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handlePlaceOrder = async () => {
    if (!screenshot || !checkoutInfo) return;
    setLoading(true);
    setError("");

    try {
      // Upload screenshot
      const formData = new FormData();
      formData.append("file", screenshot);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      // Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: checkoutInfo.fullName,
          mobile: checkoutInfo.mobile,
          address: checkoutInfo.address,
          city: checkoutInfo.city,
          state: checkoutInfo.state,
          pincode: checkoutInfo.pincode,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
          total: getTotal(),
          paymentScreenshot: uploadData.url,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order failed");

      setOrderNumber(orderData.orderNumber);
      setOrderPlaced(true);
      clearCart();
      sessionStorage.removeItem("aura-checkout");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-28 pb-20">
          <div className="max-w-lg mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check size={36} className="text-green-600" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-white mb-3">
                Order Placed!
              </h1>
              <p className="font-body text-sm text-charcoal/60 dark:text-white/60 mb-2">
                Your order has been placed successfully.
              </p>
              <p className="font-body text-sm font-medium text-aura-600 dark:text-aura-400 mb-8">
                Order Number: {orderNumber}
              </p>
              <p className="font-body text-xs text-charcoal/50 dark:text-white/50 mb-8">
                You can track your order using the order number or your mobile number.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/track-order?order=${orderNumber}`} className="btn-primary">
                  Track Order
                </Link>
                <Link href="/products" className="btn-outline">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 font-body text-sm text-charcoal/50 dark:text-white/50 hover:text-aura-600 mb-8"
            >
              <ArrowLeft size={14} /> Back to Checkout
            </Link>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-10">
              {["Details", "Payment", "Confirmation"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm ${
                      i <= 1
                        ? "bg-aura-600 text-white"
                        : "bg-aura-100 dark:bg-aura-900/40 text-charcoal/40 dark:text-white/40"
                    }`}
                  >
                    {i < 1 ? <Check size={14} /> : i + 1}
                  </div>
                  <span
                    className={`font-body text-sm hidden sm:inline ${
                      i === 1
                        ? "text-aura-600 font-medium"
                        : i < 1
                        ? "text-green-600"
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

            <h1 className="section-title mb-8">Payment</h1>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Payment Info */}
              <div className="space-y-6">
                <div className="card text-center">
                  <h3 className="font-display text-xl mb-2">Pay via UPI</h3>
                  <p className="font-body text-sm text-charcoal/60 dark:text-white/60 mb-6">
                    Scan the QR code or use the UPI ID below to make your payment
                  </p>

                  {/* QR Code */}
                  <div className="relative w-56 h-56 mx-auto mb-4 rounded-xl overflow-hidden border-4 border-aura-200 dark:border-aura-800">
                    <Image
                      src="/qr-code.jpeg"
                      alt="UPI QR Code"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* UPI ID */}
                  <div className="bg-smoke dark:bg-charcoal/40 rounded-lg px-4 py-3 inline-block mb-4">
                    <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase tracking-wider mb-1">
                      UPI ID
                    </p>
                    <p className="font-body text-sm font-medium text-charcoal dark:text-white">
                      {process.env.NEXT_PUBLIC_UPI_ID || "9345632981@upi"}
                    </p>
                  </div>

                  <p className="font-display text-2xl text-aura-600 dark:text-aura-400">
                    {formatPrice(getTotal())}
                  </p>
                </div>

                {/* Upload Screenshot */}
                <div className="card">
                  <h3 className="font-display text-lg mb-3">Upload Payment Screenshot</h3>
                  <p className="font-body text-xs text-charcoal/50 dark:text-white/50 mb-4">
                    After making the payment, take a screenshot and upload it here to confirm your order.
                  </p>

                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {previewUrl ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-aura-300 dark:border-aura-700">
                        <Image
                          src={previewUrl}
                          alt="Payment screenshot"
                          fill
                          className="object-contain bg-smoke dark:bg-charcoal/40"
                        />
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-aura-200 dark:border-aura-800 rounded-lg p-8 text-center hover:border-aura-400 transition-colors">
                        <Upload size={24} className="mx-auto mb-2 text-aura-400" />
                        <p className="font-body text-sm text-charcoal/50 dark:text-white/50">
                          Click to upload screenshot
                        </p>
                        <p className="font-body text-xs text-charcoal/30 dark:text-white/30 mt-1">
                          JPG, PNG or JPEG
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 font-body text-sm">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={!screenshot || loading}
                  className="btn-primary w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Place Order
                    </>
                  )}
                </button>
              </div>

              {/* Order Summary */}
              <div>
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

                  {/* Shipping To */}
                  {checkoutInfo && (
                    <div className="mt-6 pt-4 border-t border-aura-100 dark:border-aura-900/30">
                      <p className="font-body text-xs text-charcoal/50 dark:text-white/50 uppercase tracking-wider mb-2">
                        Delivering to
                      </p>
                      <p className="font-body text-sm font-medium">{checkoutInfo.fullName}</p>
                      <p className="font-body text-xs text-charcoal/60 dark:text-white/60 mt-1">
                        {checkoutInfo.address}, {checkoutInfo.city}, {checkoutInfo.state} - {checkoutInfo.pincode}
                      </p>
                      <p className="font-body text-xs text-charcoal/60 dark:text-white/60">
                        Mobile: {checkoutInfo.mobile}
                      </p>
                    </div>
                  )}
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
