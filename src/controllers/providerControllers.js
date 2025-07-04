const { Provider, User, Rating } = require("../db.js");
const { Op } = require("sequelize");

// Obtener todos los proveedores
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.findAll({
      where: { status: "active" },
      include: [
        {
          model: Rating,
          as: "ratings",
        },
      ],
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      location,
      plan,
      categories,
      images,
      email,
      phone,
      website,
      contactName,
      yearsInBusiness
    } = req.body;

    // Verificar si ya existe un proveedor con ese email
    const existingProvider = await Provider.findOne({
      where: { email }
    });

    if (existingProvider) {
      return res.status(400).json({ 
        error: "Ya existe un proveedor registrado con este email" 
      });
    }

    const provider = await Provider.create({
      company,
      description,
      location,
      plan: plan || "free",
      categories: categories || "",
      images: images || [],
      email,
      phone,
      website,
      status: "pending",
      verified: false
    });

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
        status: "active"
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
        status: "active"
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
};