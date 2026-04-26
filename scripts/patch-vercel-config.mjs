import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const configPath = new URL('../.vercel/output/config.json', import.meta.url)

if (!existsSync(configPath)) process.exit(0)

const config = JSON.parse(readFileSync(configPath, 'utf8'))
const astroAssetsRoute = config.routes?.find((route) => route.src === '^/_astro/(.*)$')

if (astroAssetsRoute) {
	astroAssetsRoute.headers = {
		...astroAssetsRoute.headers,
		'Access-Control-Allow-Origin': '*',
		'Cross-Origin-Resource-Policy': 'cross-origin',
	}
}

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)
