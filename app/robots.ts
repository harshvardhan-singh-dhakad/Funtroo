import { MetadataRoute } from 'next'

const AI_USER_AGENTS = [
  // OpenAI
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  // Anthropic
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  // Google Gemini & AI
  'Google-Extended',
  'GoogleOther',
  'GoogleOther-Image',
  'GoogleOther-Video',
  // Perplexity AI
  'PerplexityBot',
  // Meta AI
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'FacebookBot',
  // Apple Intelligence
  'Applebot',
  'Applebot-Extended',
  // Mistral AI
  'MistralAI',
  'MistralBot',
  // Cohere
  'cohere-ai',
  'Cohere-training-data-crawler',
  // Common Crawl & ByteDance
  'CCBot',
  'Bytespider',
  // Amazon & Search Assistants
  'Amazonbot',
  'DuckAssistBot',
  'YouBot',
  // AI Knowledge Scrapers
  'Diffbot',
  'Webz.io',
  'Timpibot',
]

export default function robots(): MetadataRoute.Robots {
  const allowedPublicPaths = [
    '/',
    '/shop',
    '/shop/*',
    '/product/*',
    '/blog',
    '/blog/*',
    '/about',
    '/privacy-policy',
    '/terms',
    '/terms-and-conditions',
    '/llms.txt',
    '/llms-full.txt',
    '/sitemap.xml',
  ]

  const privateDisallowedPaths = [
    '/admin',
    '/admin/*',
    '/api/admin/*',
    '/api/orders/*',
    '/account',
    '/account/*',
    '/checkout',
    '/checkout/*',
  ]

  const rules: MetadataRoute.Robots['rules'] = [
    // 1. All AI Bots - 100% Open Access to Public Content
    ...AI_USER_AGENTS.map(agent => ({
      userAgent: agent,
      allow: allowedPublicPaths,
      disallow: privateDisallowedPaths,
    })),

    // 2. Universal Crawler Rule
    {
      userAgent: '*',
      allow: allowedPublicPaths,
      disallow: privateDisallowedPaths,
    },
  ]

  return {
    rules,
    sitemap: 'https://funtroo.in/sitemap.xml',
    host: 'https://funtroo.in',
  }
}
