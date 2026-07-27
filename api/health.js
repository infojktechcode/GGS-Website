export default function handler(req, res) {
  res.json({
    status: 'ok',
    method: req.method,
    supabaseUrl: !!process.env.SUPABASE_URL,
    supabaseKey: !!(process.env.SUPABASE_SECRET_KEY && process.env.SUPABASE_SECRET_KEY.length > 20),
  })
}
