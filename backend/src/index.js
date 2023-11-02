const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const stripe = require("stripe")(
  "sk_test_51O6oJEHLuL68sllNaq01XGe2eMkywXQ70iYSyGSYdUfktd6VCPcYbRsOdd6cI4b9v2rRObPK3wHvy4m8sJFP4F3b00o7T6rhpd"
);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
app.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2023-10-16" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "usd",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51O6oJEHLuL68sllN6hY4XNLh5gmMSrZv3umLJtzKJLX2TUj7BcGLObQciH5EZVHe4jE7TOSVKM39mfkRsBJg4Pln00qoWK6zkh",
  });
});

app.post("/create-payment-intent", async (req, res) => {
  // Set your secret key. Remember to switch to your live secret key in production.
  // See your keys here: https://dashboard.stripe.com/apikeys
  const stripe = require("stripe")(
    "sk_test_51O6oJEHLuL68sllNaq01XGe2eMkywXQ70iYSyGSYdUfktd6VCPcYbRsOdd6cI4b9v2rRObPK3wHvy4m8sJFP4F3b00o7T6rhpd"
  );

  const paymentIntent = await stripe.paymentIntents.create({
    payment_method_types: ["card"],
    amount: 1099,
    currency: "jpy",
  });
  const clientSecret = paymentIntent.client_secret;
  // Pass the client secret to the client

  res.json({
    clientSecret: clientSecret,
  });
});

app.listen(PORT, () => {
  console.log("API is listening on port", PORT);
});
