export const DEFAULT_CODE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello NoteCode</title>
  </head>
  <body>
    <h1>Build something worth sharing.</h1>
  </body>
</html>`

export const LANGUAGES = Object.freeze([
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "rust", label: "Rust" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
])

export const THEMES = Object.freeze([
  { value: "dark", label: "Midnight" },
  { value: "light", label: "Daylight" },
])
