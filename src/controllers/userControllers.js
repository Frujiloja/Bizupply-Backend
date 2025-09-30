const { User, Provider, Rating } = require("../db.js");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const getSavedProviders = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const saved = user.saved ? user.saved.split(",").map(Number) : [];

    if (saved.length === 0) {
      return res.json([]);
    }

    const providers = await Provider.findAll({
      where: { id: { [Op.in]: saved } },
    });

    res.json(providers);
  } catch (error) {
    console.error("❌ getSavedProviders error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
{
  /*

const addSavedProvider = async (req, res) => {
  try {
    const { id } = req.params; // user id
    const { providerId } = req.body;
    if (!providerId) return res.status(400).json({ message: "providerId requerido" });

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const current = Array.isArray(user.saved_provider_ids) ? user.saved_provider_ids : [];
    if (!current.includes(providerId)) {
      current.push(providerId);
      await user.update({ saved_provider_ids: current });
    }
    return res.status(201).json({ message: "Guardado" });
  } catch (error) {
    console.error("addSaveProvider error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

*/
}

const addSavedProvider = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario
    let { providerId } = req.body;

    console.log(
      `ℹ️ Received request to add provider ${providerId} for user ${id}`
    );

    if (!providerId) {
      console.log("❌ providerId is missing");
      return res.status(400).json({ message: "providerId requerido" });
    }

    providerId = Number(providerId);
    if (isNaN(providerId)) {
      console.log("❌ providerId is invalid");
      return res.status(400).json({ message: "providerId inválido" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      console.log(`❌ User ${id} not found`);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("ℹ️ Current saved:", user.saved);

    // Convertir la cadena a un array
    const current = user.saved ? user.saved.split(",").map(Number) : [];

    if (!current.includes(providerId)) {
      current.push(providerId);
      console.log("🔄 Updating saved:", current);

      // Convertir el array de vuelta a una cadena
      await user.update({ saved: current.join(",") });
      console.log("✅ Saved updated successfully");
    } else {
      console.log(`⚠️ Provider ${providerId} is already in saved`);
    }

    return res.status(201).json({ message: "Guardado" });
  } catch (error) {
    console.error("❌ addSavedProvider error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

{
  /*
const removeSavedProvider = async (req, res) => {
  try {
    const { id, providerId } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const current = Array.isArray(user.saved_provider_ids) ? user.saved_provider_ids : [];
    const next = current.filter((pid) => Number(pid) !== Number(providerId));
    await user.update({ saved_provider_ids: next });

    return res.json({ message: "Eliminado" });
  } catch (error) {
    console.error("removeSavedProvider error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
*/
}

const removeSavedProvider = async (req, res) => {
  try {
    const { id, providerId } = req.params;

    console.log(
      `ℹ️ Received request to remove provider ${providerId} for user ${id}`
    );

    const user = await User.findByPk(id);
    if (!user) {
      console.log(`❌ User ${id} not found`);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("ℹ️ Current saved:", user.saved);

    // Convertir la cadena a un array
    const current = user.saved ? user.saved.split(",").map(Number) : [];

    const next = current.filter((pid) => pid !== Number(providerId));

    if (next.length === current.length) {
      console.log("⚠️ Provider not found in saved");
      return res
        .status(404)
        .json({ message: "Proveedor no encontrado en guardados" });
    }

    // Convertir el array de vuelta a una cadena
    await user.update({ saved: next.join(",") });
    console.log("✅ Saved updated successfully");

    return res.json({ message: "Eliminado" });
  } catch (error) {
    console.error("❌ removeSavedProvider error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { status: "true" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Falta el email" });
  }

  try {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const createUser = async (req, res, next) => {
  console.log(
    "///////////////////////////////Create User///////////////////////////"
  );
  console.log("Request body:", req.body);

  const {
    first_name,
    last_name,
    email,
    address,
    phone,
    role,
    profile_image,
    auth0_id,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    first_name === "" ||
    last_name === "" ||
    email === ""
  )
    return res.status(400).send({ message: "fields can not be empty" });

    try {
      // Crear el nuevo usuario
      const userCreated = await User.create({
        first_name,
        last_name,
        email,
        address: address || "",
        phone: phone || "",
        role: role || "client",
        profile_image: profile_image || null,
        auth0_id: auth0_id,
        provider_id: null,
        // saved_provider_ids: []  // <-- remove this line so it’s not sent
        saved: "[]",
      });

    console.log("User creado correctamente:", userCreated);

    res.status(200).json({
      message: "User created",
      userID: userCreated.id,
    });
  } catch (error) {
    console.log("Error creating user:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, company_name } =
      req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      company_name,
    });

    // Si es proveedor, crear el perfil de proveedor
    if (role === "provider") {
      const provider = await Provider.create({
        company: company_name,
        description: "",
        location: "",
        plan: "free",
        categories: [],
        images: [],
        email,
        status: "pending",
      });

      await user.update({ provider_id: provider.id });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        provider_id: user.provider_id,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({
      where: { email },
      include: [{ model: Provider, as: "provider" }],
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        provider_id: user.provider_id,
        provider: user.provider,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener perfil de usuario
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [{ model: Provider, as: "provider" }],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      company_name: user.company_name,
      provider: user.provider,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar perfil de usuario
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido en params:", id);
    const user = await User.findByPk(id);
    console.log("Resultado de findByPk:", user);

    if (!user) {
      console.log("No se encontró el usuario con ese ID");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("Body recibido para update:", req.body);
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    console.error("Error en updateUserProfile:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserByEmail,
  getAllUsers,
  getSavedProviders,
  addSavedProvider,
  removeSavedProvider,
};
