const Document = require('../models/document.model');
const { generateToken } = require('../services/token.service');
const { sendEmail } = require('../services/email.service');
const { PDFService } = require('../services/pdf.service');
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const accessToken = generateToken();
    const document = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      createdBy: {
        name: req.body.creatorName,
        email: req.body.creatorEmail
      },
      accessToken
    });

    await document.save();

    // Log the document creation
    document.auditLog.push({
      action: 'DOCUMENT_CREATED',
      performedBy: {
        name: req.body.creatorName,
        email: req.body.creatorEmail
      },
      details: 'Document uploaded and created'
    });

    await document.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      accessToken,
      documentId: document._id
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Error uploading document' });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ accessToken: req.params.accessToken });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving document' });
  }
};

exports.getFile = async (req, res) => {
  try {
    const document = await Document.findOne({ accessToken: req.params.accessToken });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.join(__dirname, '../../uploads', document.filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set proper headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
};

exports.updateSignatureFields = async (req, res) => {
  try {
    const document = await Document.findOne({ accessToken: req.params.accessToken });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.signatureFields = req.body.signatureFields;
    document.status = 'in_progress';

    // Log the signature fields update
    document.auditLog.push({
      action: 'SIGNATURE_FIELDS_UPDATED',
      performedBy: {
        name: req.body.updaterName,
        email: req.body.updaterEmail
      },
      details: `Updated ${req.body.signatureFields.length} signature fields`
    });

    await document.save();

    res.json({ message: 'Signature fields updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating signature fields' });
  }
};

exports.sign = async (req, res) => {
  try {
    const document = await Document.findOne({ accessToken: req.params.accessToken });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const { fieldId, signature, name, email, comment } = req.body;

    // Find and update the signature field
    const field = document.signatureFields.id(fieldId);
    if (!field) {
      return res.status(404).json({ message: 'Signature field not found' });
    }

    field.signedBy = {
      name,
      email,
      signature,
      comment,
      timestamp: new Date()
    };

    // Check if all fields are signed
    const allSigned = document.signatureFields.every(field => field.signedBy);
    if (allSigned) {
      document.status = 'completed';
    }

    // Log the signature
    document.auditLog.push({
      action: 'SIGNATURE_ADDED',
      performedBy: {
        name,
        email
      },
      details: `Signature added for field ${fieldId}`
    });

    await document.save();

    // Send email notification
    await sendEmail({
      to: document.createdBy.email,
      subject: 'Document Signed',
      text: `${name} has signed the document "${document.originalName}"`
    });

    res.json({ message: 'Document signed successfully' });
  } catch (error) {
    console.error('Error signing document:', error);
    res.status(500).json({ message: 'Error signing document' });
  }
};

exports.downloadFinal = async (req, res) => {
  try {
    const document = await Document.findOne({ accessToken: req.params.accessToken });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.status !== 'completed') {
      return res.status(400).json({ message: 'Document is not fully signed yet' });
    }

    const filePath = path.join(__dirname, '../../uploads', document.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, `${document.originalName}_signed.pdf`);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading document' });
  }
};
