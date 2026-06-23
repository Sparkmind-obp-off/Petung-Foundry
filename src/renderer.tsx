import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ?? 'Pétung — Outcome Foundry Budaya Jawa'}</title>
        <meta
          name="description"
          content="Pétung mengubah weton & primbon menjadi artefak budaya yang rapi & dipersonalisasi: kalender hari baik, kartu weton, nama usaha. Edukasi-budaya, bukan ramalan."
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-paper text-stone-800">
        {children}
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
