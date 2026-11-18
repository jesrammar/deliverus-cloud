# DeliverUS Cloud — S3 storage laboratory

## Status

This branch prepares an **opt-in** S3 adapter. No AWS role, IAM policy, upload, RDS modification or EC2 deployment was performed by these commits.

The existing backend keeps **local disk storage by default**. S3 mode is enabled only with `FILE_STORAGE=s3`.

## Install dependency and update lockfile

From `DeliverUS-Backend`:

```bash
npm install @aws-sdk/client-s3
```

Commit the resulting `package.json` and `package-lock.json` on this feature branch after verifying installation and tests.

## Backend environment (private .env)

```dotenv
FILE_STORAGE=s3
AWS_REGION=eu-north-1
S3_BUCKET=deliverus-lab-jesus
S3_PREFIX=dev/jesus
AVATARS_FOLDER=public/avatars
RESTAURANTS_FOLDER=public/restaurants
PRODUCTS_FOLDER=public/products
```

Verify the folder names match those already configured in the app; **do not duplicate or change unrelated .env settings**.

- Do not put AWS access keys into source code or Git.
- On EC2: use a role attached to the instance.
- Locally: use a named AWS profile with scoped permissions.
- Bucket stays private; no public ACLs or public bucket policy.

## Example IAM permission for the development principal

Create/attach only to an authorized development role or identity:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::deliverus-lab-jesus/dev/jesus/*"
  }]
}
```

The adapter accepts only `dev/<developer>` as a prefix. The AWS identity must also be restricted: application-level checks alone are **not** an authorization boundary.

## Existing code integration

- `FileHandlerMiddleware.js` uses Multer. Local storage remains unchanged unless S3 is enabled.
- In S3 mode, image data is buffered then written after existing route validation/ownership middleware, before controller persistence.
- Database fields still store relative paths under `public/...`.
- `GET /public/...` proxies matching private S3 objects through the API. It keeps legacy URLs, but is not appropriate for private user content without additional authentication.
- Supported types: JPEG and PNG; max size 2 MB.
- Initial uploads that succeed before a subsequent database operation fails may leave orphan objects. Build cleanup/transactional compensation for production.
- Existing local images are **not automatically migrated**. They may fail to load when S3 mode is enabled; test using newly uploaded images first.

## Verification

1. Start against a **disposable development database**; do not point to main or shared staging.
2. Test existing local file uploads with `FILE_STORAGE=local`.
3. Enable S3 mode, configure a scoped AWS profile or EC2 role.
4. Create one test restaurant with a PNG/JPEG logo.
5. Confirm the object key is `dev/jesus/public/restaurants/<uuid>.jpg` (or equivalent configured folder).
6. Confirm the stored database path is `public/restaurants/<uuid>.jpg`.
7. Verify GET `/public/restaurants/<uuid>.jpg` displays it.
8. Check S3 prefixes `staging/`, `main/`, and `dev/vicente/` were unchanged.
9. Test upload failures and ensure no record is created on a failed S3 request.

## Separate RDS workstream

The existing RDS `deliverus-db-dev` is private. The prior CloudShell connection timed out. Do **not** make RDS publicly accessible or reset credentials again. Fix VPC access through authorized CloudShell VPC/EC2 routes first. Only then inspect `SHOW DATABASES;` and decide whether to create `deliverus_staging` and per-developer databases.

## Existing scripts caution

The backend's current `start` script exposes the Node inspector on `0.0.0.0:9229`. Do not deploy it unchanged to EC2. The existing `migrate` script contains `db:migrate:undo:all`, which can destroy data. Neither should be used on your RDS until replaced by safe deployment scripts.
