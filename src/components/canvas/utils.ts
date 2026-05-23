export const baseTableStyle = {
  fill: '#ffffff',
  stroke: '#E6E6E6',
  strokeWidth: 1,
  cornerRadius: 10,
}

export const tableStyle = (isHovered: boolean) => ({
  ...baseTableStyle,
  ...(isHovered
    ? {
        shadowColor: 'rgba(0,0,0,0.12)',
        shadowBlur: 10,
      }
    : {}),
})

export const baseCardStyle = {
  fill: '#ffffff',
  stroke: '#E6E6E6',
  strokeWidth: 1,
  cornerRadius: 6,
}

export const cardTextStyle = {
  fontSize: 12,
  fill: '#334155',
  align: 'center' as const,
  verticalAlign: 'middle' as const,
}

export const cardStyle = (isHovered: boolean = false) => ({
  ...baseCardStyle,
  ...(isHovered
    ? {
        shadowColor: 'rgba(0,0,0,0.12)',
        shadowBlur: 10,
      }
    : {}),
})
