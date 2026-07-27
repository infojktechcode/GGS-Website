import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '254712345678'
const WHATSAPP_MESSAGE = 'Hello%20Glorious%20Group%20of%20Schools%2C%20I%20would%20like%20to%20make%20an%20enquiry.'

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  )
}
