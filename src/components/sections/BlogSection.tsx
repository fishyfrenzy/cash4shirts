"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";

export default function BlogSection() {
    return (
        <section className="section bg-white" id="blog-section">
            <div className="container-wide">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">
                        Latest from the Blog
                    </h2>
                    <Link
                        href="/blog"
                        className="text-money font-semibold flex items-center gap-2 hover:gap-3 transition-all no-underline"
                    >
                        View All Posts
                        <ArrowRight size={20} />
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {blogPosts.slice(0, 3).map((post) => (
                        <article key={post.slug} className="group">
                            <Link href={`/blog/${post.slug}`} className="no-underline">
                                <div className="aspect-video bg-gradient-to-br from-navy/5 to-money/5 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-md transition-shadow">
                                    <span className="text-navy/20">[Blog Image]</span>
                                </div>
                                <span className="text-money font-medium text-sm">
                                    {post.category}
                                </span>
                                <h3 className="text-xl font-bold text-navy mt-2 group-hover:text-money transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
