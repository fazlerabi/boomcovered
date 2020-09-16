const PDFDocument = require('pdfkit');
const utils = require('../utils/utils');
const fs = require('fs');

class Pdf {
  async generateBindPDF(params) {
    const {
      address, city, county, state, zip_code, lowPrice, highPrice, pricing, sqft, year_built,
      estimate, chartImgStr, hippoPrice,flood_zone,uniqueId
    } = params;
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({size: [702, 893]});
      const filename = encodeURIComponent(uniqueId) + '.pdf';
      let firstImageUrl = './src/assets/images/pdf-3.jpg';
      let secondImageUrl = './src/assets/images/pdf-4.jpg';
      doc.image(firstImageUrl, 0, 0, {width: 702, height: 893});
//      doc.image(Buffer.from(chartImgStr.replace('data:image/png;base64,', ''), 'base64'), 530, 745, {
//        width: 68,
//        height: 72
//      });
      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(22).fillColor('#acacaf').text(address, 470, 30);
      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(12).fillColor('#ef3624').text(address, 153, 115);
      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(11).fillColor('#ef3624').text(city + ' , ' + state + ', ' + zip_code, 265, 116);
//      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(7).fillColor('#acacaf').text(sqft, 140, 279);
//      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(7).fillColor('#acacaf').text(year_built, 140, 293);
//      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(7).fillColor('#acacaf').text(estimate, 140, 307);
//      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(7).fillColor('#acacaf').text(flood_zone, 140, 321);
      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(40).fillColor('#ef3624').text('$' + pricing, 260, 278);
      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(17).fillColor('#acacaf').text('$' + lowPrice + ' - ' + '$' + highPrice, 430, 247);
      doc.font('./src/assets/fonts/Roboto/Roboto-Bold.ttf').fontSize(11).fillColor('#1cb777').text('$' + hippoPrice, 346, 486, {lineBreak: false});
      doc.addPage();
      doc.image(secondImageUrl, 0, 0, {width: 702, height: 893});

      let dir = './pdfs';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      let listener = doc.pipe(fs.createWriteStream('./pdfs/' + filename));
      doc.end();
      listener.on('finish', function () {
        resolve({result: 'success'});
      });
      listener.on('error', function () {
        reject({result: 'error'});
      });
    });
  }
}

module.exports = Pdf;
