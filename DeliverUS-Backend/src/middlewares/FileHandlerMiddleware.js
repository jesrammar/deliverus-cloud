import fs from 'fs'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { isS3Enabled, putAsset } from '../services/S3Storage.js'

const addFilenameToBody = (req, fieldNames) => {
  fieldNames.forEach(fieldName => {
    if (req.files?.[fieldName]) {
      req.body[fieldName] = req.files[fieldName][0].destination + '/' + req.files[fieldName][0].filename
    } else if (req.file?.fieldname === fieldName) {
      req.body[fieldName] = req.file.destination + '/' + req.file.filename
    }
  })
}
const createMulter = (fieldNames, folder) => {
  const storage = isS3Enabled() ? multer.memoryStorage() : multer.diskStorage({
    destination: function (req, file, cb) {
      fs.mkdirSync(folder, { recursive: true })
      cb(null, folder)
    },
    filename: function (req, file, cb) {
      cb(null, Math.random().toString(36).substring(7) + '-' + Date.now() + '.' + file.originalname.split('.').pop())
    }
  })
  const options = { storage }
  if (isS3Enabled()) options.limits = { fileSize: 2000000, files: fieldNames.length }
  if (fieldNames.length === 1) return multer(options).single(fieldNames[0])
  return multer(options).fields(fieldNames.map(name => ({ name, maxCount: 1 })))
}
const handleFilesUpload = (fieldNames, folder) => (req, res, next) => {
  createMulter(fieldNames, folder)(req, res, err => {
    if (err) return res.status(400).send({ error: err.message })
    if (!isS3Enabled()) {
      addFilenameToBody(req, fieldNames)
      return next()
    }
    const base = String(folder || '').replaceAll('\\', '/').replace(/^\.\//, '').replace(/^\/+|\/+$/g, '')
    req.pendingS3Uploads = []
    for (const fieldName of fieldNames) {
      const file = req.files?.[fieldName]?.[0] || (req.file?.fieldname === fieldName ? req.file : null)
      if (!file) continue
      const ext = file.mimetype === 'image/png' ? 'png' : 'jpg'
      const path = base + '/' + randomUUID() + '.' + ext
      req.body[fieldName] = path
      req.pendingS3Uploads.push({ path, file })
    }
    next()
  })
}
const persistFiles = async (req, res, next) => {
  if (!isS3Enabled() || !req.pendingS3Uploads?.length) return next()
  try {
    for (const { path, file } of req.pendingS3Uploads) await putAsset(path, file)
    next()
  } catch (err) {
    console.error('S3 upload failed:', err.name)
    res.status(502).send({ error: 'Could not store uploaded image' })
  }
}
export { handleFilesUpload, persistFiles }
