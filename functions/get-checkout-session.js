const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { sessionId } = JSON.parse(event.body);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://voice-transformation.webflow.io',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(session),
  };
};
