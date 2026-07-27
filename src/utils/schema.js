export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Glorious Group of Schools',
    description: 'Providing quality CBC education from Early Years to Junior School. We nurture academic excellence, character development, and holistic growth.',
    url: 'https://gloriousgroupofschools.com',
    logo: 'https://gloriousgroupofschools.com/ggs-photos/gss%20logo.png',
    motto: 'Education is the key for a better tomorrow',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Glorious Avenue, Off Mombasa Road',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    telephone: '+254712345678',
    email: 'info@gloriousschools.ac.ke',
    sameAs: [
      'https://facebook.com/gloriousgroupofschools',
      'https://twitter.com/gloriousschools',
      'https://instagram.com/gloriousgroupofschools',
      'https://youtube.com/@gloriousschools',
      'https://linkedin.com/company/glorious-group-of-schools',
    ],
  }
}

export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://gloriousgroupofschools.com${item.path}`,
    })),
  }
}

export function getFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

export function getArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      '@type': 'Organization',
      name: 'Glorious Group of Schools',
    },
  }
}

export function getEventSchema(events) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'School Events',
    event: events.map((e) => ({
      '@type': 'Event',
      name: e.title,
      startDate: e.date,
      location: {
        '@type': 'Place',
        name: 'Glorious Group of Schools',
        address: '123 Glorious Avenue, Off Mombasa Road, Nairobi',
      },
    })),
  }
}
