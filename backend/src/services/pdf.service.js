const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFService {
  async generateFinalPDF(document) {
    try {
      // Read the original PDF
      const originalPdfPath = path.join(__dirname, '../../uploads', document.filename);
      const originalPdfBytes = await fs.readFile(originalPdfPath);
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      
      // Add signatures to the document
      for (const field of document.signatureFields) {
        if (field.signedBy) {
          const page = pdfDoc.getPages()[field.page];
          
          // If signature is an image (base64)
          if (field.signedBy.signature.startsWith('data:image')) {
            const base64Data = field.signedBy.signature.split(',')[1];
            const imageBytes = Buffer.from(base64Data, 'base64');
            
            let image;
            if (field.signedBy.signature.includes('image/png')) {
              image = await pdfDoc.embedPng(imageBytes);
            } else {
              image = await pdfDoc.embedJpg(imageBytes);
            }
            
            page.drawImage(image, {
              x: field.x,
              y: page.getHeight() - field.y - field.height,
              width: field.width,
              height: field.height
            });
          } else {
            // If signature is text
            page.drawText(field.signedBy.signature, {
              x: field.x,
              y: page.getHeight() - field.y - field.height,
              size: 12,
              color: rgb(0, 0, 0)
            });
          }
          
          // Add signature metadata
          page.drawText(`Signed by: ${field.signedBy.name}`, {
            x: field.x,
            y: page.getHeight() - field.y - field.height - 15,
            size: 8,
            color: rgb(0.5, 0.5, 0.5)
          });
          
          page.drawText(`Date: ${new Date(field.signedBy.timestamp).toLocaleString()}`, {
            x: field.x,
            y: page.getHeight() - field.y - field.height - 25,
            size: 8,
            color: rgb(0.5, 0.5, 0.5)
          });
        }
      }
      
      // Generate audit log page
      const auditLogPage = pdfDoc.addPage();
      let yPosition = auditLogPage.getHeight() - 50;
      
      // Add audit log title
      auditLogPage.drawText('Document Audit Log', {
        x: 50,
        y: yPosition,
        size: 16,
        color: rgb(0, 0, 0)
      });
      
      yPosition -= 30;
      
      // Add each audit log entry
      for (const entry of document.auditLog) {
        auditLogPage.drawText(`${new Date(entry.timestamp).toLocaleString()} - ${entry.action}`, {
          x: 50,
          y: yPosition,
          size: 10,
          color: rgb(0, 0, 0)
        });
        
        yPosition -= 15;
        
        auditLogPage.drawText(`By: ${entry.performedBy.name} (${entry.performedBy.email})`, {
          x: 70,
          y: yPosition,
          size: 10,
          color: rgb(0.3, 0.3, 0.3)
        });
        
        yPosition -= 15;
        
        if (entry.details) {
          auditLogPage.drawText(`Details: ${entry.details}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0.3, 0.3, 0.3)
          });
          
          yPosition -= 20;
        }
      }
      
      // Save the modified PDF
      const finalPdfBytes = await pdfDoc.save();
      const finalPdfPath = path.join(__dirname, '../../uploads', `${document.filename}-signed.pdf`);
      await fs.writeFile(finalPdfPath, finalPdfBytes);
      
      return finalPdfPath;
    } catch (error) {
      console.error('Error generating final PDF:', error);
      throw error;
    }
  }
}

module.exports = { PDFService };
