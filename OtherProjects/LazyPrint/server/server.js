require("dotenv").config();
const express = require("express");
const https = require("https");
const { PDFDocument, rgb, StandardFonts, PageSizes } = require("pdf-lib");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = "evt_3KvUmmHhGa1npZY90OJ6TwKz";
const fs = require('fs');


app.use(express.json());
app.use(fileUpload());
app.use(cors());



app.get('/', (req, res) => {
  console.log("GET request received");
  res.send('Hello HTTPS!')
})

app.post("/upload", (req, res) => {
  console.log(req.body);
  if (!req.files) {
    console.log("No files were uploaded.")
  }
  console.log("File Received");

  //Save file to the tempFiles folder
  const file = req.files.file;
  const fileName = uuid() + ".pdf";
})

app.post("/create-checkout-session", async (req, res) => {
  console.log(req.body);

  if (!req.files) {
    console.log("No files were uploaded.")
    // return error
    return res.status(400).json({
      error: "No files were uploaded."
    });
  }
  console.log("File Received");

  let productData = [];
  productData.push({
    name: "Delivery",
    description: "Bringing your things to you in the fastest time possible!!",
    amount: 150,
    currency: "eur",
    quantity: 1,
  });
  if (req.body.numPagesColored > 0) {
    productData.push({
      name: "Colored Printing service",
      description: "The best printing service in this university!",
      amount: 50,
      currency: "eur",
      quantity: req.body.numPagesColored,
    });
  }
  if (req.body.numPagesBlackWhite > 0) {
    productData.push({
      name: "Black and White Printing service",
      description: "The best printing service in this university!",
      amount: 25,
      currency: "eur",
      quantity: req.body.numPagesBlackWhite,
    });
  }

  guid = uuid();
  console.log(guid);
  
  /* Save the file to the tempFiles folder with the guid name */
  const file = req.files.file;
  const fileName = guid;
  SaveFile("tempFiles", fileName, file.data);
  /*
  fs.writeFile(`./tempFiles/${fileName}`, file.data, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Error saving file"
      });
    }
    console.log("File saved successfully!");
  });
  // */
  const session = await stripe.checkout.sessions.create({
    line_items: productData,
    mode: "payment",
    metadata: {
      order_id: guid,
    },
    success_url: `http://localhost:5500/success.html`,
    cancel_url: `http://localhost:5500/cancel.html`,
  });

  res.json({ url: session.url });
});

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (request, response) => {
    const payload = request.body;

    //if Stripe payment has been made
    if (payload.type === "checkout.session.completed") {
      console.log(JSON.stringify(payload.data.object.metadata.order_id, 0, 4));
      // Check in the tempFiles folder if the file exists
      MoveFile("tempFiles", payload.data.object.metadata.order_id, "files", payload.data.object.metadata.order_id);

      AddFrontPage(payload.data.object.metadata.order_id, "eu");
    }
    response.status(200);
  }
);

//app.listen(4242, () => console.log("Running on port 4242"));

app.listen(4040, () => console.log("Running on port 4040"));

https.createServer({
  key: fs.readFileSync('./ssl/cert.key'),
  cert: fs.readFileSync('./ssl/cert.pem')
}, app).listen(4242, () => console.log("Running on port 4242"));

/* Functions */



/* PDF Functions */
// A function to add a front page with the name of the buyer and some contact info
async function AddFrontPage(fileName, clientName) {
  const pdfData = fs.readFileSync(`./tempFiles/${fileName}.pdf`);
  const pdfDoc = await PDFDocument.load(pdfData);
  const page = pdfDoc.insertPage(index=0);

  const fontSize = 20;
  const fontColor = rgb(0, 0, 0);
  const fontStyle = "normal";
  const fontWeight = "normal";
  const fontFamily = "Helvetica";
  
  const textOptions = {
    size: fontSize,
    color: fontColor,
    fontStyle: fontStyle,
    fontWeight: fontWeight,
    fontFamily: fontFamily,
  }

  page.drawText("Hello!", {
    x: 100,
    y: 700,
    ...textOptions,
  });

  textOptions.fontSize = 40;

  page.drawText("Thanks for using LazyPrint!", {
    x: 100,
    y: 600,
    ...textOptions,
  });

  page.drawText(clientName, {
    x: 100,
    y: 500,
    ...textOptions,
  });

  const pdfBytes = await pdfDoc.save();
  SaveFile("files", fileName, pdfBytes);
}






/* Utility Functions */

async function SaveFile(directory, fileName, file) {
  fs.writeFile(`./${directory}/${fileName}.pdf`, file, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Error saving file"
      });
    }
    console.log("File saved successfully!");
  });
}

async function DeleteFile(directory, fileName) {
  fs.unlink(`./${directory}/${fileName}.pdf`, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("File deleted successfully!");
  });
}

async function MoveFile(fromDirectory, fromFileName, toDirectory, toFileName) {
  fs.rename(`./${fromDirectory}/${fromFileName}.pdf`, `./${toDirectory}/${toFileName}.pdf`, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("File moved successfully!");
  });
}