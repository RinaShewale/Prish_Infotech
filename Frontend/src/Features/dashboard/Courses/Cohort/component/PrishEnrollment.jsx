import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Ticket, 
  ShieldCheck, 
  Mail, 
  Award,
  ArrowRight,
  Lock
} from 'lucide-react';

export const PrishEnrollment = ({ courseData, price, oldPrice, title }) => {
  const [coupon, setCoupon] = useState("");

  // Use pricing data directly from courseData
  const pricing = courseData?.pricing || {
    originalPrice: 11999,
    basePrice: 4999,
    discount: 7000,
    discountPercent: 58,
    platformFee: 100,
    gst: 918,
    total: 6017
  };

  return (
    <section className="py-24 px-4 bg-bg relative overflow-hidden">
      {/* Brand Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Complete Your <span className="text-accent italic">Purchase</span>
          </h2>
          <p className="text-text-secondary mt-4 text-sm uppercase tracking-widest font-medium">Secure Checkout Powered by Prish Infotech</p>
        </div>

        {/* Main Enrollment Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl shadow-black/80">
          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
            
            {/* LEFT SIDE: COURSE & TRUST (7 Cols) */}
            <div className="lg:col-span-7 p-8 md:p-14">
              <div className="flex flex-col md:flex-row gap-10 items-start mb-14">
                {/* Course Image with Browser Window Deco */}
                <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                  <img 
                    src={courseData?.image || "https://images.unsplash.com/photo-1775896194071-f3311de4dabb?w=800&auto=format&fit=crop&q=80"} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                    alt="Course Thumbnail" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 leading-tight">
                    {title || courseData?.title || "Data Science and Analytics with GenAI"}
                  </h3>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl md:text-2xl text-text-secondary line-through opacity-60">₹{pricing.originalPrice.toLocaleString()}</span>
                      <span className="text-3xl md:text-4xl font-display font-bold text-white">₹{pricing.basePrice.toLocaleString()}</span>
                    </div>
                    <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-black rounded-lg uppercase tracking-tighter italic">
                        Save {pricing.discountPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mb-16">
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
                <button className="bg-accent text-bg px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/10">
                  Apply
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                <div className="flex flex-col gap-3">
                  <ShieldCheck className="w-6 h-6 text-accent/60" />
                  <div>
                    <h5 className="text-white text-xs font-bold uppercase tracking-wide">3-Days Refund</h5>
                    <p className="text-text-secondary text-[10px] mt-1">No questions asked policy</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Mail className="w-6 h-6 text-accent/60" />
                  <div>
                    <h5 className="text-white text-xs font-bold uppercase tracking-wide">Support</h5>
                    <p className="text-text-secondary text-[10px] mt-1">hello@prishinfotech.com</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Award className="w-6 h-6 text-accent/60" />
                  <div>
                    <h5 className="text-white text-xs font-bold uppercase tracking-wide">Certified</h5>
                    <p className="text-text-secondary text-[10px] mt-1">Industry recognized certificate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: PAYMENT SUMMARY (5 Cols) */}
            <div className="lg:col-span-5 bg-white/[0.01] p-8 md:p-14 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-10">Payment Summary</h4>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Original Price</span>
                    <span className="text-white font-mono text-sm font-medium line-through opacity-60">₹{pricing.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Discount ({pricing.discountPercent}%)</span>
                    <span className="text-accent font-mono text-sm font-medium">-₹{pricing.discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Base Price</span>
                    <span className="text-white font-mono text-sm font-medium">₹{pricing.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Platform Fee</span>
                    <span className="text-white font-mono text-sm font-medium">₹{pricing.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">GST (18%)</span>
                    <span className="text-white font-mono text-sm font-medium">₹{pricing.gst.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-8 mt-4 border-t border-white/10 flex justify-between items-end">
                    <div>
                        <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-1">Total to Pay</span>
                        <span className="text-4xl font-display font-bold text-white">₹{pricing.total.toLocaleString()}</span>
                    </div>
                    <Lock className="w-5 h-5 text-white/10 mb-2" />
                  </div>
                </div>
              </div>

              <div className="mt-14">
                <button className="w-full group bg-white text-bg py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-accent transition-all duration-500 shadow-2xl">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center justify-center gap-2 mt-6 opacity-20">
                    <div className="h-px w-8 bg-white" />
                    <span className="text-[9px] uppercase font-bold tracking-widest text-white">Prish Infotech Secure</span>
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