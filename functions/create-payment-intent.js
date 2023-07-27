const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://voice-transformation.webflow.io',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  } else if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { amount } = JSON.parse(event.body);
  const paymentIntent = await stripe.paymentIntents.create({
    amount, 
    currency: 'usd'
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://voice-transformation.webflow.io',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
  };
};
