// Private S3 image storage for DeliverUS. Requires npm install @aws-sdk/client-s3.
let sdkPromise
const isS3Enabled = () => process.env.FILE_STORAGE === 's3'

const settings = () => {
  const bucket = process.env.S3_BUCKET
  const region = process.env.AWS_REGION
  const prefix = (process.env.S3_PREFIX || '').replace(/^\/+|\/+$/g, '')
  if (!bucket || !region || !/^dev\/[a-zA-Z0-9_-]+$/.test(prefix)) {
    throw new Error('Set S3_BUCKET, AWS_REGION and S3_PREFIX=dev/<developer>')
  }
  return { bucket, region, prefix }
}
const configuredFolders = () => [
  process.env.AVATARS_FOLDER, process.env.RESTAURANTS_FOLDER, process.env.PRODUCTS_FOLDER
].filter(Boolean).map(f => f.replaceAll('\\', '/').replace(/^\.\//, '').replace(/^\/+|\/+$/g, ''))
const validPath = (path) => {
  if (!/^public\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png)$/.test(path) ||
      !configuredFolders().includes(path.slice(0, path.lastIndexOf('/')))) {
    throw new Error('Invalid asset path')
  }
  return path
}
const objectKey = path => settings().prefix + '/' + validPath(path)
const sdk = async () => {
  if (!sdkPromise) {
    sdkPromise = import('@aws-sdk/client-s3').then(mod => ({
      client: new mod.S3Client({ region: settings().region }),
      PutObjectCommand: mod.PutObjectCommand,
      GetObjectCommand: mod.GetObjectCommand
    }))
  }
  return sdkPromise
}
const putAsset = async (path, file) => {
  if (!['image/jpeg', 'image/png'].includes(file.mimetype) || file.size > 2000000) {
    throw new Error('Only JPG/PNG files under 2 MB are allowed')
  }
  const { bucket } = settings()
  const { client, PutObjectCommand } = await sdk()
  await client.send(new PutObjectCommand({
    Bucket: bucket, Key: objectKey(path), Body: file.buffer,
    ContentType: file.mimetype, ServerSideEncryption: 'AES256'
  }))
}
const streamAsset = async (req, res) => {
  try {
    const { bucket } = settings()
    const { client, GetObjectCommand } = await sdk()
    const output = await client.send(new GetObjectCommand({
      Bucket: bucket, Key: objectKey('public' + req.path)
    }))
    res.setHeader('Content-Type', output.ContentType || 'application/octet-stream')
    res.setHeader('Cache-Control', 'private, max-age=300')
    output.Body.on('error', () => { if (!res.headersSent) res.sendStatus(502); else res.destroy() })
    output.Body.pipe(res)
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404 ||
        error.message === 'Invalid asset path') return res.sendStatus(404)
    console.error('S3 read failed:', error.name)
    res.sendStatus(502)
  }
}
export { isS3Enabled, putAsset, streamAsset }
