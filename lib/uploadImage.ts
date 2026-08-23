import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export const uploadImage = async (file: File, folder: string = 'images'): Promise<string> => {
  if (!file) throw new Error('No file provided')
  if (!storage) throw new Error('Firebase storage not initialized')

  // Create a unique filename
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const storageRef = ref(storage, `${folder}/${filename}`)

  // Upload file
  const snapshot = await uploadBytes(storageRef, file)
  
  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}
