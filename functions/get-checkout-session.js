const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  if (event.httpMethod === 'POST') {
    const { sessionId } = JSON.parse(event.body);

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return {
        statusCode: 200,
        body: JSON.stringify(session),
      };
    } catch (err) {
      console.log(err);
      return { statusCode: 500, body: 'An error occurred with the Stripe API call.' };
    }
  } else {
    return { statusCode: 405, body: 'Method not allowed' };
  }
};
