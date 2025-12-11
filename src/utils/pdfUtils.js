import { PDFDocument } from 'pdf-lib';

/**
 * Combina múltiples archivos PDF en uno solo
 * @param {File[]} pdfFiles - Array de archivos PDF
 * @returns {Promise<Blob>} Blob del PDF combinado
 */
export async function mergePDFs(pdfFiles) {
    const mergedPdf = await PDFDocument.create();

    for (const file of pdfFiles) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
        } catch (error) {
            console.warn(`Error procesando PDF ${file.name}:`, error);
        }
    }

    const mergedBytes = await mergedPdf.save();
    return new Blob([mergedBytes], { type: 'application/pdf' });
}

/**
 * Descarga un Blob como archivo
 * @param {Blob} blob - Blob a descargar
 * @param {string} filename - Nombre del archivo
 */
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Obtiene información de un PDF
 * @param {ArrayBuffer} arrayBuffer - Buffer del PDF
 * @returns {Promise<Object>} Información del PDF
 */
export async function getPdfInfo(arrayBuffer) {
    try {
        const pdf = await PDFDocument.load(arrayBuffer);
        return {
            pageCount: pdf.getPageCount(),
            title: pdf.getTitle() || null,
            author: pdf.getAuthor() || null
        };
    } catch {
        return { pageCount: 0, title: null, author: null };
    }
}
