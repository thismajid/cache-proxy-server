const http = require("http");
const axios = require("axios");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const Redis = require("ioredis");

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

const argv = yargs(hideBin(process.argv))
  .option("port", {
    describe: "Port on which the proxy server will run",
    type: "number",
    demandOption: true,
  })
  .option("origin", {
    describe: "Origin server URL",
    type: "string",
    demandOption: true,
  })
  .option("clear-cache", {
    describe: "Clear the Redis cache",
    type: "boolean",
    demandOption: false,
  })
  .help().argv;

if (argv["clear-cache"]) {
  redis.flushall().then(() => {
    console.log("Redis cache cleared.");
    process.exit(0);
  });
}

const handleRequest = async (req, res) => {
  const cacheKey = `${req.method}:${req.url}`;
  const originUrl = `${argv.origin}${req.url}`;

  try {
    const cachedResponse = await redis.get(cacheKey);

    if (cachedResponse) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "X-Cache": "HIT",
      });
      res.end(cachedResponse);
      return;
    }

    const response = await axios({
      method: req.method,
      url: originUrl,
      headers: req.headers,
    });

    redis.setex(cacheKey, 60, JSON.stringify(response.data));

    res.writeHead(response.status, {
      "Content-Type": "application/json",
      "X-Cache": "MISS",
    });
    res.end(JSON.stringify(response.data));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error forwarding request");
  }
};

const server = http.createServer(handleRequest);

server.listen(argv.port, () => {
  console.log(`Caching proxy server running on port ${argv.port}`);
  console.log(`Forwarding requests to: ${argv.origin}`);
});
