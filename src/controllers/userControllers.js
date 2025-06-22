const { User, Provider } = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};