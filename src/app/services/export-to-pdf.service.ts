// import { Injectable } from '@angular/core';
// import { HTML2PDFOptions, html2pdf } from  'html2pdf-ts';

// @Injectable({
//   providedIn: 'root'
// })
// export class ExportToPdfService {

//   constructor() { }

//   exportToPDF(content: string, filename: string): void {
//     const element = document.createElement('div');
//     element.innerHTML = content;

//     const opt = {
//       margin: 10,
//       filename: filename,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
//     };

//     const  example = async () => {
//       const  html = await  fs.readFile('../', 'utf-8');
//       const  options: HTML2PDFOptions = {
//         format:  'A4',
//         filePath:  './example/lotr.pdf',
//         landscape:  false,
//         resolution: {
//           height:  1920,
//           width:  1080,
//         },
//       };
    
//       await  html2pdf.createPDF(html, options);
    
//       console.log('PDF Generated...');
//     };
    
//   }
// }
