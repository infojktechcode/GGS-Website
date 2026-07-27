export default function SchoolLogo({ textColor = '#0A56B5', size = 'md', showText = true }) {
  const heights = { sm: 32, md: 40, lg: 56 }
  const h = heights[size] || heights.md

  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Glorious Group of Schools logo"
        height={h}
        width={h * 1.1}
        className="object-contain"
        loading="eager"
        decoding="async"
      />
      {showText && (
        <div>
          <span className="block font-heading font-bold leading-tight" style={{ color: textColor, fontSize: h * 0.4 }}>
            Glorious Group
          </span>
          <span className="block text-xs font-medium opacity-80" style={{ color: textColor }}>
            of Schools
          </span>
        </div>
      )}
    </div>
  )
}
