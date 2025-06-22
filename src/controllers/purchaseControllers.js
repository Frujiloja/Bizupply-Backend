const { Purchase, User, Orderdetail, Product, Payment } = require("../db");

//para crear la orden hay que obtener el id de detaiOrders, sus precios y cantides. Para luego relacionar las DetailOrders con su respectiva order y obtener el totalPrice.
const createPurchase = async (req, res, next) => {
    const { orderIds, userId } = req.body;

    console.log("este es el body:", req.body)
    console.log(orderIds)
    try {

        // Verificar si ya existe una orden para los detalles proporcionados y el usuario
        const existingPurchase = await Purchase.findOne({
            where: {
                userId: userId, // Filtrar por el ID del usuario
            },
            include: [
                {
                    model: Orderdetail,
                    where: {
                        id: orderIds, // Filtrar por los IDs de los detalles
                    },
                },
            ],
        });

        if (existingPurchase) {
            return res.status(409).json({
                message: "There is a purchase created for all the orders_id given",
            });
        }
        // Obtener los orders correspondientes a los IDs indicados
        const ordersDetails = await Orderdetail.findAll({
            where: {
                id: orderIds, // Filtrar por los IDs indicados
                userId: userId, // Filtrar por el ID del usuario
            },
            include: [Product], // Incluir el modelo Product si es necesario
        });

        if (ordersDetails.length === 0) {
            return res.status(404).json({
                message: "IDs and User requested are not found",
            });
        }

        // Calcular el precio total de la compra sumando las multiplicaciones de cantidad y precio de las ordenes
        let totalPurchasePrice = 0;
        ordersDetails.forEach((orderdetail) => {
            const totalPricePerItem = orderdetail.price * orderdetail.quantity;
            totalPurchasePrice += totalPricePerItem;
        });

        // Crear la nueva compra
        const newPurchase = await Purchase.create({
            totalprice: totalPurchasePrice,
            purchase_status: "in process",
            userId: userId,
            // Asignar el ID del usuario a la compra
        });
        // Asignar el ID del usuario a la orden
        await newPurchase.setUser(userId);
        await Promise.all(
            ordersDetails.map((orderdetail) => orderdetail.setPurchase(newPurchase))
        );
        // Agregar el ID de la compra al usuario
        const user = await User.findByPk(userId);
        if (user) {
            await user.addPurchase(newPurchase);
        }
        return res.status(200).json({ message: "Purchase created", purchase: newPurchase });
    } catch (error) {
        console.error("Purchase was not created", error);
        return res.status(500).json({ message: "Purchase was not created" });
    }
};

const getPurchases = async (req, res) => {

  const {condition} = req.query;
  
    try {
        if(condition === "ventas"){
            const response = await Purchase.findAll({include: [
                {model:User,},
                {model: Payment},
                {model: Orderdetail, include:[Product]},
            ]});
            return res.status(200).json(response);
        }

        const response = await User.findAll({ include: [Purchase] });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    };
};

const dataStats = async(req, res) => {
    try {
        const purchasess = await Purchase.findAll({
            include: [
                {
                    model: User, // Incluir los datos del usuario relacionado
                },
                {
                    model: Orderdetail, // Incluir los detalles de la orden relacionados
                    include: [Product], // Incluir los productos de cada detalle
                },
            ],
        });
        
        return res.status(200).json({purchasess}); 
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}


module.exports = { createPurchase, getPurchases , dataStats };
