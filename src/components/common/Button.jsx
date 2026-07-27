import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Button({ children, to, href, variant = 'primary', size = 'md', className = '', onClick, disabled, type, ariaLabel }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-blue-700 focus:ring-brand-blue shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-brand-green text-white hover:bg-green-700 focus:ring-brand-green shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-brand-blue focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-brand-blue hover:bg-blue-50 focus:ring-brand-blue',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link to={to} className={classes} aria-label={ariaLabel}>{children}</Link>
      </motion.div>
    )
  }
  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>{children}</a>
      </motion.div>
    )
  }
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick} className={classes} disabled={disabled} type={type || 'button'} aria-label={ariaLabel}>
      {children}
    </motion.button>
  )
}
