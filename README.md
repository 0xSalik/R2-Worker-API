## WORKER TO INTERACT WITH CLOUDFLARE R2 (S3) BUCKET AS AN API.

This worker acts as an client-facing api for your R2 bucket. You can use it to upload or modify files on your bucket directly using an authentication key and serve files without having to authenticate, basically use it as a CDN.

## Setup

- Create a worker and an R2 bucket on the cloudflare dashboard.

- Create an authentication key and store it as a variable in your worker settings with the name `AUTH_KEY_SECRET`. You will use this key to authenticate with your api.

- Install wrangler and sign-in. ([Read official docs for instructions](https://developers.cloudflare.com/workers/wrangler/install-and-update/)).

- Edit the `wrangler.toml` file and add your worker name, account id and bucket name to it (you can get your account id with `$ wrangler whoami`).

- Deploy the worker with `$ wrangler publish`.

## Using the API

_Replace `<auth-key>` with your actual key (remove the angle brackets), and `example.workers.dev` with your own worker route._

```bash
# Uploading binary data using curl
$ curl https://example.workers.dev/<location> -X PUT --header 'X-Custom-Auth-Key: <auth-key>' --data-binary 'test'
# Uploading files using curl
$ curl https://example.workers.dev/file.ext -X PUT --header 'X-Custom-Auth-Key: <auth-key>' --upload-file ./file.ext
# Deleting a file using curl
$ curl https://example.workers.dev/file.ext -X DELETE --header 'X-Custom-Auth-Key: <auth-key>'
```

You can also use a custom domain by routing it to your worker from the cloudflare dashboard. (The custom domain needs to be in the same zone as the worker)

That's it. You can just use curl or write an app in a language of your choice to interact with the api.
