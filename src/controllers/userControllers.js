const { User, Provider, Rating } = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const getSavedProviders = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const ids = user.saved_provider_ids || [];
    if (!ids.length) return res.json([]);

    const providers = await Provider.findAll({ where: { id: ids } });
    res.json(providers);
  } catch (error) {
    console.error("getSavedProviders error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

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
    console.error("addSavedProvider error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

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
      where: { email: email.toLowerCase() }
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
  // // // 1. // // //
  const {
    first_name,
    last_name,
    gender,
    email,
    address,
    phone,
    role_id,
    //user_password,
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
      gender,
      email,
      address,
      phone,
      role_id,
      //user_password,
      auth0_id: req.body.auth0_id,
    });

    console.log("User creado correctamente:", userCreated);

    res.status(200).json({
      message: "User created",
      userID: userCreated.id,
    });
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({ message: error });
  }
};

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, company_name } = req.body;

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
      company_name
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
        status: "pending"
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
        provider_id: user.provider_id
      },
      token
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
      include: [{ model: Provider, as: 'provider' }]
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
        provider: user.provider
      },
      token
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
      include: [{ model: Provider, as: 'provider' }]
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
      provider: user.provider
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