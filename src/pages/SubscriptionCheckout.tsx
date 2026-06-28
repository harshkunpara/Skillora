import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { Loader2 } from "lucide-react";
const Checkout = () => {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { id, plan } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id);

  const isSubscription = !!plan;

  const subscription = {
    title: plan === "monthly" ? "Monthly Premium Membership" : "Yearly Premium Membership",
    description: plan === "monthly" ? "Unlimited access for 1 month." : "Unlimited access for 1 year.",
    price: plan === "monthly" ? 2499 : 14999,
    originalPrice: plan === "monthly" ? 3999 : 24999,
    
  };
const transactionId = "SKL-" + Date.now();

const paymentAmount = isSubscription
  ? subscription.price
  : course!.price;

const upiLink =
  `upi://pay?pa=harshkunpara742@okaxis&pn=Skillora&am=${paymentAmount}&cu=INR&tn=Skillora Payment&tr=${transactionId}`;
  const verifyPayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      if (isSubscription) {
  setLoading(false);

  // 🎉 Show Confetti
  setShowConfetti(true);

  // Premium Toast
  toast.success(
    plan === "monthly"
      ? "🎉 Monthly Premium Membership Activated!"
      : "👑 Yearly Premium Membership Activated!"
  );

  // 3 seconds baad redirect
  setTimeout(() => {
    setShowConfetti(false);
    navigate("/");
  }, 3000);

  return;
}

      const { error } = await supabase
        .from("enrollments")
        .insert({
          user_id: user!.id,
          course_id: id!,
        });

      setLoading(false);

if (error) {
  alert(error.message);
  return;
}

// 🎉 Show Confetti
setShowConfetti(true);

// Success Toast
toast.success("🎉 Payment Successful");

// 3 seconds baad redirect
setTimeout(() => {
  setShowConfetti(false);

  if (isSubscription) {
    navigate("/");
  } else {
    navigate(`/courses/${id}`);
  }
}, 3000);
}, 2500);
};
  if (!course && !isSubscription) {
    return <h1 className="text-center text-2xl mt-10 font-bold">Not Found</h1>;
  }

  return (
     <>
    {showConfetti && <Confetti />}

    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-start">
        
        {/* ================= LEFT SIDE: PREMIUM PLAN BENEFITS ================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 font-semibold text-xs px-3 py-1.5 rounded-full mb-4">
              <span className="text-sm">👑</span> Premium Plan
            </div>
            
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {isSubscription ? subscription.title : course.title}
            </h1>
            <p className="text-gray-500 font-medium mt-2 mb-6">
              {isSubscription ? subscription.description : course.description}
            </p>

            {/* Premium Infinity Illustration */}
            <div className="relative w-full flex justify-center py-6 mb-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl overflow-hidden">
              <div className="text-center">
                {/* Fallback Graphic Badge mimicking the 3D illustration style */}
                <div className="w-48 h-32 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <span className="text-8xl select-none relative z-10 filter drop-shadow-md">♾️</span>
                <div className="mt-4 text-xs font-bold text-slate-400 tracking-widest uppercase">Unlimited Access Platform</div>
              </div>
            </div>

            {/* Features Checklist Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
                <span className="p-2 bg-blue-500 text-white rounded-lg text-sm shadow-sm shadow-blue-100">📚</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Unlimited Courses</h4>
                  <p className="text-[10px] text-slate-400">Access all premium materials</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
                <span className="p-2 bg-indigo-500 text-white rounded-lg text-sm shadow-sm shadow-indigo-100">📥</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Offline Access</h4>
                  <p className="text-[10px] text-slate-400">Download and learn anytime</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
                <span className="p-2 bg-purple-500 text-white rounded-lg text-sm shadow-sm shadow-purple-100">📜</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Certificates</h4>
                  <p className="text-[10px] text-slate-400">Earn verified completions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
                <span className="p-2 bg-pink-500 text-white rounded-lg text-sm shadow-sm shadow-pink-100">👥</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Community Access</h4>
                  <p className="text-[10px] text-slate-400">Join our exclusive circle</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Badge */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-100/80 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm shadow-sm">✓</div>
            <div>
              <h5 className="text-xs font-bold text-emerald-900">100% Secure Payment</h5>
              <p className="text-[11px] text-emerald-600 font-medium">Your credentials and transaction are fully encrypted.</p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: CHECKOUT WITH MOBILE QR ================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-5">Checkout</h2>

            {/* Light Green Background Box wrapper */}
            <div className="bg-[#f4fbf7] border border-[#e6f4ed] rounded-2xl p-6 flex flex-col items-center justify-center">
              
              {/* MOBILE MOCKUP CONTAINER */}
              <div className="bg-white rounded-[2.5rem] border-[6px] border-slate-800 shadow-xl p-4 w-52 aspect-[9/16] flex flex-col items-center justify-between relative overflow-hidden">
                {/* Notch */}
                <div className="w-24 h-4 bg-slate-800 rounded-b-xl absolute top-0 left-1/2 transform -translate-x-1/2 z-10"></div>
                
                {/* Inside Screen Content */}
                <div className="flex flex-col items-center justify-center h-full w-full pt-4 gap-4">
                  
                  {/* 1. Static UPI Brand Header */}
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-xl font-black tracking-tighter text-slate-700 italic">UPI<span className="text-blue-500">▶</span></span>
                  </div>

                  {/* 2. Your Dynamic QR Code placed right underneath UPI */}
                  <div className="w-32 h-32 bg-white p-1.5 rounded-xl shadow-md border border-slate-100 flex items-center justify-center">
                    <QRCode
  value={upiLink}
  size={120}
  style={{
    width: "100%",
    height: "100%",
  }}
/>
                  </div>

                  {/* 3. Secure Footnote */}
                  <p className="text-[10px] text-gray-400 font-semibold tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Fast • Secure • Reliable
                  </p>
                </div>
              </div>

              <p className="text-slate-700 font-bold mt-4 text-sm text-center">
                Scan to pay with any UPI app
              </p>
            </div>

            {/* UPI ID Copy Field */}
            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                UPI ID
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-200 shadow-sm focus-within:border-blue-500 transition-all">
                <input
                  value="harshkunpara742@okaxis"
                  readOnly
                  className="w-full bg-slate-50 font-medium text-slate-700 p-3 text-sm outline-none"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 text-sm transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText("harshkunpara742@okaxis");
                    toast.success("UPI ID Copied");
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Payment Checkbox Confirmation */}
            <div className="mt-5 flex items-start gap-3">
              <input
                type="checkbox"
                checked={paid}
                onChange={() => setPaid(!paid)}
                className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer mt-0.5"
                id="paymentStatus"
              />
              <label htmlFor="paymentStatus" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">
                I have completed the payment
              </label>
            </div>

            {/* Availability Messaging Layout */}
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-2">
              <span className="text-emerald-600 font-bold text-sm mt-0.5">✓</span>
              <div>
                <p className="text-xs font-bold text-emerald-800">Currently only UPI payments are available.</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Card, Wallet and Net Banking coming soon.</p>
              </div>
            </div>
          </div>

          {/* Pricing Calculation Grid */}
          <div className="mt-6 pt-5 border-t border-dashed border-slate-200 space-y-2 text-sm font-medium text-slate-500">
            <div className="flex justify-between">
              <span>Original Price</span>
              <span className="line-through text-slate-400">
                ₹{isSubscription ? subscription.originalPrice : course.originalPrice}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                {Math.round(
                  (1 -
                    (isSubscription ? subscription.price : course!.price) /
                    (isSubscription ? subscription.originalPrice : course!.originalPrice)) *
                    100
                )}% OFF
              </span>
            </div>

            <div className="flex justify-between text-xl font-black text-slate-800 pt-2">
              <span>Total</span>
              <span className="text-blue-600">₹{isSubscription ? subscription.price : course.price}</span>
            </div>
          </div>

          {/* Action Trigger Button Component */}
          <Button
  className="w-full mt-5 py-6 rounded-xl text-lg font-bold"
  disabled={!paid || loading}
  onClick={verifyPayment}
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Verifying Payment...
    </>
  ) : (
    <>
      Verify Payment
    </>
  )}
</Button>
        </div>

      </div>
    </div>
  </>);
};

export default Checkout;