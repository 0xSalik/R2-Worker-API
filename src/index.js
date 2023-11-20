async fetch(request, env, context) {
  const url = new URL(request.url);
  const key = url.pathname.slice(1);
  if (!authorizeRequest(request, env, key)) {
    return new Response("Unauthorized.", {
      status: 403,
    });
  }
  switch (request.method) {
    case "PUT":
      await env.bucket.put(key, request.body);
      return new Response(`Put ${key} successfully!`);
    case "GET":
      try {
        const headers = new Headers();
        const cacheKey = new Request(url.toString(), request);
        const cache = caches.default;
        let response = await cache.match(cacheKey);
        if (response) {
          console.log(`Cache hit for: ${request.url}.`);
          return response;
        }
        console.log(
          `Response for request url: ${request.url} not present in cache. Fetching and caching request.`
        );
        const object = await env.bucket.get(key);
        if (object === null) {
          return new Response("Object Not Found", { status: 404 });
        }
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.append("Cache-Control", "public, max-age=31536000");
        response = new Response(object.body, {
          headers,
        });
        context.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      } catch (e) {
        return new Response("Error thrown " + e.message);
      }
    case "DELETE":
      await env.bucket.delete(key);
      return new Response("Deleted!");
    default:
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "PUT, GET, DELETE",
        },
      });
  }
}
var hasValidHeader = (request, env) => {
  return request.headers.get("X-Custom-Auth-Key") === env.AUTH_KEY_SECRET;
};
function authorizeRequest(request, env, key) {
  switch (request.method) {
    case "PUT":
    case "DELETE":
      return hasValidHeader(request, env);
    case "GET":
      return key;
    default:
      return false;
  }
}
