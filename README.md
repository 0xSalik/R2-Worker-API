## WORKER TO INTERACT WITH CLOUDFLARE R2 (S3) BUCKET AS AN API.

This worker acts as an api for your R2 bucket.

## Setup

- Create a worker and bind it to your R2 Bucket.

- Create an authentication key and store it in a KV Namespace with the name `AUTH_KEY_SECRET`. You will use this key to authenticate with your api.

- Install wrangler and sign-in ([Read official docs for instructions](https://developers.cloudflare.com/workers/wrangler/install-and-update/)).

- Edit the `wrangler.toml` file and add your worker name, account id and bucket name to it (you can get your account id with `$ wrangler whoami`).

- Deploy the worker with `$ wrangler publish`.

## Using the API

_Replace `<auth-key>` with your actual key (remove the angle brackets), and `example.workers.dev` with your own worker route._

#### Uploading binary data using curl

curl https://example.workers.dev/<location> -X PUT --header 'X-Custom-Auth-Key: <auth-key>' --data-binary 'test'

#### Uploading files using curl

curl https://example.workers.dev/file.ext -X PUT --header 'X-Custom-Auth-Key: <auth-key>' --upload-file ./file.ext

#### Deleting a file using curl

curl https://example.workers.dev/file.ext -X DELETE --header 'X-Custom-Auth-Key: <auth-key>'

That's it. You can just use curl or write an app in a language of your choice to interact with the api.
