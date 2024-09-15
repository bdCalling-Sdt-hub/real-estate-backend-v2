// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface UploadedFiles {
  image?: Express.Multer.File[];
  images?: Express.Multer.File[];
  document?: Express.Multer.File[];
  signature?: Express.Multer.File[];
  documents?: Express.Multer.File[];
  selfie?: Express.Multer.File[];
  videos?: Express.Multer.File[];
}
