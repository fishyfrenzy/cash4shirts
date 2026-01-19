import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Placeholder content - in production, this would come from a CMS or MDX
const blogContent: Record<
  string,
  {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    content: string;
  }
> = {
  "how-to-identify-1980s-single-stitch-harley-tee": {
    title: "How to Identify a 1980s Single-Stitch Harley Tee",
    excerpt:
      "Learn the telltale signs of authentic vintage Harley Davidson t-shirts from the 1980s.",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Identification Guide",
    content: `
## What Makes 1980s Harley Tees Special?

The 1980s were a golden era for Harley Davidson merchandise. Dealer shirts from this period are among the most sought-after vintage pieces, combining bold graphics with authentic American motorcycle culture.

## Key Identification Features

### 1. Single-Stitch Construction

The most reliable indicator of a pre-1990s shirt is single-stitch construction. Check the bottom hem and sleeves:

- **Single row of stitching** = Pre-1993 (valuable vintage)
- **Double row of stitching** = Post-1993 (less valuable)

### 2. Tag Details

Look at the neck tag for manufacturing details:

- "Made in USA" tags are common for authentic 80s pieces
- Screen Stars, Hanes, and Fruit of the Loom were popular blanks
- Copyright dates on tags or prints help date the shirt

### 3. Print Characteristics

80s Harley prints have distinct qualities:

- **Thick, heavy ink** that often shows cracking with age
- **Vivid colors** including the classic orange and black
- **Dealer names and locations** printed on the back
- Front graphics typically feature the Bar & Shield logo

### 4. Fabric Feel

Authentic vintage cotton has a specific feel:

- Thinner, softer fabric than modern shirts
- Often shows fading in a desirable way
- 50/50 cotton-poly blends were also common

## Red Flags for Reproductions

Watch out for these signs of modern reproductions:

- Tags that say "Vintage" or "Retro"
- Perfect, crisp prints without any aging
- Double-stitched hems
- Modern blank brands (Gildan, Next Level)
- Distressing that looks artificial

## What Are These Shirts Worth?

1980s Harley dealer tees typically sell for $50-$200 depending on:

- Specific dealer (some are rarer than others)
- Condition (fading is okay, holes decrease value)
- Design appeal (skull graphics, eagles, and bikes are popular)
- Size (larger sizes often command premiums)

---

*Have shirts you think might be valuable? Take our 2-minute quiz to get a free cash offer.*
    `,
  },
};

// Generate static params for known blog posts
export function generateStaticParams() {
  return Object.keys(blogContent).map((slug) => ({ slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogContent[slug];

  if (!post) {
    return {
      title: "Blog Post Not Found | Cash 4 Shirts",
    };
  }

  return {
    title: `${post.title} | Cash 4 Shirts Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogContent[slug];

  // 404 fallback for posts not in our placeholder content
  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream py-16">
          <div className="container-narrow text-center">
            <h1 className="text-4xl font-serif font-bold text-navy mb-4">
              Article Coming Soon
            </h1>
            <p className="text-xl text-navy/70 mb-8">
              This article is being written by our vintage experts. Check back
              soon!
            </p>
            <Link
              href="/blog"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-cream">
        {/* Article Header */}
        <section className="bg-navy text-white py-12">
          <div className="container-narrow">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 no-underline"
            >
              <ArrowLeft size={18} />
              Back to Blog
            </Link>

            <span className="inline-block px-3 py-1 bg-money text-white text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-white/70">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {post.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="section">
          <div className="container-narrow">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              {/* Placeholder Featured Image */}
              <div className="aspect-video bg-gradient-to-br from-navy/10 to-money/10 rounded-xl flex items-center justify-center mb-8">
                <span className="text-navy/30 text-lg">[Featured Image]</span>
              </div>

              {/* Article Body - Rendered as markdown-like content */}
              <div className="prose prose-lg max-w-none">
                {post.content.split("\n").map((paragraph, index) => {
                  // Handle headers
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h2
                        key={index}
                        className="text-2xl font-serif font-bold text-navy mt-8 mb-4"
                      >
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith("### ")) {
                    return (
                      <h3
                        key={index}
                        className="text-xl font-bold text-navy mt-6 mb-3"
                      >
                        {paragraph.replace("### ", "")}
                      </h3>
                    );
                  }
                  // Handle list items
                  if (paragraph.startsWith("- ")) {
                    return (
                      <li key={index} className="text-lg text-navy/80 ml-6 mb-2">
                        {paragraph.replace("- ", "")}
                      </li>
                    );
                  }
                  // Handle horizontal rules
                  if (paragraph.startsWith("---")) {
                    return (
                      <hr key={index} className="my-8 border-gray-200" />
                    );
                  }
                  // Handle italic text (simple implementation)
                  if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
                    return (
                      <p key={index} className="text-lg text-navy/70 italic my-4">
                        {paragraph.replace(/\*/g, "")}
                      </p>
                    );
                  }
                  // Regular paragraphs
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-lg text-navy/80 leading-relaxed my-4">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <section className="section bg-white">
          <div className="container-narrow text-center">
            <h2 className="text-3xl font-serif font-bold text-navy mb-4">
              Have Vintage Shirts to Sell?
            </h2>
            <p className="text-xl text-navy/70 mb-8">
              Get a free cash offer in minutes. No obligation, just fair prices.
            </p>
            <Link
              href="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              Get Your Free Quote
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
