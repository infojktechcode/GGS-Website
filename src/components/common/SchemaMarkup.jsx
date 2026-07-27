import { Helmet } from 'react-helmet-async'
import { getOrganizationSchema } from '../../utils/schema'

export default function SchemaMarkup({ breadcrumbs, faqs, article, events }) {
  const schemas = [getOrganizationSchema()]

  if (breadcrumbs) schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://gloriousgroupofschools.com${item.path}`,
    })),
  })

  if (faqs) schemas.push({
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
  })

  if (article) schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { '@type': 'Organization', name: 'Glorious Group of Schools' },
  })

  if (events) schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: events[0]?.title || 'School Events',
    startDate: events[0]?.date,
    location: { '@type': 'Place', name: 'Glorious Group of Schools' },
  })

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
