const { Purchase, Orderdetail, Product } = require("../db");

// actualiza la cantidad de productos después de que una compra tenga éxito
const updateProductQuantities = async (purchaseId) => {
  try {
    // Obtengo la compra correspondiente al ID
    const purchase = await Purchase.findByPk(purchaseId);
    console.log("en stock es el purchaseId: ", purchaseId);
    // Verifico si la compra está en estado "success"
    if (purchase && purchase.purchase_status === "success") {
      // Obtengo los detalles de la orden asociados con esta compra
      const orderDetails = await Orderdetail.findAll({
        where: { purchaseId },
      });
      console.log("estas son las ordenes :", orderDetails);
      // Actualizo la cantidad de productos en la base de datos
      for (const orderDetail of orderDetails) {
        const product = await Product.findByPk(orderDetail.productId);

        if (product) {
          // Reduzco la cantidad de productos en función de los detalles de la orden
          const newQuantity = product.quantity - orderDetail.quantity;
          console.log(" nueva cantidad :", newQuantity);
          // Confirmo que la cantidad no sea negativa
          if (newQuantity >= 0) {
            await product.update({ quantity: newQuantity });
          } else {
            // Si la cantidad se vuelve negativa
            console.error(`Cantidad insuficiente de ${product.name}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(
      "Error al actualizar las cantidades de los productos:",
      error
    );
  }
};

module.exports = {
  updateProductQuantities,
};
