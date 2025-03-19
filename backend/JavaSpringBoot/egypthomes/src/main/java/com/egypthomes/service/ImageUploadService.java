package com.egypthomes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.FileImageOutputStream;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
public class ImageUploadService {
    @Value("${image.upload.dir}")
    private String imageUploadDir;

    @Value("${image.compression.quality}")
    private float imageCompressionQuality;

    @Value("${image.api.url}")
    private String imageUrl;

    public String saveImage(String base64Image) throws IOException {
        // Create upload directory if it doesn't exist
        File uploadDir = new File(imageUploadDir);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        BufferedImage image = decodeBase64ToImage(base64Image);
        String fileName = generateFileName();
        File outputFile = new File(Paths.get(imageUploadDir, fileName).toString());
        writeCompressedImage(image, outputFile);
        return imageUrl + "/" + fileName;
    }

    private BufferedImage decodeBase64ToImage(String base64Image) throws IOException {
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
        try (InputStream is = new ByteArrayInputStream(imageBytes)) {
            return ImageIO.read(is);
        }
    }

    private String generateFileName() {
        return UUID.randomUUID() + ".jpg";
    }

    private void writeCompressedImage(BufferedImage image, File outputFile) throws IOException {
        ImageWriter writer = getJpegWriter();
        try (ImageOutputStream ios = new FileImageOutputStream(outputFile)) {
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(imageCompressionQuality);
            }
            writer.write(null, new IIOImage(image, null, null), param);
        } finally {
            writer.dispose();
        }
    }

    private ImageWriter getJpegWriter() {
        if (!ImageIO.getImageWritersByFormatName("jpeg").hasNext()) {
            throw new IllegalStateException("No JPEG writer found");
        }
        return ImageIO.getImageWritersByFormatName("jpeg").next();
    }
}
