var fs = require("fs");
var path = require('path');
var PDFParser = require("./node_modules/pdf2json/PDFParser");

var pdfParser = new PDFParser(this,1);
var destinationPath = './backend/books';
var fileName = process.argv[2];
var dirName = fileName.substring(0, fileName.lastIndexOf('.'));
var txtFileName;

pdfParser.on("pdfParser_dataError", errData => {
    console.log(errData.parserError);
});
pdfParser.on("pdfParser_dataReady", pdfData => {

    var dir = path.join(__dirname, destinationPath, dirName);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0744);
    }
     
    for (page in pdfParser.data.Pages) {

        var result = '';
        y = 0;
        
        for (textBlock in pdfParser.data.Pages[page].Texts) {
            
            for(r in pdfParser.data.Pages[page].Texts[textBlock].R) {
                if (y < pdfParser.data.Pages[page].Texts[textBlock].y) {
                        result += '<br>';
                        y = pdfParser.data.Pages[page].Texts[textBlock].y;
                }
                result += decodeURIComponent(pdfParser.data.Pages[page].Texts[textBlock].R[r].T);
                
            }
        }

        txtFileName = (parseInt(page) + 1) + '.txt';
        
        fs.writeFile(path.join(dir, txtFileName), result, 'utf8', (err) => {
            if (err) throw err;
        });
        
    };

});

pdfParser.loadPDF(path.join(__dirname, fileName));