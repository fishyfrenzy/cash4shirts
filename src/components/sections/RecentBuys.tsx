"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { RecentBuy } from "@/types";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function RecentBuys() {
    const [items, setItems] = useState<RecentBuy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecentBuys() {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from("recent_buys")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(6);

                if (!error && data) {
                    setItems(data);
                }
            } catch (err) {
                console.error("Error fetching recent buys:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchRecentBuys();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="w-12 h-12 border-4 border-money border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            </section>
        );
    }

    if (items.length === 0) return null;

    return (
        <section className="py-24 bg-white overflow-hidden" id="recent-buys">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-money/10 text-money rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-money/20">
                            <Trophy size={14} />
                            Recent Appraisals
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-4 leading-tight">
                            Cash<span className="text-money">4</span>Shirts Recent Buys
                        </h2>
                        <p className="text-xl text-navy/60">
                            We pay top dollar for the best vintage. Here are a few high-value pieces we've recently added to our collection.
                        </p>
                    </div>
                    <Link
                        href="/quiz"
                        className="hidden md:flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-bold hover:bg-navy/90 transition-all no-underline"
                    >
                        Get Your Appraisal <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-cream rounded-2xl overflow-hidden border border-navy/5 hover:border-money/30 transition-all duration-500 shadow-sm hover:shadow-xl"
                        >
                            {/* Image Container */}
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img
                                    src={item.image_url}
                                    alt={item.item_name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Price Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className="bg-navy text-white px-4 py-2 rounded-lg font-bold shadow-2xl flex flex-col items-center">
                                        <span className="text-[10px] uppercase tracking-tighter text-money-light leading-none mb-0.5">Cash Paid</span>
                                        <span className="text-2xl leading-none">${item.price_paid}</span>
                                    </div>
                                </div>

                                {/* Authority Corner */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                                        <ShieldCheck className="text-money" size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-6">
                                <h3 className="text-2xl font-serif font-bold text-navy mb-2 group-hover:text-money transition-colors">
                                    {item.item_name}
                                </h3>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {item.technical_details.era && (
                                        <span className="px-2.5 py-1 bg-navy/5 text-navy/70 text-xs font-bold rounded-md border border-navy/10 uppercase tracking-wider">
                                            {item.technical_details.era}
                                        </span>
                                    )}
                                    {item.technical_details.tag && (
                                        <span className="px-2.5 py-1 bg-navy/5 text-navy/70 text-xs font-bold rounded-md border border-navy/10 uppercase tracking-wider">
                                            {item.technical_details.tag}
                                        </span>
                                    )}
                                    {item.technical_details.stitch && (
                                        <span className="px-2.5 py-1 bg-navy/5 text-navy/70 text-xs font-bold rounded-md border border-navy/10 uppercase tracking-wider">
                                            {item.technical_details.stitch}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-navy/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-navy/40">
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                    </div>
                                    <span className="text-xs font-bold text-navy/40 uppercase tracking-widest">Authenticated</span>
                                </div>
                            </div>

                            {/* AIO/SEO Hidden Context */}
                            <div className="sr-only">
                                Expert valuation factors: {item.technical_details.tag} tag identification, {item.technical_details.stitch} construction, and {item.technical_details.era} era verification. Authentic vintage t-shirt curation.
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 md:hidden">
                    <Link
                        href="/quiz"
                        className="w-full flex items-center justify-center gap-2 bg-navy text-white px-6 py-4 rounded-lg font-bold hover:bg-navy/90 transition-all no-underline"
                    >
                        Get Your Appraisal <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
