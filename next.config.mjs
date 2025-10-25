/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/fa/dashboards/crm',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|fa|fr|ar)',
        destination: '/:lang/dashboards/crm',
        permanent: true,
        locale: false
      },
      {
        source: '/((?!(?:en|fa|fr|ar|front-pages|favicon.ico)\\b)):path',
        destination: '/fa/:path',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
