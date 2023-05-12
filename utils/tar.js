import tar from "tar";
import fs from "fs";
import zlib from "zlib";

// Create a tar.gz archive of a specific file
export function createTarGz(filePath, outputFilePath) {
  const tarStream = tar.c({ gzip: true }, [filePath]);
  const writeStream = fs.createWriteStream(outputFilePath);

  tarStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    tarStream.on("end", resolve);
    tarStream.on("error", reject);
    writeStream.on("error", reject);
  });
}
