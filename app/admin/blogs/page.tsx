'use client'
import { useEffect, useState, useRef } from 'react'
import {
  Plus, Pencil, Trash2, Eye, Search, X, Clock,
  Globe, FileText, Calendar, Tag, ChevronDown,
  BarChart2, Save, Send, EyeOff, AlignLeft,
  CheckCircle, AlertCircle, RefreshCw, Upload, Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/uploadImage'
import { getCollection, createDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firestore'

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft:     { label: 'Draft',     color: 'bg-gray-100 text-gray-700',    icon: <FileText size={10} /> },
  published: { label: 'Published', color: 'bg-green-100 text-green-700',  icon: <Globe size={10} /> },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700',    icon: <Calendar size={10} /> },
}

const CATS = ['General', 'Wellness', 'Intimacy Tips', 'Product Guides', 'Relationships', 'Self-Care', 'Education', 'News']

const EMPTY_FORM = {
  title: '', slug: '', excerpt: '', content: '', htmlContent: '', cssContent: '', jsContent: '', featuredImage: '',
  category: 'General', tags: '', author: 'Funtroo Team',
  status: 'draft' as 'draft' | 'published' | 'scheduled',
  scheduledAt: '',
  seo: { metaTitle: '', metaDesc: '', focusKw: '', secondaryKws: '', canonical: '', ogImage: '', noIndex: false },
}

type Tab = 'content' | 'seo' | 'settings'
type CodeTab = 'html' | 'css' | 'js'

export default function AdminBlogs() {
  const [blogs,   setBlogs]   = useState<any[]>([])
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [q,       setQ]       = useState('')
  const [filter,  setFilter]  = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)   // null = list, else blog obj
  const [isNew,   setIsNew]   = useState(false)
  const [form,    setForm]    = useState<any>(EMPTY_FORM)
  const [tab,     setTab]     = useState<Tab>('content')
  const [codeTab, setCodeTab] = useState<CodeTab>('html')
  const [saving,  setSaving]  = useState(false)
  const [preview, setPreview] = useState(false)
  const [uploadingFeat, setUploadingFeat] = useState(false)
  const [uploadingInline, setUploadingInline] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    try {
      const allBlogs = await getCollection('blogs', [orderBy('createdAt', 'desc')])
      let filtered = allBlogs
      
      if (filter) {
        filtered = filtered.filter((b: any) => b.status === filter)
      }
      if (q) {
        const queryLower = q.toLowerCase()
        filtered = filtered.filter((b: any) => b.title?.toLowerCase().includes(queryLower) || b.slug?.toLowerCase().includes(queryLower))
      }
      
      setTotal(filtered.length)
      setBlogs(filtered.slice((page - 1) * 15, page * 15))
    } catch(e) {
      toast.error('Error loading blogs')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [page, q, filter])

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').slice(0, 80)
    setForm((f: any) => ({ ...f, title: val, slug: isNew ? slug : f.slug }))
  }

  // Auto-fill SEO from title/excerpt
  const syncSEO = () => {
    setForm((f: any) => ({
      ...f,
      seo: {
        ...f.seo,
        metaTitle: f.seo.metaTitle || f.title.slice(0, 60),
        metaDesc:  f.seo.metaDesc  || f.excerpt.slice(0, 160),
      }
    }))
  }

  const extractCode = (content: string) => {
    let css = ''
    let js = ''
    let html = content || ''

    const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/)
    if (cssMatch) {
      css = cssMatch[1].trim()
      html = html.replace(cssMatch[0], '')
    }

    const jsMatch = html.match(/<script>([\s\S]*?)<\/script>/)
    if (jsMatch) {
      js = jsMatch[1].trim()
      html = html.replace(jsMatch[0], '')
    }

    return { htmlContent: html.trim(), cssContent: css, jsContent: js }
  }

  const openCreate = () => {
    setIsNew(true)
    setEditing({})
    setForm(EMPTY_FORM)
    setTab('content')
    setCodeTab('html')
    setPreview(false)
    setTimeout(() => titleRef.current?.focus(), 100)
  }

  const openEdit = (blog: any) => {
    setIsNew(false)
    setEditing(blog)
    const extracted = extractCode(blog.content || '')
    setForm({
      title:        blog.title || '',
      slug:         blog.slug  || '',
      excerpt:      blog.excerpt || '',
      content:      blog.content || '',
      htmlContent:  extracted.htmlContent,
      cssContent:   extracted.cssContent,
      jsContent:    extracted.jsContent,
      featuredImage:blog.featuredImage || '',
      category:     blog.category || 'General',
      tags:         (blog.tags || []).join(', '),
      author:       blog.author || 'Funtroo Team',
      status:       blog.status || 'draft',
      scheduledAt:  blog.scheduledAt ? blog.scheduledAt.slice(0, 16) : '',
      seo: {
        metaTitle:   blog.seo?.metaTitle  || '',
        metaDesc:    blog.seo?.metaDesc   || '',
        focusKw:     blog.seo?.focusKw    || '',
        secondaryKws:(blog.seo?.secondaryKws || []).join(', '),
        canonical:   blog.seo?.canonical  || '',
        ogImage:     blog.seo?.ogImage    || '',
        noIndex:     blog.seo?.noIndex    || false,
      },
    })
    setTab('content')
    setCodeTab('html')
    setPreview(false)
  }

  const save = async (publishNow = false) => {
    if (!form.title.trim()) return toast.error('Title is required')
    if (!form.slug.trim())  return toast.error('Slug is required')
    setSaving(true)

    let mergedContent = form.htmlContent || ''
    if (form.cssContent?.trim()) mergedContent = `<style>\n${form.cssContent}\n</style>\n\n` + mergedContent
    if (form.jsContent?.trim()) mergedContent = mergedContent + `\n\n<script>\n${form.jsContent}\n</script>`

    const payload = {
      ...form,
      content: mergedContent,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      status: publishNow ? 'published' : form.status,
      seo: {
        ...form.seo,
        secondaryKws: form.seo.secondaryKws.split(',').map((k: string) => k.trim()).filter(Boolean),
      },
    }

    try {
      if (editing?.id) {
        await updateDocument('blogs', editing.id, { ...payload, updatedAt: new Date().toISOString() })
        toast.success(publishNow ? 'Blog published!' : 'Blog updated!')
      } else {
        await createDocument('blogs', { ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 0 })
        toast.success(publishNow ? 'Blog published!' : 'Blog saved!')
      }
      setEditing(null)
      load()
    } catch (e) {
      toast.error('Save failed')
    }
    setSaving(false)
  }

  const deleteBlog = async (id: string) => {
    if (!confirm('Delete this blog permanently?')) return
    try {
      await deleteDocument('blogs', id)
      toast.success('Blog deleted')
      load()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  const charCount = (str: string, max: number) => (
    <span className={`text-[10px] ${str.length > max ? 'text-red-500' : 'text-f-muted'}`}>{str.length}/{max}</span>
  )

  // ── EDITOR VIEW ──────────────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="flex h-screen flex-col">
        {/* Editor topbar */}
        <div className="bg-white border-b border-f-border px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-sm text-f-gray hover:text-f-dark transition">
            <X size={16} /> Back
          </button>
          <div className="h-4 w-px bg-f-border" />
          <span className="text-sm text-f-muted">{isNew ? 'New Blog Post' : 'Edit Blog Post'}</span>

          <div className="ml-auto flex items-center gap-2">
            {/* Status badge */}
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${STATUS_META[form.status]?.color}`}>
              {STATUS_META[form.status]?.icon}
              {STATUS_META[form.status]?.label}
            </div>

            {/* Preview toggle */}
            <button onClick={() => setPreview(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-f-border rounded-lg text-xs text-f-gray hover:bg-f-soft transition">
              {preview ? <EyeOff size={13} /> : <Eye size={13} />}
              {preview ? 'Editor' : 'Preview'}
            </button>

            {/* Save draft */}
            <button onClick={() => save(false)} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-f-border rounded-lg text-xs text-f-gray hover:bg-f-soft transition disabled:opacity-50">
              <Save size={13} /> {saving ? 'Saving...' : 'Save Draft'}
            </button>

            {/* Publish */}
            <button onClick={() => save(true)} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-f-purple text-white rounded-lg text-xs font-medium hover:bg-f-mid transition disabled:opacity-50">
              <Send size={13} /> {form.status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left — form fields */}
          <div className="w-80 border-r border-f-border bg-f-soft overflow-y-auto shrink-0 p-4 space-y-4">
            {/* Tabs */}
            <div className="flex bg-white border border-f-border rounded-xl p-1 gap-1">
              {(['content', 'seo', 'settings'] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 text-[11px] rounded-lg font-medium capitalize transition ${tab === t ? 'bg-f-purple text-white' : 'text-f-gray hover:text-f-dark'}`}>
                  {t === 'content' ? '📝 Content' : t === 'seo' ? '🔍 SEO' : '⚙️ Settings'}
                </button>
              ))}
            </div>

            {/* ── CONTENT TAB ── */}
            {tab === 'content' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Title *</label>
                  <input ref={titleRef} value={form.title} onChange={e => handleTitleChange(e.target.value)}
                    placeholder="Your blog title..."
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white" />
                </div>
                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Slug *</label>
                  <input value={form.slug} onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value }))}
                    placeholder="blog-url-slug"
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-f-purple text-f-dark bg-white" />
                  <p className="text-[10px] text-f-muted mt-1">funtroo.in/blog/<span className="text-f-purple">{form.slug || 'your-slug'}</span></p>
                </div>
                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Excerpt (shown in listing)</label>
                  <textarea value={form.excerpt} onChange={e => setForm((f: any) => ({ ...f, excerpt: e.target.value }))} rows={3}
                    placeholder="Short description of this blog..."
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white resize-none" />
                </div>
                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Featured Image</label>
                  <div className="flex gap-2 mb-2">
                    <input type="file" id="feat-img" className="hidden" accept="image/*" onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploadingFeat(true)
                      try {
                        const url = await uploadImage(file, 'blogs')
                        setForm((f: any) => ({ ...f, featuredImage: url }))
                        toast.success('Image uploaded!')
                      } catch (err) {
                        toast.error('Upload failed')
                      }
                      setUploadingFeat(false)
                    }} />
                    <label htmlFor="feat-img" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-f-border rounded-lg text-xs cursor-pointer hover:bg-f-soft transition">
                      <Upload size={14} className="text-f-purple" />
                      {uploadingFeat ? 'Uploading...' : 'Upload Image'}
                    </label>
                  </div>
                  <input value={form.featuredImage} onChange={e => setForm((f: any) => ({ ...f, featuredImage: e.target.value }))}
                    placeholder="https://..."
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-xs outline-none focus:border-f-purple text-f-dark bg-white" />
                  {form.featuredImage && (
                    <img src={form.featuredImage} alt="preview" className="mt-2 w-full h-24 object-cover rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>
              </div>
            )}

            {/* ── SEO TAB ── */}
            {tab === 'seo' && (
              <div className="space-y-3">
                <button onClick={syncSEO} className="w-full flex items-center justify-center gap-2 py-2 border border-f-border rounded-xl text-xs text-f-gray hover:bg-white transition">
                  <RefreshCw size={12} /> Auto-fill from Title/Excerpt
                </button>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-[11px] text-f-muted font-medium">Meta Title</label>
                    {charCount(form.seo.metaTitle, 60)}
                  </div>
                  <input value={form.seo.metaTitle} onChange={e => setForm((f: any) => ({ ...f, seo: { ...f.seo, metaTitle: e.target.value } }))}
                    placeholder="SEO title (max 60 chars)"
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-xs outline-none focus:border-f-purple text-f-dark bg-white" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-[11px] text-f-muted font-medium">Meta Description</label>
                    {charCount(form.seo.metaDesc, 160)}
                  </div>
                  <textarea value={form.seo.metaDesc} onChange={e => setForm((f: any) => ({ ...f, seo: { ...f.seo, metaDesc: e.target.value } }))} rows={3}
                    placeholder="SEO description (max 160 chars)"
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-xs outline-none focus:border-f-purple text-f-dark bg-white resize-none" />
                </div>

                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Focus Keyword</label>
                  <input value={form.seo.focusKw} onChange={e => setForm((f: any) => ({ ...f, seo: { ...f.seo, focusKw: e.target.value } }))}
                    placeholder="Main keyword to rank for"
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-xs outline-none focus:border-f-purple text-f-dark bg-white" />
                </div>

                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Secondary Keywords (comma separated)</label>
                  <input value={form.seo.secondaryKws} onChange={e => setForm((f: any) => ({ ...f, seo: { ...f.seo, secondaryKws: e.target.value } }))}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-xs outline-none focus:border-f-purple text-f-dark bg-white" />
                </div>

                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Canonical URL</label>
                  <input value={form.seo.canonical} onChange={e => setForm((f: any) => ({ ...f, seo: { ...f.seo, canonical: e.target.value } }))}
                    placeholder="https://funtroo.in/blog/..."
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-xs outline-none focus:border-f-purple text-f-dark bg-white" />
                </div>

                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">OG Image URL</label>
                  <input value={form.seo.ogImage} onChange={e => setForm((f: any) => ({ ...f, seo: { ...f.seo, ogImage: e.target.value } }))}
                    placeholder="Social share image URL"
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-xs outline-none focus:border-f-purple text-f-dark bg-white" />
                </div>

                {/* SEO preview */}
                {(form.seo.metaTitle || form.title) && (
                  <div className="bg-white border border-f-border rounded-xl p-3">
                    <p className="text-[10px] text-f-muted mb-2">Google Preview</p>
                    <p className="text-xs text-green-700 mb-0.5">funtroo.in/blog/{form.slug}</p>
                    <p className="text-sm text-blue-700 font-medium leading-snug mb-1">{form.seo.metaTitle || form.title}</p>
                    <p className="text-xs text-f-gray leading-relaxed line-clamp-2">{form.seo.metaDesc || form.excerpt}</p>
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer bg-white border border-f-border rounded-xl px-3 py-2.5">
                  <input type="checkbox" checked={form.seo.noIndex} onChange={e => setForm((f: any) => ({ ...f, seo: { ...f.seo, noIndex: e.target.checked } }))} className="accent-f-purple" />
                  <span className="text-xs text-f-gray">Hide from search engines (noindex)</span>
                </label>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {tab === 'settings' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white">
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm((f: any) => ({ ...f, tags: e.target.value }))}
                    placeholder="wellness, intimacy, tips"
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white" />
                </div>

                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Author</label>
                  <input value={form.author} onChange={e => setForm((f: any) => ({ ...f, author: e.target.value }))}
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white" />
                </div>

                <div>
                  <label className="text-[11px] text-f-muted font-medium mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {form.status === 'scheduled' && (
                  <div>
                    <label className="text-[11px] text-f-muted font-medium mb-1 block">Schedule Date & Time</label>
                    <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm((f: any) => ({ ...f, scheduledAt: e.target.value }))}
                      className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white" />
                    <p className="text-[10px] text-f-muted mt-1">Blog will auto-publish at this time.</p>
                  </div>
                )}

                {/* Checklist */}
                <div className="bg-white border border-f-border rounded-xl p-3 space-y-2">
                  <p className="text-[11px] text-f-muted font-medium mb-2">SEO Checklist</p>
                  {[
                    { label: 'Title filled',         ok: form.title.length > 0 },
                    { label: 'Slug set',             ok: form.slug.length > 0 },
                    { label: 'Excerpt written',      ok: form.excerpt.length > 50 },
                    { label: 'Content added',        ok: form.content.length > 200 },
                    { label: 'Meta title ≤ 60 chars',ok: form.seo.metaTitle.length > 0 && form.seo.metaTitle.length <= 60 },
                    { label: 'Meta desc ≤ 160 chars',ok: form.seo.metaDesc.length > 0 && form.seo.metaDesc.length <= 160 },
                    { label: 'Focus keyword set',    ok: form.seo.focusKw.length > 0 },
                    { label: 'Featured image URL',   ok: form.featuredImage.length > 0 },
                    { label: 'Tags added',           ok: form.tags.length > 0 },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      {c.ok ? <CheckCircle size={12} className="text-green-500 shrink-0" /> : <AlertCircle size={12} className="text-f-muted shrink-0" />}
                      <span className={`text-[11px] ${c.ok ? 'text-green-700' : 'text-f-muted'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — HTML editor + preview */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {preview ? (
              /* ── PREVIEW ── */
              <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-3xl mx-auto px-8 py-10">
                  {form.featuredImage && <img src={form.featuredImage} alt="" className="w-full h-56 object-cover rounded-2xl mb-6" onError={e => (e.currentTarget.style.display = 'none')} />}
                  <p className="text-xs text-f-purple uppercase tracking-widest mb-2">{form.category}</p>
                  <h1 className="font-display text-4xl text-f-dark mb-3">{form.title || 'Untitled Blog'}</h1>
                  {form.excerpt && <p className="text-lg text-f-gray border-l-4 border-f-purple pl-4 italic mb-6">{form.excerpt}</p>}
                  <div className="flex gap-4 text-xs text-f-muted mb-8 pb-6 border-b border-f-border">
                    <span>{form.author}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> ~{Math.max(1, Math.round(form.content.replace(/<[^>]+>/g,'').split(/\s+/).length / 200))} min read</span>
                  </div>
                  <article
                    className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-f-dark prose-h2:text-3xl prose-h2:border-b prose-h2:border-f-border prose-h2:pb-2 prose-h3:text-2xl prose-h3:text-f-purple prose-p:text-f-gray prose-a:text-f-purple prose-blockquote:border-f-purple prose-blockquote:bg-f-soft prose-blockquote:rounded-r-xl prose-code:bg-f-soft prose-code:text-f-purple prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-gray-400 italic">No content yet...</p>' }}
                  />
                </div>
              </div>
            ) : (
              /* ── HTML EDITOR ── */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-f-soft border-b border-f-border px-4 py-2 flex items-center gap-2 shrink-0">
                  <div className="flex bg-white border border-f-border rounded-lg p-0.5">
                    {(['html', 'css', 'js'] as CodeTab[]).map(t => (
                      <button key={t} onClick={() => setCodeTab(t)}
                        className={`px-3 py-1 text-[11px] font-mono rounded transition ${codeTab === t ? 'bg-f-dark text-white' : 'text-f-gray hover:text-f-dark'}`}>
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <span className="ml-auto text-[10px] text-f-muted">
                    {codeTab === 'html' ? form.htmlContent.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length + ' words' : `${form[`${codeTab}Content`]?.length || 0} chars`}
                  </span>
                </div>

                {/* Inline Image Uploader */}
                {codeTab === 'html' && (
                  <div className="bg-white border-b border-f-border px-4 py-2 flex flex-wrap gap-2 items-center shrink-0">
                    <input type="file" id="inline-img" className="hidden" accept="image/*" onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploadingInline(true)
                      try {
                        const url = await uploadImage(file, 'blogs/inline')
                        const imgTag = `<img src="${url}" alt="image" />`
                        const ta = document.getElementById('code-editor') as HTMLTextAreaElement
                        const s = ta.selectionStart
                        const val = form.htmlContent
                        setForm((f: any) => ({ ...f, htmlContent: val.slice(0, s) + '\n' + imgTag + '\n' + val.slice(ta.selectionEnd) }))
                        toast.success('Image inserted!')
                      } catch (err) {
                        toast.error('Upload failed')
                      }
                      setUploadingInline(false)
                    }} />
                    <label htmlFor="inline-img" className="flex items-center gap-1.5 px-2.5 py-1 bg-f-light text-f-purple rounded-lg text-[11px] cursor-pointer hover:bg-f-soft transition font-medium">
                      <ImageIcon size={12} /> {uploadingInline ? 'Uploading...' : 'Insert Image'}
                    </label>

                    <div className="w-px h-4 bg-f-border mx-1"></div>

                    {[
                      { label: 'H2', insert: '<h2>Heading</h2>' },
                      { label: 'H3', insert: '<h3>Sub Heading</h3>' },
                      { label: 'P',  insert: '<p>Paragraph text here.</p>' },
                      { label: 'B',  insert: '<strong>bold text</strong>' },
                      { label: 'UL', insert: '<ul>\n  <li>Item 1</li>\n</ul>' },
                      { label: 'A',  insert: '<a href="#">Link</a>' },
                    ].map(btn => (
                      <button key={btn.label}
                        onClick={() => {
                          const ta  = document.getElementById('code-editor') as HTMLTextAreaElement
                          const s   = ta.selectionStart
                          const val = form.htmlContent
                          setForm((f: any) => ({ ...f, htmlContent: val.slice(0, s) + '\n' + btn.insert + '\n' + val.slice(ta.selectionEnd) }))
                          setTimeout(() => { ta.focus(); ta.setSelectionRange(s + btn.insert.length + 2, s + btn.insert.length + 2) }, 0)
                        }}
                        className="px-2.5 py-1 bg-white border border-f-border rounded-lg text-[11px] font-mono text-f-dark hover:bg-f-light hover:border-f-purple transition">
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  id="code-editor"
                  value={form[`${codeTab}Content`]}
                  onChange={e => setForm((f: any) => ({ ...f, [`${codeTab}Content`]: e.target.value }))}
                  placeholder={codeTab === 'html' ? '<!-- Write HTML here -->' : codeTab === 'css' ? '/* Write CSS here */\n.my-class {\n  color: red;\n}' : '// Write JS here\nconsole.log("Hello");'}
                  className="flex-1 resize-none font-mono text-sm px-5 py-4 outline-none text-f-dark bg-white placeholder:text-f-border leading-relaxed"
                  spellCheck={false}
                  style={{ tabSize: 2 }}
                  onKeyDown={e => {
                    if (e.key === 'Tab') {
                      e.preventDefault()
                      const ta  = e.currentTarget
                      const s   = ta.selectionStart
                      const val = ta.value
                      const newVal = val.slice(0, s) + '  ' + val.slice(s)
                      setForm((f: any) => ({ ...f, [`${codeTab}Content`]: newVal }))
                      setTimeout(() => ta.setSelectionRange(s + 2, s + 2), 0)
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── BLOG LIST VIEW ────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-f-dark">Blog Manager</h1>
          <p className="text-xs text-f-gray mt-0.5">{total} total posts</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">
          <Plus size={16} /> New Blog Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="bg-white border border-f-border rounded-xl flex items-center gap-2 px-3 py-2">
          <Search size={14} className="text-f-muted" />
          <input value={q} onChange={e => { setQ(e.target.value); setPage(1) }} placeholder="Search blogs..."
            className="text-sm outline-none placeholder:text-f-muted text-f-dark w-44" />
          {q && <button onClick={() => setQ('')}><X size={12} className="text-f-muted" /></button>}
        </div>

        <div className="flex gap-1">
          {[
            { label: 'All',       val: '' },
            { label: 'Published', val: 'published' },
            { label: 'Draft',     val: 'draft' },
            { label: 'Scheduled', val: 'scheduled' },
          ].map(f => (
            <button key={f.val} onClick={() => { setFilter(f.val); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${filter === f.val ? 'bg-f-purple text-white border-f-purple' : 'bg-white border-f-border text-f-gray hover:border-f-purple'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-f-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-f-soft border-b border-f-border">
            <tr>{['Title', 'Category', 'Status', 'Views', 'Read Time', 'Published', 'Actions'].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-f-gray px-4 py-3">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {loading ? [...Array(5)].map((_, i) => (
              <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-5 bg-f-border/30 rounded animate-pulse" /></td></tr>
            )) : blogs.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-16 text-center">
                <p className="text-3xl mb-3">✍️</p>
                <p className="text-f-gray text-sm">No blog posts yet.</p>
                <button onClick={openCreate} className="mt-3 text-f-purple text-sm underline">Create your first post</button>
              </td></tr>
            ) : blogs.map(b => {
              const sm = STATUS_META[b.status]
              return (
                <tr key={b.id} className="border-b border-f-soft hover:bg-f-soft/30 transition">
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="text-xs font-medium text-f-dark truncate">{b.title}</p>
                    <p className="text-[11px] text-f-muted font-mono truncate">{b.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-f-light text-f-purple px-2 py-0.5 rounded-full">{b.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sm?.color}`}>
                      {sm?.icon} {sm?.label}
                    </div>
                    {b.status === 'scheduled' && b.scheduledAt && (
                      <p className="text-[10px] text-f-muted mt-0.5">{new Date(b.scheduledAt).toLocaleDateString('en-IN')}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-f-gray"><Eye size={11} /> {b.views}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-f-gray"><Clock size={11} /> {b.readTime} min</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-f-muted">{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-IN') : '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-f-light rounded-lg transition" title="Edit">
                        <Pencil size={13} className="text-f-purple" />
                      </button>
                      {b.status === 'published' && (
                        <a href={`/blog/${b.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-f-light rounded-lg transition" title="View Live">
                          <Globe size={13} className="text-green-500" />
                        </a>
                      )}
                      <button onClick={() => deleteBlog(b.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 15 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
            className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">← Prev</button>
          <span className="px-4 py-2 text-sm text-f-gray">{page} / {Math.ceil(total/15)||1}</span>
          <button onClick={() => setPage(p=>p+1)} disabled={page>=Math.ceil(total/15)}
            className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">Next →</button>
        </div>
      )}
    </div>
  )
}

