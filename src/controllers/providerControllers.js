const { Provider, User, Rating } = require("../db.js");
const { Op } = require("sequelize");

// Obtener todos los proveedores
// Obtener todos los proveedores en orden aleatorio
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.findAll({
      include: [
        {
          model: Rating,
          as: "ratings",
        },
      ],
    });

    // Mezclar aleatoriamente los proveedores
    const shuffledProviders = providers.sort(() => Math.random() - 0.5);

    res.json(shuffledProviders);
  } catch (error) {
    console.error("Error al obtener proveedores aleatorios:", error);
    res.status(500).json({ error: error.message });
  }
};

const trackProviderView = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findByPk(id, {
      attributes: ["id", "views"],
    });

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    await provider.increment("views", { by: 1 });
    await provider.reload({ attributes: ["id", "views"] });

    return res.status(200).json({
      message: "Visita registrada",
      id: provider.id,
      views: provider.views,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al registrar la visita" });
  }
};

// Obtener proveedor por ID
const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findByPk(id, {
      include: [
        {
          model: Rating,
          as: "ratings",
        },
      ],
    });
    if (!provider) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo proveedor
const createProvider = async (req, res) => {
  try {
    const {
      company,
      description,
      longdescription,
      location,
      plan,
      categories,
      images,
      email,
      phone,
      fijo,
      website,
      contactName,
      yearsInBusiness,
      userId,
      products, // <--- NUEVO: array de productos
    } = req.body;

    // Verificar si ya existe un proveedor con ese email
    const existingProvider = await Provider.findOne({
      where: { email },
    });

    if (existingProvider) {
      return res.status(400).json({
        error: "Ya existe un proveedor registrado con este email",
      });
    }

    const provider = await Provider.create({
      company,
      description,
      longdescription,
      location,
      plan: plan || "free",
      categories: categories || "",
      images: images || [],
      products: products || [], // <--- NUEVO: guardar productos
      email,
      phone,
      fijo,
      website,
      status: "pending",
      verified: false,
    });

    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({
          provider_id: provider.id,
          role: "provider", // Cambia el rol a provider
        });
      }
    }

    res.status(201).json(provider);
  } catch (error) {
    console.error("Error creando proveedor:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar proveedor
const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findByPk(id);

    if (!provider) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    await provider.update(req.body);
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar proveedor
const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findByPk(id);

    if (!provider) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    // 1. Desvincular usuarios asociados
    await User.update({ provider_id: null }, { where: { provider_id: id } });

    // 2. Eliminar el proveedor
    await provider.destroy();

    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener proveedores por plan
const getProvidersByPlan = async (req, res) => {
  try {
    const { plan } = req.params;
    const providers = await Provider.findAll({
      where: {
        plan,
        status: "active",
      },
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener proveedores por categoría
const getProvidersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const providers = await Provider.findAll({
      where: {
        categories: { [Op.contains]: [category] },
        status: "active",
      },
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  getProvidersByPlan,
  getProvidersByCategory,
  trackProviderView,
};
