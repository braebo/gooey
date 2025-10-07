//? Test results for Bun:
const _ = {
	requestUA:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
	fetchUA: 'Bun/1.1.22',
}

// /// <reference types="bun" />

// import { getUserAgent } from './ua.js'

// const server = Bun.serve({
// 	port: 3000,
// 	async fetch(request) {
// 		const fetchResponse = await fetch('https://httpbin.org/user-agent')
// 		const fetchData = await fetchResponse.json()

// 		const requestUA = getUserAgent(request)
// 		const fetchUA = fetchData['user-agent']

// 		console.log('\nClient UA:', requestUA)
// 		console.log('\nServer UA:', fetchUA)

// 		return new Response(JSON.stringify({ requestUA, fetchUA }, null, 2), {
// 			headers: { 'Content-Type': 'application/json' },
// 		})
// 	},
// })

// console.log(`Listening on http://localhost:${server.port}`)
