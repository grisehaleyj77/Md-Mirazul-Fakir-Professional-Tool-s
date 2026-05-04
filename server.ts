import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import muhammara from "muhammara";
import fs from "fs";
import os from "os";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Locking PDF
  app.post("/api/lock-pdf", upload.single("file"), (req: any, res) => {
    const tempDir = os.tmpdir();
    const id = Date.now();
    const inputPath = path.join(tempDir, `input-${id}.pdf`);
    const outPath = path.join(tempDir, `locked-${id}.pdf`);
    const encryptedPath = path.join(tempDir, `encrypted-${id}.pdf`);
    const tempFiles = [inputPath, outPath, encryptedPath];

    try {
      if (!req.file || !req.body.password) {
        return res.status(400).json({ error: "Missing file or password" });
      }

      const password = req.body.password;
      fs.writeFileSync(inputPath, req.file.buffer);
      
      // Basic validation: try to open the PDF first
      try {
        // @ts-ignore
        const writer = muhammara.createWriter(outPath);
        writer.appendPDFPagesFromPDF(inputPath);
        writer.end();
      } catch (e) {
        console.error("PDF processing error:", e);
        return res.status(422).json({ error: "The uploaded file is not a valid PDF or is corrupted." });
      }
      
      // Encrypt the copied PDF
      try {
        // @ts-ignore
        muhammara.recrypt(outPath, encryptedPath, {
          userPassword: password,
          ownerPassword: password,
          userProtectionFlag: -4 // Full permissions flag
        });
      } catch (e) {
        console.error("Encryption error:", e);
        return res.status(500).json({ error: "Failed to apply password protection." });
      }

      if (!fs.existsSync(encryptedPath)) {
        throw new Error("Encrypted file not generated");
      }

      const encryptedBuffer = fs.readFileSync(encryptedPath);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="locked-${req.file.originalname}"`);
      res.send(encryptedBuffer);

    } catch (error) {
      console.error("General Lock error:", error);
      res.status(500).json({ error: "A server error occurred during PDF locking." });
    } finally {
      tempFiles.forEach(f => {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      });
    }
  });

  // API Route for Unlocking PDF
  app.post("/api/unlock-pdf", upload.single("file"), (req: any, res) => {
    const tempDir = os.tmpdir();
    const id = Date.now();
    const inputPath = path.join(tempDir, `locked-in-${id}.pdf`);
    const unlockedPath = path.join(tempDir, `unlocked-out-${id}.pdf`);
    const tempFiles = [inputPath, unlockedPath];

    try {
      if (!req.file || !req.body.password) {
        return res.status(400).json({ error: "Missing file or password" });
      }

      const password = req.body.password;
      fs.writeFileSync(inputPath, req.file.buffer);
      
      // Unlock by recrypting with empty passwords, providing the source password
      try {
        // @ts-ignore
        muhammara.recrypt(inputPath, unlockedPath, {
          password: password // Source password to open it
        });
      } catch (e: any) {
        console.error("Unlock error:", e);
        if (e.message?.toLowerCase().includes("password")) {
          return res.status(401).json({ error: "Incorrect password." });
        }
        return res.status(500).json({ error: "Failed to unlock PDF. Please check the password." });
      }

      if (!fs.existsSync(unlockedPath)) {
        throw new Error("Unlocked file not generated");
      }

      const unlockedBuffer = fs.readFileSync(unlockedPath);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="unlocked-${req.file.originalname}"`);
      res.send(unlockedBuffer);

    } catch (error) {
      console.error("General Unlock error:", error);
      res.status(500).json({ error: "A server error occurred during PDF unlocking." });
    } finally {
      tempFiles.forEach(f => {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
