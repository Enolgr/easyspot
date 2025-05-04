import { getStorage } from 'firebase-admin/storage'
import { v4 as uuidv4 } from 'uuid'

export async function uploadPoster(buffer, fileType, originalName = '') {
  const bucket = getStorage().bucket(process.env.FIREBASE_STORAGE_BUCKET)
  const safeName = originalName?.replace(/\s/g, '_') || uuidv4()
  const fileName = `posters/${safeName}.${fileType}`
  const token = uuidv4()
  const file = bucket.file(fileName)

  await file.save(buffer, {
    metadata: {
      contentType: `image/${fileType}`,
      metadata: {
        firebaseStorageDownloadTokens: token
      }
    },
    public: true
  })

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`
}
