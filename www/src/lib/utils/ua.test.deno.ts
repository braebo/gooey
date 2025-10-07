//? Test results for Deno:
// const _ = {
// 	requestUA:
// 		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
// 	fetchUA: 'Deno/1.45.5',
// }

// import { getUserAgent } from './ua.js'

// // Create a simple server
// const handler = async (request: Request): Promise<Response> => {
// 	// Make a server-side fetch request
// 	const fetchResponse = await fetch('https://httpbin.org/user-agent')
// 	const fetchData = await fetchResponse.json()

// 	const requestUA = getUserAgent(request)
// 	const fetchUA = fetchData['user-agent']

// 	console.log('\nClient UA:', requestUA)
// 	console.log('\nServer UA:', fetchUA)

// 	return new Response(JSON.stringify({ requestUA, fetchUA }, null, 2), {
// 		headers: { 'Content-Type': 'application/json' },
// 	})
// }

// Deno.serve(handler)
