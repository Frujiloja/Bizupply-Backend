const { Product } = require("../db.js");

const loadProductsInDB = async () => {
  try {
    const products = [
      {
        id: 1,
        name: "Bizupply Free",
        price: null,
        description: [
          "Incluye publicar tu negocio en el sitio",
          "Chatear con posibles clientes",
          "Incluye un icono y obtener el certificado verificado junto a tu negocio",
        ],
      },
      {
        id: 2,
        name: "Bizupply Plus",
        price: 20000,
        description: [
          "Tendrás la posibilidad de aparecer en algunos de los primeros resultados cuando se realice una búsqueda en la página inicial",
          "También aparecerás en las primeras posiciones cuando se realice una búsqueda relacionada a tu negocio",
        ],
      },
      {
        id: 3,
        name: "Bizupply Pro",
        price: 40000,
        description: [
          "Tendrás la posibilidad de aparecer en algunos de los primeros resultados cuando se realice una búsqueda en la página inicial",
          "También aparecerás en las primeras posiciones cuando se realice una búsqueda relacionada a tu negocio",
          "Aparecerás en las 3 primeras posiciones exclusivas justo en la página principal, debajo de los anuncios principales",
        ],
      },
      {
        id: 4,
        name: "Bizupply Max",
        price: 60000,
        description: [
          "Tendrás la posibilidad de aparecer en algunos de los dos principales banners de la página inicial, donde se verá en grande junto a la información de tu negocio",
          "Sin publicidad externa en tu sección",
          "Aparecerás únicamente en búsquedas no relacionadas",
          "Acceso a nuestras comunidades de emprendedores y proveedores",
        ],
      },
    ];

    for (const productsData of products) {
      await Product.findOrCreate({
        where: { name: productsData.name },
        defaults: productsData,
      });
    }

    console.log("✅ Productos iniciales cargados exitosamente");
  } catch (error) {
    console.error("❌ Error cargando productos:", error);
  }
};

module.exports = { loadProductsInDB };
