export const parser = () => {
  // if (client && order && manager && amount) {
  //   const orderParsed = getOrderParts(String(order)) || {
  //     type: String(order),
  //   };
  //   const amountNormalized =
  //     typeof amount === 'number' ? amount : parseInt(amount, 10);
  //
  //   if (!result.hasOwnProperty(client)) {
  //     result[client] = {
  //       manager: String(manager),
  //       totalAmount: amountNormalized,
  //       orders: [
  //         {
  //           ...orderParsed,
  //           amount: amountNormalized,
  //           ...(discount ? { discount: +discount } : {}),
  //         },
  //       ],
  //     };
  //   } else {
  //     result[client].orders.push({
  //       ...orderParsed,
  //       amount: amountNormalized,
  //       ...(discount ? { discount: +discount } : {}),
  //     });
  //     result[client].totalAmount += amountNormalized;
  //   }
  // }
};
