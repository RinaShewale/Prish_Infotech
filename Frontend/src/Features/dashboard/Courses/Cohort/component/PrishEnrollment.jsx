import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  ShieldCheck,
  Mail,
  Award,
  ArrowRight,
  Lock,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { usePayment } from "../../hooks/usePayment";
import { useEnrollment } from "../../hooks/useEnrollment";
import { useCoupon } from "../../hooks/useCoupon";
import { useNavigate } from "react-router-dom";
import loadRazorpay from "../../utils/loadRazorpay";

export const PrishEnrollment = ({ courseData, title }) => {
  const navigate = useNavigate();

  // Hooks
  const { enrollments, fetchEnrollments, loading: enrollmentLoading } = useEnrollment();
  const { handleCreateOrder, handleVerifyPayment } = usePayment();
  const {
    handleValidateCoupon,
    handleResetCoupon,
    discount: couponDiscount,
    success: couponApplied,
    error: couponError,
    loading: couponLoading,
  } = useCoupon();

  const [coupon, setCoupon] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // 1. Fetch enrollments and reset coupon on mount
  useEffect(() => {
    if (courseData?._id) {
      fetchEnrollments();
      handleResetCoupon();
    }
  }, [courseData?._id]);

  // 2. Derive enrollment status (Fixes flickering on reload)
  const isAlreadyEnrolled = useMemo(() => {
    if (!enrollments || enrollmentLoading) return false;
    return enrollments.some(
      (e) => (e.course?._id || e.course) === courseData?._id
    );
  }, [enrollments, courseData?._id, enrollmentLoading]);

  // 3. Pricing Logic (Exact breakdown as requested)
  const originalPrice = Number(courseData?.oldPrice || 0);
  const basePrice = Number(courseData?.price || 0); // Price after website discount
  const discountPercent = Number(courseData?.discount || 0);
  const courseDiscount = originalPrice - basePrice;

  const platformFee = 100;
  const finalCoursePrice = basePrice - couponDiscount; // Price after Coupon
  const subtotal = finalCoursePrice + platformFee;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  // 4. Backend Coupon Logic
  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    await handleValidateCoupon({
      code: coupon.toUpperCase(),
      amount: basePrice,
    });
  };

  const handleCheckout = async () => {
    if (isAlreadyEnrolled) {
      setShowPopup(true);
      return;
    }

    try {
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const response = await handleCreateOrder({
        courseId: courseData?._id,
        originalPrice,
        coursePrice: basePrice,
        discountAmount: courseDiscount,
        discountPercent,
        couponCode: couponApplied ? coupon.toUpperCase() : "",
        couponDiscount,
        platformFee,
        gst,
        totalAmount: total,
      });

      if (response?.alreadyEnrolled) {
        setShowPopup(true);
        return;
      }

      const order = response?.order;
      if (!order) return;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Prish Infotech",
        description: courseData?.title,
        image: courseData?.thumbnail,
        order_id: order.id,
        handler: async function (response) {
          try {
            const res = await handleVerifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: courseData?._id,
            });

            if (res?.enrolled || res?.success) {
              await fetchEnrollments();
              window.location.reload();
            }
          } catch (error) {
            alert("Payment Verification Failed");
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#ffffff" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <section className="py-24 px-4 bg-bg relative overflow-hidden">
      {/* POPUP MODAL */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#0A0A0A] border border-white/10 p-10 rounded-[40px] max-w-md w-full shadow-2xl text-center"
            >
              <button onClick={() => setShowPopup(false)} className="absolute top-6 right-6 text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-3">Course Access</h3>
              <p className="text-text-secondary mb-8 leading-relaxed">
                You are enrolled in <strong>{courseData?.title}</strong>. Head to your dashboard to start learning.
              </p>
              <button
                onClick={() => navigate(`/classroom/course/${courseData?._id}`)}
                className="w-full bg-green-500 text-white py-6 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-xl"
              >
                Go to Classroom <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Complete Your <span className="text-accent italic">Purchase</span>
          </h2>
          <p className="text-text-secondary mt-4 text-sm uppercase tracking-widest font-medium">
            Secure Checkout Powered by Prish Infotech
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl shadow-black/80">
          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
            <div className="lg:col-span-7 p-8 md:p-14">
              <div className="flex flex-col md:flex-row gap-10 items-start mb-14">
                <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                  <img src={courseData?.thumbnail} className="w-full h-full object-cover opacity-80" alt="Thumb" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 leading-tight">
                    {title || courseData?.title}
                  </h3>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-xl md:text-2xl text-text-secondary line-through opacity-60">₹{originalPrice.toLocaleString()}</span>
                    <span className="text-3xl md:text-4xl font-display font-bold text-white">₹{basePrice.toLocaleString()}</span>
                    <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-black rounded-lg uppercase italic">Save {discountPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Coupon UI */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mb-5">
                <div className="relative flex-1">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/50" />
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 transition-all text-sm placeholder:text-white/20"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="bg-accent text-bg px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-accent/10"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>

              {(couponApplied || couponError) && (
                <div className={`mb-10 px-4 py-3 rounded-xl text-sm font-medium ${couponApplied ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                  {couponApplied ? "Coupon Applied Successfully! 🎉" : couponError}
                </div>
              )}

              {/* Support Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                <div className="flex flex-col gap-3">
                  <ShieldCheck className="w-6 h-6 text-accent/60" />
                  <h5 className="text-white text-xs font-bold uppercase">3-Days Refund</h5>
                </div>
                <div className="flex flex-col gap-3">
                  <Mail className="w-6 h-6 text-accent/60" />
                  <h5 className="text-white text-xs font-bold uppercase">Support</h5>
                </div>
                <div className="flex flex-col gap-3">
                  <Award className="w-6 h-6 text-accent/60" />
                  <h5 className="text-white text-xs font-bold uppercase">Certified</h5>
                </div>
              </div>
            </div>

            {/* PAYMENT SUMMARY (Broken down as requested) */}
            <div className="lg:col-span-5 bg-white/[0.01] p-8 md:p-14 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-10">Payment Summary</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Original Price</span>
                    <span className="text-white font-mono opacity-60 line-through">₹{originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-accent font-medium">
                    <span>Course Discount</span>
                    <span>-₹{courseDiscount.toLocaleString()}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between items-center text-sm text-green-400 font-medium">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-bold border-t border-white/5 pt-4">
                    <span className="text-text-secondary">Final Course Price</span>
                    <span className="text-white">₹{finalCoursePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Platform Fee</span>
                    <span className="text-white font-mono">₹{platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">GST (18%)</span>
                    <span className="text-white font-mono">₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="pt-8 mt-4 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-accent font-bold uppercase block mb-1">Total to Pay</span>
                      <span className="text-4xl font-display font-bold text-white">₹{total.toLocaleString()}</span>
                    </div>
                    <Lock className="w-5 h-5 text-white/10 mb-2" />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-14">
                {enrollmentLoading ? (
                  <button className="w-full bg-white/5 text-white/40 py-6 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-4 cursor-wait">
                    <Loader2 className="w-5 h-5 animate-spin" /> Checking Enrollment...
                  </button>
                ) : isAlreadyEnrolled ? (
                  <button
                    onClick={() => navigate(`/classroom`)}
                    className="w-full bg-green-500 text-white py-6 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-xl"
                  >
                    Go to Classroom <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <motion.button
                    onClick={handleCheckout}
                    whileTap={{ scale: 0.98 }}
                    className="w-full group bg-white text-bg py-6 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-4 hover:bg-accent transition-all duration-500 shadow-2xl"
                  >
                    Proceed to Checkout{" "}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};