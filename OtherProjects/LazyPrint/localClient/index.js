const { print, getPrinters } = require("pdf-to-printer");

const options = {
    printer: "Microsoft XPS Document Writer",
}
print("t2.pdf", options).then(console.log);
//getPrinters().then(console.log);
