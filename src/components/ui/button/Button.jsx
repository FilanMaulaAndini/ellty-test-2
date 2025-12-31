import './Button.css'

export default function Button({
  label,
  variant = 'primary',
  disabled = false,
  onClick,
}) {
  return (
    <button
      className={`btn ${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}