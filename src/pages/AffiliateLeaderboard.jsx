import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, TrendingUp, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const TIER_COLORS = {
  bronze: "from-amber-700 to-amber-600",
  silver: "from-gray-400 to-gray-500",
  gold: "from-yellow-500 to-amber-500",
  platinum: "from-purple-600 to-indigo-600",
};

const TIER_EMOJI = { bronze: "🥉", silver: "🥈", gold: "🥇", platinum: "💎" };

const RANK_STYLES = [
  "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
  "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800",
  "bg-gradient-to-r from-amber-600 to-amber-700 text-white",
];

export default function AffiliateLeaderboard() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all"); // all | month

  useEffect(() => {
    base44.entities.Affiliate.filter({ status: "approved" }).then(data => {
      setAffiliates(data);
      setLoading(false);
    });
  }, []);

  const ranked = [...affiliates]
    .sort((a, b) => (b.totalConversions || 0) - (a.totalConversions || 0))
    .slice(0, 20);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <SEOHead
        title="Affiliate Leaderboard | EzPay America"
        description="See the top-performing EzPay America affiliates. Join the program and compete for the top spot."
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 pt-16 pb-8 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Affiliate Leaderboard</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Top performers in the EzPay America affiliate program. Earn more, climb higher.</p>
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{affiliates.length}</p>
              <p>Active Affiliates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{affiliates.reduce((s, a) => s + (a.totalConversions || 0), 0)}</p>
              <p>Total Conversions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">${affiliates.reduce((s, a) => s + (a.totalEarned || 0), 0).toLocaleString()}</p>
              <p>Total Earned</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Podium - Top 3 */}
      {top3.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-end justify-center gap-4 mb-10">
            {/* 2nd place */}
            {top3[1] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex-1 max-w-[180px]">
                <div className="bg-gray-700 rounded-t-2xl p-4 text-center border-2 border-gray-500 h-40 flex flex-col justify-end pb-4">
                  <div className="text-3xl mb-1">🥈</div>
                  <p className="font-bold text-white text-sm">{top3[1].firstName} {top3[1].lastName.charAt(0)}.</p>
                  <p className="text-gray-400 text-xs">{top3[1].totalConversions || 0} conversions</p>
                  <Badge className={`bg-gradient-to-r ${TIER_COLORS[top3[1].tier]} text-white border-0 text-xs mt-1 mx-auto`}>
                    {TIER_EMOJI[top3[1].tier]} {top3[1].tier}
                  </Badge>
                </div>
                <div className="bg-gray-500 text-center py-2 rounded-b-lg">
                  <p className="text-white font-black text-xl">#2</p>
                </div>
              </motion.div>
            )}
            {/* 1st place */}
            {top3[0] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
                className="flex-1 max-w-[200px] -mt-8">
                <div className="bg-gradient-to-b from-amber-500/20 to-amber-600/10 rounded-t-2xl p-4 text-center border-2 border-amber-500 h-52 flex flex-col justify-end pb-4">
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="font-bold text-white">{top3[0].firstName} {top3[0].lastName.charAt(0)}.</p>
                  <p className="text-amber-300 text-sm font-semibold">{top3[0].totalConversions || 0} conversions</p>
                  <p className="text-green-400 text-xs">${(top3[0].totalEarned || 0).toFixed(0)} earned</p>
                  <Badge className={`bg-gradient-to-r ${TIER_COLORS[top3[0].tier]} text-white border-0 text-xs mt-1 mx-auto`}>
                    {TIER_EMOJI[top3[0].tier]} {top3[0].tier}
                  </Badge>
                </div>
                <div className="bg-amber-500 text-center py-2 rounded-b-lg">
                  <p className="text-white font-black text-xl">#1 🏆</p>
                </div>
              </motion.div>
            )}
            {/* 3rd place */}
            {top3[2] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex-1 max-w-[180px]">
                <div className="bg-gray-700 rounded-t-2xl p-4 text-center border-2 border-amber-700 h-32 flex flex-col justify-end pb-4">
                  <div className="text-3xl mb-1">🥉</div>
                  <p className="font-bold text-white text-sm">{top3[2].firstName} {top3[2].lastName.charAt(0)}.</p>
                  <p className="text-gray-400 text-xs">{top3[2].totalConversions || 0} conversions</p>
                </div>
                <div className="bg-amber-700 text-center py-2 rounded-b-lg">
                  <p className="text-white font-black text-xl">#3</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Rest of leaderboard */}
          {rest.length > 0 && (
            <Card className="border-none bg-gray-800 shadow-xl">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-700">
                  {rest.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 p-4 hover:bg-gray-750 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold text-sm flex-shrink-0">
                        {i + 4}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{a.firstName} {a.lastName.charAt(0)}.</p>
                        {a.company && <p className="text-xs text-gray-500 truncate">{a.company}</p>}
                      </div>
                      <Badge className={`bg-gradient-to-r ${TIER_COLORS[a.tier]} text-white border-0 text-xs hidden sm:flex`}>
                        {TIER_EMOJI[a.tier]} {a.tier}
                      </Badge>
                      <div className="text-right flex-shrink-0">
                        <p className="text-amber-400 font-bold text-sm">{a.totalConversions || 0} <span className="text-gray-500 font-normal text-xs">conv.</span></p>
                        <p className="text-gray-500 text-xs">{a.totalReferrals || 0} refs</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {affiliates.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No affiliates yet. Be the first!</p>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-12 px-4">
        <p className="text-gray-400 mb-4">Want to be on this leaderboard?</p>
        <Link to={createPageUrl("AffiliateSignup")}>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl transition-all">
            Join the Affiliate Program →
          </button>
        </Link>
      </div>
    </div>
  );
}