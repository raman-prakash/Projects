"use strict";

/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */

const stripe = require("stripe")(
  "sk_test_51NBjM0LFcZkuLeSeMzDj21mGY4qVnymQ8nKNetzZrRVUcr8DxEGSBECIxaU4fpLZ36lpHDMtzgRRHQ1kByqMxiPG00Cr50eDsT"
);

module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    console.log(ctx);
    console.log(ctx.request.body);
    const { address, amount, dishes, token, city, state, user } = JSON.parse(
      ctx.request.body
    );

    const stripeAmount = Math.floor(amount * 100);
    // charge on stripe
    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: "usd",
      description: `Order ${new Date()}`,
      source: token,
    });

    // Register the order in the database
    const order = await strapi.services.orders.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      dishes,
      city,
      state,
    });

    return order;
  },
};
