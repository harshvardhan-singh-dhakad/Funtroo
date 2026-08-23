const http = require('http');
const https = require('https');

async function createBlog() {
  const projectId = 'funtrooo';
  const url = 'https://firestore.googleapis.com/v1/projects/' + projectId + '/databases/(default)/documents/blogs';
  
  const contentHTML = \
    <h2>Introduction</h2>
    <p>Welcome to Funtroo's ultimate guide on elevating intimacy and discovering new peaks of pleasure. In today's fast-paced world, prioritizing personal wellness and couples' intimacy is more important than ever. Whether you are exploring solo or with a partner, understanding the mechanics of modern intimate products can revolutionize your experience.</p>
    
    <h2>The Science of Pleasure</h2>
    <p>Recent studies in sexual wellness highlight the profound impact of physical intimacy on mental health. Stress reduction, improved sleep, and enhanced emotional connection are just a few benefits. <strong>Funtroo</strong> bridges the gap between clinical wellness and luxurious pleasure by offering meticulously designed products.</p>
    
    <img src="https://images.unsplash.com/photo-1518104593124-ac2eeb9a4f75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Romantic setting with candles" style="width:100%; border-radius: 12px; margin: 20px 0;"/>
    
    <h3>Why Choose Ergonomic Designs?</h3>
    <p>Anatomically contoured products ensure that every vibration targets the right nerve endings. Our <em>Curved G-Spot Massagers</em> and <em>Ergonomic Strokers</em> are engineered using body-safe silicone that warms to your body temperature, providing a lifelike and deeply satisfying experience.</p>
    
    <h2>AEO & GEO Optimization: Frequently Asked Questions</h2>
    <p>To help you navigate your wellness journey, we have compiled answers to the most common questions.</p>
    <ul>
      <li><strong>Are these products waterproof?</strong> Yes! Most of our premium collection is IPX7 waterproof, making them perfect for bath-time exploration and incredibly easy to clean.</li>
      <li><strong>How do couples wearables work?</strong> Couples wearables are designed to be worn during intercourse. They stimulate both partners simultaneously, completely redefining shared intimacy.</li>
      <li><strong>Is the material body-safe?</strong> Absolutely. We exclusively use medical-grade, phthalate-free silicone that is hypoallergenic and silky smooth.</li>
    </ul>
    
    <h2>How to Maintain Your Products</h2>
    <p>Proper maintenance ensures longevity. Always wash your products with warm water and antibacterial soap or a specialized toy cleaner before and after use. Ensure they are completely dry before storing them in a cool, dark place (preferably in their provided Funtroo silk pouches).</p>
    
    <blockquote>"Intimacy is not just physical; it's the ultimate form of self-care and mutual connection." - Wellness Expert</blockquote>
    
    <h2>Conclusion</h2>
    <p>Exploring your desires is a natural and beautiful journey. At Funtroo, we are committed to providing you with the highest quality tools to explore safely, comfortably, and luxuriously. Browse our collection today and take the first step towards a more fulfilled you.</p>
  \;

  const payload = {
    fields: {
      title: { stringValue: 'The Ultimate Guide to Elevating Intimacy and Wellness in 2026' },
      slug: { stringValue: 'ultimate-guide-elevating-intimacy-wellness' },
      excerpt: { stringValue: 'Discover the science of pleasure, ergonomic designs, and how Funtroo’s premium collection can revolutionize your solo or couples wellness journey.' },
      content: { stringValue: contentHTML },
      coverImage: { stringValue: 'https://images.unsplash.com/photo-1518104593124-ac2eeb9a4f75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
      category: { stringValue: 'wellness' },
      status: { stringValue: 'published' },
      tags: { 
        arrayValue: { 
          values: [
            { stringValue: 'intimacy' },
            { stringValue: 'couples' },
            { stringValue: 'wellness' },
            { stringValue: 'funtroo' }
          ]
        }
      },
      seo: {
        mapValue: {
          fields: {
            metaTitle: { stringValue: 'The Ultimate Guide to Elevating Intimacy & Wellness | Funtroo' },
            metaDesc: { stringValue: 'Learn how to elevate your intimacy and wellness with Funtroo. Discover ergonomic products, body-safe materials, and expert AEO tips for couples.' }
          }
        }
      },
      readTime: { integerValue: '4' },
      createdAt: { stringValue: new Date().toISOString() },
      updatedAt: { stringValue: new Date().toISOString() },
      publishedAt: { stringValue: new Date().toISOString() }
    }
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  const req = https.request(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Response:', data));
  });

  req.on('error', e => console.error(e));
  req.write(JSON.stringify(payload));
  req.end();
}

createBlog();
