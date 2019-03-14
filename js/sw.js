
let staticCacheID = 'res-review-0';
const cacheLists = [
	'/',
	'/index.html',
	'/restaurant.html',
	'/css/styles.css',
	'/js/dbhelper.js',
	'/js/main.js',
	'/js/restaurant_info.js',
	'/data/restaurants.json',
	'/img/1.jpg',
	'/img/2.jpg',
	'/img/3.jpg',
	'/img/4.jpg',
	'/img/5.jpg',
	'/img/6.jpg',
	'/img/7.jpg',
	'/img/8.jpg',
	'/img/9.jpg',
	'/img/10.jpg'
];

// Open a cache name 'cacheFile-v1'
// Add cache the urls from cacheLists
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheID).then(function(cache) {
			return cache.addAll(cacheLists);
		})
	);
});


// Respond with an entry from the cache if there is one
// If there isn't, fetch from the network
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				//console.log('Found'); 
				console.log('Found ', event.request, 'in cacheLists'); 
				return response;
			}
			else {
				//console.log('Could not found'); 
				console.log('Could not found ', event.request, 'in cacheLists, fetching from network'); 
				return fetch(event.request)
						.then(function(response) {
							const clonedResponse = response.clone();
							caches.open(staticCacheID).then(function(cache) {
								cache.put(event.request, clonedResponse);
							})
							return response;
						})
						.catch(function(err) {
							// if (event.request.url.indexof('*.jpg') > -1) {
							// 	return caches.match('/img/na.png');
							// }
							// return new Response("Application is not connected to the internet", {
							// 	status: 404,
							// 	statusText: "Application is not connected to the internet"
							// });
							console.error(err);
						});
			}
		})
	);
});


// Update cache
self.addEventListener('activate', function(event){
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('res-review-') &&
						   cacheName != staticCacheID;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	)

})