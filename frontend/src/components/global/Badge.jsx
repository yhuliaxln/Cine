// src/components/global/Badge.jsx
export default function Badge({ 
  children, 
  color = 'gray',
  size = 'md',
  rounded = 'full'
}) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    amber: 'bg-amber-100 text-amber-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <span className={`
      font-medium inline-flex items-center
      ${sizeClasses[size]}
      ${colorClasses[color]}
      ${roundedClasses[rounded]}
    `}>
      {children}
    </span>
  );
}