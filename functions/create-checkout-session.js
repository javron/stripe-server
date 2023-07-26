const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  if (event.httpMethod === 'POST') {
    const { priceId } = JSON.parse(event.body);

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.WEBFLOW_PAGE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.WEBFLOW_PAGE_URL}/canceled`,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ id: session.id }),
      };
    } catch (err) {
      console.log(err);
      return { statusCode: 500, body: 'An error occurred with the Stripe API call.' };
    }
  } else {
    return { statusCode: 405, body: 'Method not allowed' };
  }
};
