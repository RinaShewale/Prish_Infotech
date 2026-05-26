import React, { useState } from "react";

import { motion } from "framer-motion";

import {
  Ticket,
  ShieldCheck,
  Mail,
  Award,
  ArrowRight,
  Lock,
} from "lucide-react";

import { usePayment } from "../../hooks/usePayment";

import loadRazorpay from "../../utils/loadRazorpay";

export const PrishEnrollment = ({
  courseData,
  title,
}) => {

  const [coupon, setCoupon] =
    useState("");

  const [
    couponDiscount,
    setCouponDiscount,
  ] = useState(0);

  const [
    couponApplied,
    setCouponApplied,
  ] = useState(false);

  const [
    couponMessage,
    setCouponMessage,
  ] = useState("");

  const {
    handleCreateOrder,
    handleVerifyPayment,
  } = usePayment();

  const originalPrice =
    Number(
      courseData?.oldPrice || 0
    );

  const basePrice =
    Number(
      courseData?.price || 0
    );

  const discountPercent =
    Number(
      courseData?.discount || 0
    );

  const courseDiscount =
    originalPrice - basePrice;

  const applyCoupon = () => {

    const code =
      coupon.trim().toUpperCase();

    if (code === "PRISH100") {

      setCouponDiscount(100);

      setCouponApplied(true);

      setCouponMessage(
        "₹100 Coupon Applied 🎉"
      );
    }

    else if (
      code === "PRISH500"
    ) {

      setCouponDiscount(500);

      setCouponApplied(true);

      setCouponMessage(
        "₹500 Coupon Applied 🎉"
      );
    }

    else {

      setCouponDiscount(0);

      setCouponApplied(false);

      setCouponMessage(
        "Invalid Coupon Code"
      );
    }
  };

  const platformFee = 100;

  const discountedPrice =
    basePrice - couponDiscount;

  const subtotal =
    discountedPrice +
    platformFee;

  const gst = Math.round(
    subtotal * 0.18
  );

  const total =
    subtotal + gst;

  const handleCheckout =
    async () => {

      try {

        const razorpayLoaded =
          await loadRazorpay();

        if (!razorpayLoaded) {

          alert(
            "Razorpay SDK failed to load"
          );

          return;
        }

        const response =
          await handleCreateOrder(
            {
              courseId:
                courseData?._id,

              originalPrice,

              coursePrice:
                basePrice,

              discountAmount:
                courseDiscount,

              discountPercent,

              couponCode:
                couponApplied
                  ? coupon.toUpperCase()
                  : "",

              couponDiscount,

              platformFee,

              gst,

              totalAmount:
                total,
            }
          );

        const order =
          response?.order;

        if (!order) {

          alert(
            "Failed to create order"
          );

          return;
        }

        const options = {

          key:
            import.meta.env
              .VITE_RAZORPAY_KEY,

          amount:
            order.amount,

          currency:
            order.currency,

          name:
            "Prish Infotech",

          description:
            courseData?.title,

          image:
            courseData?.thumbnail,

          order_id:
            order.id,

          handler:
            async function (
              response
            ) {

              try {

                await handleVerifyPayment(
                  {
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,

                    courseId:
                      courseData?._id,
                  }
                );

                alert(
                  "Payment Successful 🎉"
                );

              } catch (error) {

                console.log(error);

                alert(
                  "Payment Verification Failed"
                );
              }
            },

          prefill: {
            name: "",
            email: "",
            contact: "",
          },

          notes: {
            course:
              courseData?.title,
          },

          theme: {
            color: "#ffffff",
          },

          modal: {
            ondismiss: function () {
              console.log(
                "Checkout closed"
              );
            },
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();

      } catch (error) {

        console.log(error);

        alert(
          "Something went wrong"
        );
      }
    };

  return (
    <section className="py-24 px-4 bg-bg relative overflow-hidden">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        <div className="mb-12 text-center lg:text-left">

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">

            Complete Your{" "}

            <span className="text-accent italic">

              Purchase

            </span>
          </h2>

          <p className="text-text-secondary mt-4 text-sm uppercase tracking-widest font-medium">

            Secure Checkout Powered by
            Prish Infotech

          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl shadow-black/80">

          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5">

            <div className="lg:col-span-7 p-8 md:p-14">

              <div className="flex flex-col md:flex-row gap-10 items-start mb-14">

                <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">

                  <img
                    src={
                      courseData?.thumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                    }
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                    alt="Course Thumbnail"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                <div className="flex-1">

                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 leading-tight">

                    {title ||
                      courseData?.title}

                  </h3>

                  <div className="flex items-center gap-4 flex-wrap">

                    <div className="flex items-baseline gap-3">

                      <span className="text-xl md:text-2xl text-text-secondary line-through opacity-60">

                        ₹
                        {originalPrice.toLocaleString()}

                      </span>

                      <span className="text-3xl md:text-4xl font-display font-bold text-white">

                        ₹
                        {basePrice.toLocaleString()}

                      </span>
                    </div>

                    <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-black rounded-lg uppercase tracking-tighter italic">

                      Save{" "}
                      {discountPercent}%

                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mb-5">

                <div className="relative flex-1">

                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/50" />

                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={coupon}
                    onChange={(e) =>
                      setCoupon(
                        e.target.value
                      )
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 transition-all text-sm placeholder:text-white/20"
                  />
                </div>

                <button
                  onClick={applyCoupon}
                  className="bg-accent text-bg px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/10"
                >

                  Apply

                </button>
              </div>

              {couponMessage && (
                <div
                  className={`mb-10 px-4 py-3 rounded-xl text-sm font-medium ${
                    couponApplied
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >

                  {couponMessage}

                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/5">

                <div className="flex flex-col gap-3">

                  <ShieldCheck className="w-6 h-6 text-accent/60" />

                  <div>

                    <h5 className="text-white text-xs font-bold uppercase tracking-wide">

                      3-Days Refund

                    </h5>

                    <p className="text-text-secondary text-[10px] mt-1">

                      No questions asked policy

                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">

                  <Mail className="w-6 h-6 text-accent/60" />

                  <div>

                    <h5 className="text-white text-xs font-bold uppercase tracking-wide">

                      Support

                    </h5>

                    <p className="text-text-secondary text-[10px] mt-1">

                      hello@prishinfotech.com

                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">

                  <Award className="w-6 h-6 text-accent/60" />

                  <div>

                    <h5 className="text-white text-xs font-bold uppercase tracking-wide">

                      Certified

                    </h5>

                    <p className="text-text-secondary text-[10px] mt-1">

                      Industry recognized certificate

                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/[0.01] p-8 md:p-14 flex flex-col justify-between">

              <div>

                <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-10">

                  Payment Summary

                </h4>

                <div className="space-y-6">

                  <div className="flex justify-between items-center">

                    <span className="text-text-secondary text-sm">

                      Original Price

                    </span>

                    <span className="text-white font-mono text-sm font-medium line-through opacity-60">

                      ₹
                      {originalPrice.toLocaleString()}

                    </span>
                  </div>

                  <div className="flex justify-between items-center">

                    <span className="text-text-secondary text-sm">

                      Course Discount

                    </span>

                    <span className="text-accent font-mono text-sm font-medium">

                      -₹
                      {courseDiscount.toLocaleString()}

                    </span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between items-center">

                      <span className="text-text-secondary text-sm">

                        Coupon Discount

                      </span>

                      <span className="text-green-400 font-mono text-sm font-medium">

                        -₹
                        {couponDiscount.toLocaleString()}

                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">

                    <span className="text-text-secondary text-sm">

                      Final Course Price

                    </span>

                    <span className="text-white font-mono text-sm font-medium">

                      ₹
                      {discountedPrice.toLocaleString()}

                    </span>
                  </div>

                  <div className="flex justify-between items-center">

                    <span className="text-text-secondary text-sm">

                      Platform Fee

                    </span>

                    <span className="text-white font-mono text-sm font-medium">

                      ₹
                      {platformFee.toLocaleString()}

                    </span>
                  </div>

                  <div className="flex justify-between items-center">

                    <span className="text-text-secondary text-sm">

                      GST (18%)

                    </span>

                    <span className="text-white font-mono text-sm font-medium">

                      ₹
                      {gst.toLocaleString()}

                    </span>
                  </div>

                  <div className="pt-8 mt-4 border-t border-white/10 flex justify-between items-end">

                    <div>

                      <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-1">

                        Total to Pay

                      </span>

                      <span className="text-4xl font-display font-bold text-white">

                        ₹
                        {total.toLocaleString()}

                      </span>
                    </div>

                    <Lock className="w-5 h-5 text-white/10 mb-2" />
                  </div>
                </div>
              </div>

              <div className="mt-14">

                <motion.button
                  onClick={
                    handleCheckout
                  }
                  whileTap={{
                    scale: 0.98,
                  }}
                  whileHover={{
                    scale: 1.01,
                  }}
                  className="w-full group bg-white text-bg py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-accent transition-all duration-500 shadow-2xl"
                >

                  Proceed to Checkout

                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <div className="flex items-center justify-center gap-2 mt-6 opacity-20">

                  <div className="h-px w-8 bg-white" />

                  <span className="text-[9px] uppercase font-bold tracking-widest text-white">

                    Prish Infotech Secure

                  </span>

                  <div className="h-px w-8 bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};