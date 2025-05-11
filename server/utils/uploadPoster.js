import { getStorage } from 'firebase-admin/storage'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { v4 as uuidv4 } from 'uuid'

// Inicializar Firebase Admin si no está inicializado
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  })
}

export async function uploadPoster(buffer, fileType, originalName = '') {
  const bucket = getStorage().bucket()

  const baseName = originalName
    ? originalName.replace(/\s/g, '_').replace(/\.[^/.]+$/, '')
    : 'poster'

  const uniqueName = `${baseName}_${uuidv4()}`
  const fileName = `posters/${uniqueName}.${fileType}`
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
