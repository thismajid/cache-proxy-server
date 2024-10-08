# Caching Proxy Server with Redis

A simple CLI tool that starts a caching proxy server, forwarding requests to an origin server and caching the responses in Redis. This helps to reduce the load on the origin server, decrease response times for repeated requests, and improve performance.

## Features

• Caching: Caches responses for a set duration to avoid redundant requests to the origin server.

• Customizable Proxy: Specify the port and the origin server from the CLI.

• Cache Management: Easily clear the cache via the CLI.

• Headers: Returns headers to indicate whether the response was served from cache or from the origin server.

    • X-Cache: HIT: The response was served from the cache.
    • X-Cache: MISS: The response was fetched from the origin server and cached.


## Installation

Clone the repository:

```bash
git clone https://github.com/thismajid/cache-proxy-server.git
cd cache-proxy-server
```

Install the required dependencies:

```bash
npm install
```

Make sure Redis is installed and running. You can install Redis from here or use Docker:

```bash
docker run --name redis -p 6379:6379 -d redis
```

## Usage

### Start the Caching Proxy Server

You can start the proxy server by specifying the port and the origin server using the following command:

```bash
node index.js --port <number> --origin <url>
```

For example:

```bash
node index.js --port 3000 --origin http://dummyjson.com
```

This will start the proxy server on localhost:3000 and forward requests to http://dummyjson.com.

### Example Request

If you make a request to:

```bash
curl http://localhost:3000/products
```

It will forward the request to http://dummyjson.com/products, cache the response, and return it. On subsequent requests to the same endpoint, the response will be served from the cache.

### Clear the Cache

You can clear the Redis cache by running:

```bash
node index.js --clear-cache
```

This will clear all cached data stored in Redis.

## Headers

Each response will include the following header to indicate whether the response was served from cache or not:

• X-Cache: HIT – The response was served from Redis cache.
• X-Cache: MISS – The response was fetched from the origin server and cached.

## Configuration

Cache TTL: By default, cached responses are stored in Redis for 60 seconds. You can change this value in the code by modifying the redis.setex() TTL value.

## Requirements

• Node.js v14 or later
• Redis server

## Dependencies

• [ioredis](https://github.com/luin/ioredis) – Redis client for Node.js
• [axios](https://axios-http.com/) – Promise-based HTTP client
• [yargs]() – CLI argument parser