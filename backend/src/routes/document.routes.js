const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/document.controller');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Upload a new document
 *     description: Upload a PDF document for digital signing
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to upload
 *               creatorName:
 *                 type: string
 *                 description: Name of the document creator
 *               creatorEmail:
 *                 type: string
 *                 format: email
 *                 description: Email of the document creator
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 documentId:
 *                   type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/upload', upload.single('file'), documentController.uploadDocument);

/**
 * @swagger
 * /documents/{accessToken}:
 *   get:
 *     summary: Get document information
 *     description: Retrieve information about a document using its access token
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Document access token
 *     responses:
 *       200:
 *         description: Document information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:accessToken', documentController.getDocument);

/**
 * @swagger
 * /documents/{accessToken}/file:
 *   get:
 *     summary: Get document file
 *     description: Download the PDF file of a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Document access token
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:accessToken/file', documentController.getFile);

/**
 * @swagger
 * /documents/{accessToken}/fields:
 *   put:
 *     summary: Update signature fields
 *     description: Update or add signature fields to a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Document access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               signatureFields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     x:
 *                       type: number
 *                     y:
 *                       type: number
 *                     width:
 *                       type: number
 *                     height:
 *                       type: number
 *                     page:
 *                       type: number
 *               updaterName:
 *                 type: string
 *               updaterEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signature fields updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:accessToken/fields', documentController.updateSignatureFields);

/**
 * @swagger
 * /documents/{accessToken}/sign:
 *   post:
 *     summary: Sign a document
 *     description: Add a signature to a specific field in the document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Document access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fieldId:
 *                 type: string
 *               signature:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document signed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Document or signature field not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:accessToken/sign', documentController.sign);

/**
 * @swagger
 * /documents/{accessToken}/download:
 *   get:
 *     summary: Download final document
 *     description: Download the final signed document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Document access token
 *     responses:
 *       200:
 *         description: Final signed PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Document not fully signed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:accessToken/download', documentController.downloadFinal);

module.exports = router;
