'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQ {
  q: string
  a: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  title?: string
}

export default function FAQSection({ faqs, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // Open first by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  // Generate JSON-LD Schema for Google SEO & AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <h2 className="text-2xl md:text-3xl font-display text-f-dark mb-6 text-center">{title}</h2>
      
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div 
              key={idx} 
              className={`border border-f-border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-f-soft border-f-purple/30 shadow-sm' : 'bg-white hover:border-f-purple/50'}`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-sm md:text-base text-f-dark pr-4">{faq.q}</span>
                <ChevronDown size={18} className={`text-f-purple transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className={`px-5 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-sm text-f-gray leading-relaxed">{faq.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
