import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";
import qr from "@/assest/payment-qr.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
const Checkout = () => {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id);

  const verifyPayment = async () => {
    setLoading(true);

    setTimeout(async () => {
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

      alert("✅ Payment Successful");
      navigate(`/courses/${id}`);
    }, 2500);
  };

  if (!course) {
    return <h1>Course not found</h1>;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">

        {/* Left Side (Same layout as your code) */}
        <div className="bg-white rounded-xl shadow p-6">
          <img
            src={course.image}
            className="rounded-xl mb-5 w-full object-cover aspect-video"
            alt={course.title}
          />
          <h1 className="text-2xl font-bold text-slate-800">
            {course.title}
          </h1>
          <p className="text-gray-500 mt-2">
            {course.description}
          </p>
        </div>

        {/* Right Side - MATCHED WITH PREMIUM LOOK */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              Checkout
            </h2>

            {/* Premium Light Green Background Container Wrapper */}
            <div className="bg-[#f4fbf7] border border-[#e6f4ed] rounded-2xl p-6 flex flex-col items-center justify-center">
              
              {/* MOBILE PREVIEW MOCKUP FRAME */}
              <div className="bg-white rounded-[2.5rem] border-[6px] border-slate-800 shadow-xl p-4 w-52 aspect-[9/16] flex flex-col items-center justify-between relative overflow-hidden">
                {/* Speaker Notch */}
                <div className="w-24 h-4 bg-slate-800 rounded-b-xl absolute top-0 left-1/2 transform -translate-x-1/2 z-10"></div>
                
                {/* Inner Screen Elements */}
                <div className="flex flex-col items-center justify-center h-full w-full pt-4 gap-4">
                  
                  {/* 1. UPI Text Header Style */}
                  <div className="flex items-center justify-center mt-2 select-none">
                    <span className="text-xl font-black tracking-tighter text-slate-700 italic">
                      UPI<span className="text-blue-500">▶</span>
                    </span>
                  </div>

                  {/* 2. Your QR Code (Placed beautifully under UPI Logo text) */}
                  <div className="w-32 h-32 bg-white p-1.5 rounded-xl shadow-md border border-slate-100 flex items-center justify-center">
                    <img
                      src={qr}
                      alt="Google Pay QR"
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>

                  {/* 3. Operational Pulse Footer */}
                  <p className="text-[10px] text-gray-400 font-semibold tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Fast • Secure • Reliable
                  </p>
                </div>
              </div>

              {/* Action caption text underneath mobile frame wrapper */}
              <p className="text-slate-700 font-bold mt-4 text-sm text-center">
                Scan to pay with any UPI app
              </p>
            </div>

            {/* UPI ID Copy Form Field */}
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

            {/* Checkbox Hook Option */}
            <div className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                checked={paid}
                onChange={() => setPaid(!paid)}
                className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                id="paymentStatus"
              />
              <label htmlFor="paymentStatus" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">
                I have completed the payment
              </label>
            </div>

            {/* Inline Notifications Badge Layout */}
            <div className="mt-4 p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 flex gap-2">
              <span className="text-emerald-600 font-bold text-sm">✓</span>
              <div>
                <p className="text-xs font-bold text-emerald-800">Currently only UPI payments are available.</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Card, Wallet and Net Banking coming soon.</p>
              </div>
            </div>
          </div>

          {/* Pricing calculations dashboard layout */}
          <div className="mt-6 pt-5 border-t border-dashed border-slate-200 space-y-2 text-sm font-medium text-slate-500">
            <div className="flex justify-between">
              <span>Original Price</span>
              <span className="line-through text-slate-400">
                ₹{course.originalPrice}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
              </span>
            </div>

            <hr className="my-2 border-slate-100" />

            <div className="flex justify-between text-xl font-black text-slate-800 pt-1">
              <span>Total</span>
              <span className="text-blue-600">₹{course.price}</span>
            </div>
          </div>

          <Button
            className="w-full mt-5 py-6 rounded-xl font-bold text-base shadow-md transition-all active:scale-[0.99]"
            disabled={!paid || loading}
            onClick={verifyPayment}
          >
            {loading ? "Verifying Payment..." : "Verify Payment"}
          </Button>

        </div>

      </div>
    </div>
  );
};

export default Checkout;