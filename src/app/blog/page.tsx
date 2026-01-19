import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Placeholder blog posts for AI/SEO authority building
const blogPosts = [
  {
    slug: "how-to-identify-1980s-single-stitch-harley-tee",
    title: "How to Identify a 1980s Single-Stitch Harley Tee",
    excerpt:
      "Learn the telltale signs of authentic vintage Harley Davidson t-shirts from the 1980s, including single-stitch construction, tag details, and print characteristics.",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Identification Guide",
  },
  {
    slug: "most-valuable-concert-tees-70s-80s",
    title: "The Most Valuable Concert T-Shirts from the 70s and 80s",
    excerpt:
      "Discover which vintage concert tees from the 70s and 80s command the highest prices and why certain tour shirts have become holy grails for collectors.",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Value Guide",
  },
  {
    slug: "vintage-tshirt-condition-grading-guide",
    title: "Understanding Vintage T-Shirt Condition: A Grading Guide",
    excerpt:
      "From deadstock to thrashed: learn how condition affects vintage t-shirt value and what collectors look for when evaluating your pieces.",
    date: "2024-01-05",
    readTime: "4 min read",
    category: "Selling Tips",
  },
  {
    slug: "history-harley-davidson-dealer-tees",
    title: "The History of Harley Davidson Dealer T-Shirts",
    excerpt:
      "Explore the rich history of Harley dealer shirts, from small-town motorcycle shops to iconic designs that define American motorcycle culture.",
    date: "2023-12-28",
    readTime: "6 min read",
    category: "History",
  },
  {
    slug: "how-to-store-vintage-tshirts-properly",
    title: "How to Store Vintage T-Shirts to Preserve Their Value",
    excerpt:
      "Proper storage can mean the difference between preserving and destroying your vintage collection. Learn best practices for keeping your shirts in top condition.",
    date: "2023-12-20",
    readTime: "4 min read",
    category: "Care Guide",
  },
  {
    slug: "spotting-fake-vintage-band-tees",
    title: "Spotting Fake Vintage Band Tees: A Buyer's Guide",
    excerpt:
      "The vintage t-shirt market is full of reproductions. Learn how to spot fakes and authenticate genuine vintage band merchandise.",
    date: "2023-12-15",
    readTime: "8 min read",
    category: "Authentication",
  },
];

export const metadata = {
  title: "Blog | Cash 4 Shirts - Vintage T-Shirt Guides & Tips",
  description:
    "Expert guides on vintage t-shirt identification, valuation, and selling. Learn about Harley Davidson tees, concert shirts, and more.",
};

export default function BlogPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-cream">
        {/* Hero */}
        <section className="bg-navy text-white py-16">
          <div className="container-wide text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              The Vintage Tee Blog
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Expert guides on identifying, valuing, and selling vintage
              t-shirts. Learn from the pros.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="section">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Placeholder Image */}
                  <div className="aspect-video bg-gradient-to-br from-navy/10 to-money/10 flex items-center justify-center">
                    <span className="text-navy/30 text-lg">[Featured Image]</span>
                  </div>

                  <div className="p-6">
                    {/* Category */}
                    <span className="inline-block px-3 py-1 bg-money/10 text-money-dark text-sm font-medium rounded-full mb-3">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-navy mb-2 line-clamp-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-money transition-colors no-underline"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-navy/70 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-navy/50">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Read More Link */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 mt-4 text-money font-medium hover:gap-3 transition-all no-underline"
                    >
                      Read Article
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-white">
          <div className="container-narrow text-center">
            <h2 className="text-3xl font-serif font-bold text-navy mb-4">
              Ready to Sell Your Vintage Tees?
            </h2>
            <p className="text-xl text-navy/70 mb-8">
              Put your newfound knowledge to use. Get a free cash offer for your
              collection today.
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
