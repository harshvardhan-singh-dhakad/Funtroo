import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getCollection, where, orderBy, limit } from '@/lib/firestore'
import { IBlog } from '@/models/Blog'
import { Clock, Eye, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { PAGE_FAQS } from '@/lib/faqs-data'
import FAQSection from '@/components/FAQSection'

export const metadata: Metadata = {
  title:       'Wellness Blog — Funtroo',
  description: 'Tips, guides, and expert advice on adult wellness, intimacy, and self-care. Read the Funtroo blog.',
  robots:      'index, follow',
  alternates: {
    canonical: '/blog'
  },
  openGraph: {
    title: 'Wellness Blog — Funtroo',
    description: 'Tips, guides, and expert advice on adult wellness, intimacy, and self-care.',
    url: 'https://funtroo.in/blog',
  }
}

async function getBlogs() {
  try {
    // Note: Auto-publish logic should ideally be a cron job, 
    // but for now we just fetch what's already published.
    const blogs = await getCollection<IBlog>('blogs', [
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(20)
    ])
    return blogs
  } catch (e) {
    console.error('Failed to fetch blogs', e)
    return []
  }
}

async function getCategories(blogs: IBlog[]) {
  const cats = Array.from(new Set(blogs.map(b => b.category))).filter(Boolean) as string[]
  return cats
}

export default async function BlogListPage() {
  const blogs = await getBlogs()
  const cats  = await getCategories(blogs)
  const featured = blogs[0]
  const rest     = blogs.slice(1)

  return (
    <>
      <Navbar />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type':    'Blog',
        name:       'Funtroo Wellness Blog',
        url:        'https://funtroo.in/blog',
        description:'Adult wellness tips, guides and expert advice.',
        publisher:  { '@type': 'Organization', name: 'Funtroo', url: 'https://funtroo.in' },
      })}} />

      <main>
        {/* Hero */}
        <section className="bg-f-dark py-14 px-4 text-center">
          <p className="text-[11px] text-f-accent tracking-[3px] uppercase mb-3">Funtroo Wellness</p>
          <h1 className="font-display text-5xl text-f-light mb-3">Our Blog</h1>
          <p className="text-f-muted text-sm max-w-lg mx-auto">Expert guides on intimacy, wellness, and self-care — written for real people.</p>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Category pills */}
          {cats.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              <Link href="/blog" className="text-xs px-4 py-1.5 rounded-full bg-f-purple text-white">All</Link>
              {cats.map((c: string) => (
                <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`}
                  className="text-xs px-4 py-1.5 rounded-full border border-f-border text-f-gray hover:border-f-purple hover:text-f-purple transition bg-white">
                  {c}
                </Link>
              ))}
            </div>
          )}

          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">✍️</p>
              <p className="text-f-gray">No blogs published yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="block mb-10 group">
                  <div className="bg-white border border-f-border rounded-2xl overflow-hidden hover:border-f-purple hover:shadow-lg transition-all">
                    {featured.featuredImage ? (
                      <img src={featured.featuredImage} alt={featured.title} className="w-full h-64 object-cover" />
                    ) : (
                      <div className="w-full h-64 bg-f-light flex items-center justify-center">
                        <span className="font-display text-6xl text-f-accent/30">F</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] bg-f-purple text-white px-2.5 py-1 rounded-full font-medium">Featured</span>
                        {featured.category && <span className="text-[10px] text-f-purple border border-f-border px-2.5 py-1 rounded-full">{featured.category}</span>}
                      </div>
                      <h2 className="font-display text-2xl text-f-dark group-hover:text-f-purple transition mb-2">{featured.title}</h2>
                      <p className="text-f-gray text-sm leading-relaxed mb-4 line-clamp-2">{featured.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-f-muted">
                        <span className="flex items-center gap-1"><Clock size={11} /> {featured.readTime} min read</span>
                        <span className="flex items-center gap-1"><Eye size={11} /> {featured.views} views</span>
                        <span>{featured.author}</span>
                        <span className="ml-auto text-f-purple font-medium flex items-center gap-1">Read More <ArrowRight size={12} /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((b: IBlog) => (
                    <Link key={b.id} href={`/blog/${b.slug}`} className="group bg-white border border-f-border rounded-2xl overflow-hidden hover:border-f-purple hover:shadow-md transition-all flex flex-col">
                      {b.featuredImage ? (
                        <img src={b.featuredImage} alt={b.title} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-40 bg-f-light flex items-center justify-center">
                          <span className="font-display text-4xl text-f-accent/30">F</span>
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          {b.category && <span className="text-[10px] text-f-purple border border-f-border px-2 py-0.5 rounded-full">{b.category}</span>}
                        </div>
                        <h2 className="font-display text-lg text-f-dark group-hover:text-f-purple transition mb-2 line-clamp-2 flex-1">{b.title}</h2>
                        <p className="text-xs text-f-gray line-clamp-2 mb-4">{b.excerpt}</p>
                        <div className="flex items-center gap-3 text-[11px] text-f-muted">
                          <span className="flex items-center gap-1"><Clock size={10} /> {b.readTime} min</span>
                          <span className="flex items-center gap-1"><Eye size={10} /> {b.views}</span>
                          <span className="ml-auto text-f-purple font-medium">Read →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* AI Optimized FAQ Section for Blog */}
        <section className="bg-white border-t border-f-border px-4 py-8">
          <FAQSection faqs={PAGE_FAQS.blog} title="Blog Frequently Asked Questions" />
        </section>
      </main>
      <Footer />
    </>
  )
}
