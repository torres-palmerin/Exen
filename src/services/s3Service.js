import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadTicket = async (file) => {
  const fileName = `tickets/${Date.now()}-${file.name}`;
  // Convert file to Uint8Array to avoid ReadableStream issues in some browsers
  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  const params = {
    Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
    Key: fileName,
    Body: uint8,
    ContentType: file.type,
    ContentLength: uint8.byteLength,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log("Ticket subido con éxito a la Capa Bronze:", data);
    return fileName;
  } catch (err) {
    console.error("Error al subir a S3:", err);
    throw err;
  }
};