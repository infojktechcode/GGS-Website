const API_BASE = import.meta.env.VITE_API_URL || ''

export async function sendContactForm(data) {
  const response = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to send message')
  return response.json()
}

export async function sendAdmissionEnquiry(data) {
  const response = await fetch(`${API_BASE}/api/admissions/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to submit enquiry')
  return response.json()
}
