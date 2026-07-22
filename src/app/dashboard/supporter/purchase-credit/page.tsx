"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  Star,
  Zap,
  Crown,
  Loader2,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    credits: 100,
    price: 10,
    perCredit: "$0.10",
    icon: Zap,
    color: "border-gray-200 hover:border-indigo-200",
    badge: "",
    popular: false,
  },
  {
    name: "Popular",
    credits: 500,
    price: 45,
    perCredit: "$0.09",
    icon: Star,
    color: "border-indigo-500 ring-2 ring-indigo-500/20",
    badge: "Best Value",
    popular: true,
  },
  {
    name: "Pro",
    credits: 1000,
    price: 80,
    perCredit: "$0.08",
    icon: Crown,
    color: "border-gray-200 hover:border-indigo-200",
    badge: "",
    popular: false,
  },
];

export default function PurchaseCreditPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    // Simulated purchase — in production this would call Stripe/payment API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Purchase Credits</h1>
        <p className="text-sm text-gray-500">
          Buy credits to support campaigns you love.
        </p>
      </div>

      {/* Current balance */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <Wallet className="size-7 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Current Balance</div>
            <div className="text-3xl font-bold text-gray-900">
              {user?.credits ?? 0} credits
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <button
              key={plan.name}
              onClick={() => setSelected(i)}
              className={`relative rounded-2xl border-2 p-6 text-left transition-all ${
                selected === i
                  ? "border-indigo-500 bg-indigo-50/50 shadow-md"
                  : plan.color + " bg-white hover:shadow-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold text-white">
                  {plan.badge}
                </span>
              )}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Icon className="size-5" />
              </div>
              <div className="mb-1 text-sm font-semibold text-gray-900">
                {plan.name}
              </div>
              <div className="mb-3 text-2xl font-bold text-gray-900">
                {plan.credits.toLocaleString()}
                <span className="text-sm font-normal text-gray-400"> credits</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-indigo-600">
                  ${plan.price}
                </span>
                <span className="text-xs text-gray-400">({plan.perCredit}/credit)</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Purchase button */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="size-4" />
            Purchase {plans[selected].credits.toLocaleString()} Credits for ${plans[selected].price}
          </>
        )}
      </button>

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="size-4" />
          Credits purchased successfully!
        </div>
      )}

      {/* Info */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">How credits work</h3>
        <ul className="space-y-1 text-xs text-gray-500">
          <li>• Credits are used to back campaigns on CrowdNest</li>
          <li>• 1 credit = $1 value</li>
          <li>• Credits never expire</li>
          <li>• Unused credits can be refunded within 30 days</li>
        </ul>
      </div>
    </div>
  );
}
