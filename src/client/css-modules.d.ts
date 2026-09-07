declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.css'
declare module '*.webp?inline' {
  const url: string
  export default url
}
