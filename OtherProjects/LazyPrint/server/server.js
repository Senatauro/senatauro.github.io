require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = "evt_3KvUmmHhGa1npZY90OJ6TwKz";

/* Req received from client
let lazyPrintInfo = {
  email: "",
  pickup: "",
  base64: "",
  numPagesBlackWhite: 0,
  numPagesColored: 0,
};
*/

app.use(express.json());

app.use(cors());

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
  console.log(req.body);

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
  const session = await stripe.checkout.sessions.create({
    line_items: productData,
    mode: "payment",
    metadata: {
      order_id: guid,
    },
    success_url: `http://127.0.0.1:5500/success.html`,
    cancel_url: `http://127.0.0.1:5500/cancel.html`,
  });

  res.json({ url: session.url });
});

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (request, response) => {
    const payload = request.body;

    //console.log("Got payload: " + JSON.stringify(payload,0,4));

    response.status(200);
  }
);

app.listen(4242, () => console.log("Running on port 4242"));