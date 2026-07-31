const API = '/api/admin'

export async function adminFetch(action, options = {}) {
  const url = options.params
    ? `${API}?action=${action}&${new URLSearchParams(options.params)}`
    : `${API}?action=${action}`

  const res = await fetch(url, {
    method: options.method || 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`)
  }

  return data
}

export async function adminFetchAll(action, params = {}) {
  const url = `${API}?action=${action}&${new URLSearchParams(params)}`
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`)
  }
  return data
}

export async function adminUpload(bucket, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const base64 = ev.target.result.split(',')[1]
        const data = await adminFetch('upload', {
          body: { bucket, file: base64, fileName: file.name, contentType: file.type },
        })
        if (!data.url) reject(new Error('Upload failed - no URL returned'))
        resolve(data.url)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}
