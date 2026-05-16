import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getCollection, updateDocument, increment, where, orderBy, limit } from '@/lib/firestore'
import { IBlog } from '@/models/Blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Eye, Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blogs = await getCollection<IBlog>('blogs', [
    where('slug', '==', params.slug),
    where('status', '==', 'published'),
    limit(1)
  ])
  const blog = blogs[0]
  if (!blog) return { title: 'Blog Not Found' }

  const siteUrl = 'https://funtroo.in'
  return {
    title:       blog.seo?.metaTitle  || blog.title,
    description: blog.seo?.metaDesc   || blog.excerpt,
    keywords:    [blog.seo?.focusKw, ...(blog.seo?.secondaryKws || []), ...(blog.tags || [])].filter(Boolean).join(', '),
    robots:      blog.seo?.noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates:  { canonical: blog.seo?.canonical || `${siteUrl}/blog/${blog.slug}` },
    openGraph: {
      title:       blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDesc  || blog.excerpt,
      url:         `${siteUrl}/blog/${blog.slug}`,
      type:        'article',
      images:      blog.seo?.ogImage || blog.featuredImage ? [{ url: blog.seo?.ogImage || blog.featuredImage }] : [],
      publishedTime: blog.publishedAt?.toString(),
      authors:     [blog.author],
      tags:        blog.tags,
    },
    twitter: {
      card:        'summary_large_image',
      title:       blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDesc  || blog.excerpt,
      images:      blog.seo?.ogImage   || blog.featuredImage ? [blog.seo?.ogImage || blog.featuredImage] : [],
    },
  }
}

async function getRelated(category: string, slug: string) {
  return getCollection<IBlog>('blogs', [
    where('status', '==', 'published'),
    where('category', '==', category),
    orderBy('publishedAt', 'desc'),
    limit(4)
  ]).then(res => res.filter(b => b.slug !== slug).slice(0, 3))
}

export default async function BlogPostPage({ params }: Props) {
  const blogs = await getCollection<IBlog>('blogs', [
    where('slug', '==', params.slug),
    where('status', '==', 'published'),
    limit(1)
  ])
  const blog = blogs[0]
  if (!blog) notFound()

  // Increment views (async, don't wait for it)
  updateDocument('blogs', blog.id as string, { views: increment(1) }).catch(console.error)

  const related = await getRelated(blog.category, blog.slug)
  const siteUrl = 'https://funtroo.in'

  const jsonLd = {
    '@context':       'https://schema.org',
    '@type':          'Article',
    headline:         blog.seo?.metaTitle || blog.title,
    description:      blog.seo?.metaDesc  || blog.excerpt,
    image:            blog.featuredImage  || blog.seo?.ogImage || '',
    author:           { '@type': 'Person', name: blog.author },
    publisher:        { '@type': 'Organization', name: 'Funtroo', url: siteUrl },
    datePublished:    blog.publishedAt,
    dateModified:     blog.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${blog.slug}` },
    keywords:         [blog.seo?.focusKw, ...(blog.seo?.secondaryKws || [])].filter(Boolean).join(', '),
  }

  return (
    <>
      <Navbar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="bg-white">
        {/* Hero */}
        {blog.featuredImage && (
          <div className="w-full max-h-[420px] overflow-hidden">
            <img src={blog.featuredImage} alt={blog.title} className="w-full object-cover max-h-[420px]" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-f-muted mb-6">
            <Link href="/" className="hover:text-f-purple">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-f-purple">Blog</Link>
            <span>/</span>
            <span className="text-f-dark truncate max-w-[200px]">{blog.title}</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {blog.category && (
              <Link href={`/blog?category=${encodeURIComponent(blog.category)}`}
                className="text-xs bg-f-light text-f-purple px-3 py-1 rounded-full font-medium hover:bg-f-border transition">
                {blog.category}
              </Link>
            )}
            {blog.tags?.map((t: string) => (
              <span key={t} className="text-xs text-f-muted flex items-center gap-1">
                <Tag size={10} /> {t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl text-f-dark leading-tight mb-4">{blog.title}</h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-f-gray leading-relaxed mb-6 border-l-4 border-f-purple pl-4 italic">{blog.excerpt}</p>
          )}

          {/* Author + meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-f-muted pb-6 mb-8 border-b border-f-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-f-light flex items-center justify-center">
                <span className="text-f-purple text-xs font-bold">{blog.author?.[0]?.toUpperCase()}</span>
              </div>
              <span className="font-medium text-f-dark">{blog.author}</span>
            </div>
            <span className="flex items-center gap-1"><Calendar size={11} /> {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {blog.readTime} min read</span>
            <span className="flex items-center gap-1"><Eye size={11} /> {blog.views} views</span>
          </div>

          {/* ── BLOG CONTENT (raw HTML rendered) ─────────────────── */}
          <article
            className="prose prose-lg max-w-none
              prose-headings:font-display prose-headings:text-f-dark
              prose-h2:text-3xl prose-h2:border-b prose-h2:border-f-border prose-h2:pb-2
              prose-h3:text-2xl prose-h3:text-f-purple
              prose-p:text-f-gray prose-p:leading-relaxed
              prose-a:text-f-purple prose-a:no-underline hover:prose-a:underline
              prose-strong:text-f-dark
              prose-ul:text-f-gray prose-ol:text-f-gray
              prose-blockquote:border-f-purple prose-blockquote:text-f-gray prose-blockquote:bg-f-soft prose-blockquote:rounded-r-xl prose-blockquote:py-1
              prose-img:rounded-2xl prose-img:shadow-md
              prose-code:bg-f-soft prose-code:text-f-purple prose-code:px-1 prose-code:rounded
              prose-pre:bg-f-dark prose-pre:text-f-light"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-f-border">
              <span className="text-xs text-f-muted">Tags:</span>
              {blog.tags.map((t: string) => (
                <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="text-xs px-3 py-1 border border-f-border rounded-full text-f-gray hover:border-f-purple hover:text-f-purple transition">
                  {t}
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 bg-f-dark rounded-2xl p-6 text-center">
            <p className="text-f-accent text-xs tracking-widest uppercase mb-2">Shop Funtroo</p>
            <p className="font-display text-2xl text-f-light mb-3">Explore Our Wellness Collection</p>
            <p className="text-f-muted text-sm mb-5">Premium adult wellness products — discreet delivery, pan India.</p>
            <Link href="/shop" className="inline-block px-6 py-3 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">
              Shop Now →
            </Link>
          </div>

          {/* Author card */}
          <div className="mt-10 bg-f-soft border border-f-border rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-f-light flex items-center justify-center shrink-0">
              <span className="text-f-purple text-lg font-bold">{blog.author?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium text-f-dark">{blog.author}</p>
              <p className="text-xs text-f-muted mt-1">Funtroo Wellness Team — Helping India explore wellness, one article at a time.</p>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="bg-f-soft py-10 mt-6">
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="font-display text-2xl text-f-dark mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-5">
                {related.map((r: IBlog) => (
                  <Link key={r.id} href={`/blog/${r.slug}`} className="bg-white border border-f-border rounded-2xl p-5 hover:border-f-purple hover:shadow-md transition group">
                    <p className="font-display text-lg text-f-dark group-hover:text-f-purple transition mb-2 line-clamp-2">{r.title}</p>
                    <p className="text-xs text-f-gray line-clamp-2 mb-3">{r.excerpt}</p>
                    <span className="text-xs text-f-purple font-medium flex items-center gap-1">Read <ArrowRight size={11} /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/blog" className="flex items-center gap-2 text-sm text-f-purple hover:underline">
            <ArrowLeft size={14} /> Back to All Articles
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
