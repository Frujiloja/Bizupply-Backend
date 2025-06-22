const { Rating, User, Provider } = require("../db.js");

// Crear rating
const createRating = async (req, res) => {
  try {
    const { user_id, provider_id, rating, comment } = req.body;

    // Verificar si ya existe un rating del usuario para este proveedor
    const existingRating = await Rating.findOne({
      where: { user_id, provider_id }
    });

    if (existingRating) {
      return res.status(400).json({ error: "Ya has calificado a este proveedor" });
    }

    const newRating = await Rating.create({
      user_id,
      provider_id,
      rating,
      comment
    });

    // Actualizar rating promedio del proveedor
    await updateProviderAverageRating(provider_id);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener ratings de un proveedor
const getProviderRatings = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const ratings = await Rating.findAll({
      where: { provider_id: providerId, status: true },
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name', 'profile_image']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar rating
const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findByPk(id);

    if (!rating) {
      return res.status(404).json({ error: "Rating no encontrado" });
    }

    await rating.update(req.body);
    
    // Actualizar rating promedio del proveedor
    await updateProviderAverageRating(rating.provider_id);

    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar rating
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findByPk(id);

    if (!rating) {
      return res.status(404).json({ error: "Rating no encontrado" });
    }

    await rating.destroy();
    
    // Actualizar rating promedio del proveedor
    await updateProviderAverageRating(rating.provider_id);

    res.json({ message: "Rating eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función auxiliar para actualizar rating promedio
const updateProviderAverageRating = async (providerId) => {
  try {
    const ratings = await Rating.findAll({
      where: { provider_id: providerId, status: true }
    });

    if (ratings.length > 0) {
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = totalRating / ratings.length;

      await Provider.update(
        { 
          rating: averageRating,
          reviews: ratings.length
        },
        { where: { id: providerId } }
      );
    }
  } catch (error) {
    console.error("Error actualizando rating promedio:", error);
  }
};

module.exports = {
  createRating,
  getProviderRatings,
  updateRating,
  deleteRating,
};