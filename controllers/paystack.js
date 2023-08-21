const https = require("https");
const initializePayment = (req, res) => {
  const { email, amount } = req.body;

  const params = JSON.stringify({
    email,
    amount,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: "Bearer sk_test_76accbb7a3f9bbdf44f8d01eddd8dd1fde0c0b3a",
      "Content-Type": "application/json",
    },
  };

  const reqpaystack = https
    .request(options, (respaystack) => {
      let data = "";

      respaystack.on("data", (chunk) => {
        data += chunk;
      });

      respaystack.on("end", () => {
        res.send(data);
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  reqpaystack.write(params);
  reqpaystack.end();
};

module.exports = { initializePayment };
