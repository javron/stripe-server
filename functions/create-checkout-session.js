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

  const { priceId } = JSON.parse(event.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.WEBFLOW_PAGE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.WEBFLOW_PAGE_URL}/canceled.html`,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://voice-transformation.webflow.io',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ id: session.id }),
  };
};
