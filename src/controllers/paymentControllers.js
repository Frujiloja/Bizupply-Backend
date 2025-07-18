const { Payment, User, Provider } = require("../db");
require("dotenv").config();

const mercadopago = require("mercadopago");

// Configurar MercadoPago con las credenciales del .env
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Crear pago para planes de proveedores
const createPlanPayment = async (req, res) => {
  const { providerId, planType, userId } = req.body;
  
  try {
    console.log("Datos recibidos:", { providerId, planType, userId });
    
    // Verificar si el proveedor existe
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      console.log("Proveedor no encontrado:", providerId);
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    // Definir precios de planes
    const planPrices = {
      'free': 0,
      'plus': 29.99,
      'pro': 59.99,
      'max': 99.99
    };

    const planPrice = planPrices[planType];
    
    if (planPrice === 0) {
      // Plan gratuito - actualizar directamente
      await provider.update({ plan: planType });
      return res.status(200).json({ 
        message: "Plan gratuito activado", 
        plan: planType 
      });
    }

    // Verificar que tenemos las variables de entorno necesarias
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error("MERCADOPAGO_ACCESS_TOKEN no configurado");
      return res.status(500).json({ message: "Error de configuración de MercadoPago" });
    }

    const preference = {
      items: [
        {
          title: `Plan BizSupply ${planType.toUpperCase()} - ${provider.company}`,
          unit_price: planPrice,
          quantity: 1,
          currency_id: "ARS"
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/pending`,
      },
      auto_return: "approved",
      binary_mode: true,
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/notification`,
      external_reference: `${providerId}-${planType}-${userId || 'anonymous'}`,
    };

    console.log("Creando preferencia en MercadoPago:", preference);

    // Crear preferencia en MercadoPago
    const response = await mercadopago.preferences.create(preference);
    const { id, init_point } = response.body;

    console.log("Preferencia creada:", { id, init_point });

    // Crear registro de pago en la base de datos
    const newPayment = await Payment.create({
      provider_id: providerId,
      user_id: userId || 1, // Usar 1 como default si no hay userId
      plan_type: planType,
      amount: planPrice,
      mp_preference_id: id,
      status: 'pending',
      payment_date: new Date(),
    });

    console.log("Pago creado en BD:", newPayment.id);

    return res.status(200).json({ 
      message: "Pago creado", 
      init_point,
      payment_id: newPayment.id 
    });
  } catch (error) {
    console.error("Error creando pago:", error);
    return res.status(500).json({ 
      message: "Error creando pago",
      error: error.message 
    });
  }
};

// Notificación de pago de MercadoPago
const paymentNotification = async (req, res) => {
  const { data } = req.query;

  try {
    console.log("Notificación recibida:", req.query);
    
    if (req.query.type === "payment") {
      const paymentData = await mercadopago.payment.findById(data.id);
      
      console.log("Estado del pago:", paymentData.body.status);
      
      if (paymentData.body.status === "approved") {
        // Buscar el pago en nuestra base de datos
        const payment = await Payment.findOne({
          where: { mp_preference_id: paymentData.body.preference_id }
        });

        if (payment) {
          // Actualizar estado del pago
          await payment.update({
            status: 'approved',
            mp_payment_id: paymentData.body.id,
            approved_date: new Date()
          });

          // Actualizar plan del proveedor
          await Provider.update(
            { plan: payment.plan_type },
            { where: { id: payment.provider_id } }
          );

          console.log("Pago aprobado y proveedor actualizado");
        }
      } else if (paymentData.body.status === "rejected") {
        // Actualizar pago como rechazado
        const payment = await Payment.findOne({
          where: { mp_preference_id: paymentData.body.preference_id }
        });

        if (payment) {
          await payment.update({
            status: 'rejected',
            mp_payment_id: paymentData.body.id
          });
        }
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en notificación:", error);
    res.sendStatus(500);
  }
};

// Obtener todos los pagos
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: Provider, as: 'provider' },
        { model: User, as: 'user' }
      ],
      order: [['payment_date', 'DESC']]
    });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pagos de un proveedor
const getProviderPayments = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const payments = await Payment.findAll({
      where: { provider_id: providerId },
      include: [{ model: User, as: 'user' }],
      order: [['payment_date', 'DESC']]
    });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPlanPayment,
  paymentNotification,
  getAllPayments,
  getProviderPayments,
};