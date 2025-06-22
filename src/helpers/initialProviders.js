const { Provider } = require("../db.js");

const loadProvidersInDB = async () => {
  try {
    const providers = [
      {
        company: "Bolsas Rodríguez",
        description: "Fabricante de bolsas plásticas con más de 10 años en el rubro",
        rating: 4.5,
        reviews: 143,
        location: "Buenos Aires, Argentina",
        plan: "plus",
        categories: ["Embalaje", "Plásticos"],
        images: ["/lovable-uploads/bolsas.jpg"],
        isWide: false,
        status: "active",
        email: "info@bolsasrodriguez.com",
        verified: true
      },
      {
        company: "Distribuidora Buen Consejo",
        description: "Fabricamos las mejores soluciones en oro, plata y más",
        rating: 4.8,
        reviews: 127,
        location: "Buenos Aires, Argentina",
        plan: "pro",
        categories: ["Joyería", "Metales"],
        images: ["/lovable-uploads/conejo.png", "/lovable-uploads/conejo.png"],
        isWide: false,
        status: "active",
        email: "info@buenconsejo.com",
        verified: true
      },
      {
        company: "Tienda Rokutobi",
        description: "Tienda con amplia experiencia en el rubro",
        rating: 4.6,
        reviews: 89,
        location: "Córdoba, Argentina",
        plan: "pro",
        categories: ["Retail", "Indumentaria"],
        images: ["/lovable-uploads/tienda.jpeg"],
        isWide: false,
        status: "active",
        email: "info@rokutobi.com",
        verified: true
      },
      {
        company: "Frutería Benítomo",
        description: "Productos frescos y de calidad premium",
        rating: 4.9,
        reviews: 156,
        location: "Rosario, Argentina",
        plan: "pro",
        categories: ["Alimentos", "Frutas y Verduras"],
        images: ["/lovable-uploads/fruteria.jpeg"],
        isWide: false,
        status: "active",
        email: "info@benitomo.com",
        verified: true
      },
      {
        company: "Joyerías Marvel",
        description: "Fabricamos en alianzas de oro, plata y más",
        rating: 4.7,
        reviews: 112,
        location: "Mendoza, Argentina",
        plan: "max",
        categories: ["Joyería", "Metales"],
        images: ["/lovable-uploads/joyeria.jpg"],
        isWide: true,
        status: "active",
        email: "info@marvel.com",
        verified: true
      },
      {
        company: "Plásticos Martínez",
        description: "Plásticos para todo tipo de proyecto",
        rating: 4.4,
        reviews: 98,
        location: "Santa Fe, Argentina",
        plan: "max",
        categories: ["Plásticos", "Materiales"],
        images: [
          "/lovable-uploads/plasticos.jpg",
          "/lovable-uploads/plasticos.jpg",
          "/lovable-uploads/plasticos.jpg"
        ],
        isWide: false,
        status: "active",
        email: "info@plasticosmartinez.com",
        verified: true
      },
      {
        company: "Logística SRL",
        description: "Empresa de transporte de cargas medianas y logística especializada",
        rating: 4.7,
        reviews: 98,
        location: "Córdoba, Argentina",
        plan: "plus",
        categories: ["Logística", "Transporte"],
        images: ["/lovable-uploads/logistica.jpg"],
        isWide: false,
        status: "active",
        email: "info@logisticasrl.com",
        verified: true
      },
      {
        company: "AVA Beauty",
        description: "Fabricante de productos cosméticos para el mayor y por menor",
        rating: 4.3,
        reviews: 76,
        location: "Rosario, Argentina",
        plan: "plus",
        categories: ["Cosmética", "Belleza"],
        images: ["/lovable-uploads/ava-beauty.jpg"],
        isWide: false,
        status: "active",
        email: "info@avabeauty.com",
        verified: true
      },
      {
        company: "Plásticos Beta",
        description: "Productos plásticos desde 1980",
        rating: 4.2,
        reviews: 234,
        location: "Mendoza, Argentina",
        plan: "free",
        categories: ["Plásticos", "Materiales"],
        images: ["/lovable-uploads/plasticos-beta.jpg"],
        isWide: false,
        status: "active",
        email: "info@plasticosbeta.com",
        verified: true
      },
      {
        company: "Químicos Russo",
        description: "Químicos especializados y suministros",
        rating: 4.6,
        reviews: 45,
        location: "La Plata, Argentina",
        plan: "free",
        categories: ["Química", "Suministros"],
        images: ["/lovable-uploads/quimicos.jpg"],
        isWide: false,
        status: "active",
        email: "info@quimicosrusso.com",
        verified: true
      },
      {
        company: "OYMSpace",
        description: "Soluciones digitales y marketing",
        rating: 4.8,
        reviews: 67,
        location: "Buenos Aires, Argentina",
        plan: "free",
        categories: ["Digital", "Marketing"],
        images: ["/lovable-uploads/oymspace.jpg"],
        isWide: false,
        status: "active",
        email: "info@oymspace.com",
        verified: true
      }
    ];

    for (const providerData of providers) {
      await Provider.findOrCreate({
        where: { email: providerData.email },
        defaults: providerData
      });
    }

    console.log("✅ Proveedores iniciales cargados exitosamente");
  } catch (error) {
    console.error("❌ Error cargando proveedores:", error);
  }
};

module.exports = { loadProvidersInDB };
