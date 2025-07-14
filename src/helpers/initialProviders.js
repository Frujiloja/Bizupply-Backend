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
        categories: "Plásticos",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308620/59274586-1468-46af-baa3-d66c083ec554.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308600/e3075b20-935e-4ca1-b5e3-9a409f56ae88.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308582/3c8b8c3a-02bd-4624-a0e8-26f4cd238f6d.png"],
        isWide: false,
        status: "active",
        email: "info@bolsasrodriguez.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "Distribuidora Buen Consejo",
        description: "Fabricamos las mejores soluciones en oro, plata y más",
        rating: 4.8,
        reviews: 127,
        location: "Buenos Aires, Argentina",
        plan: "pro",
        categories: "Joyería",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308853/f9550948-ff5d-4bc7-9506-ec603ab4651c.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308803/08aea5d6-b6f0-4215-9d5b-b3efa86b8ad7.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308322/joyeria_jel1xg.jpg"],
        isWide: false,
        status: "active",
        email: "info@buenconsejo.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "Tienda Rokutobi",
        description: "Tienda con amplia experiencia en el rubro",
        rating: 4.6,
        reviews: 89,
        location: "Córdoba, Argentina",
        plan: "pro",
        categories: "Indumentaria",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308985/bc2491e2-a928-4f49-86a5-369e718e9fe5.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308982/d8f8fc67-7636-4573-80df-d4f84987f56f.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308966/ae98f534-d8d8-4eee-b061-612d31db1277.png"],
        isWide: false,
        status: "active",
        email: "info@rokutobi.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "Frutería Benítomo",
        description: "Productos frescos y de calidad premium",
        rating: 4.9,
        reviews: 156,
        location: "Rosario, Argentina",
        plan: "pro",
        categories: "Alimentos",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308322/fruteria_a3voki.jpg", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308324/tienda_gz2xci.jpg", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308321/conejo_nhygqd.jpg"],
        isWide: false,
        status: "active",
        email: "info@benitomo.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "Joyerías Marvel",
        description: "Fabricamos en alianzas de oro, plata y más",
        rating: 4.7,
        reviews: 112,
        location: "Mendoza, Argentina",
        plan: "max",
        categories: "Joyería",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308322/joyeria_jel1xg.jpg", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308853/f9550948-ff5d-4bc7-9506-ec603ab4651c.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308803/08aea5d6-b6f0-4215-9d5b-b3efa86b8ad7.png"],
        isWide: true,
        status: "active",
        email: "info@marvel.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "Plásticos Martínez",
        description: "Plásticos para todo tipo de proyecto",
        rating: 4.4,
        reviews: 98,
        location: "Santa Fe, Argentina",
        plan: "max",
        categories: "Plásticos",
        images: [
          "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308323/plasticos_awdkf0.jpg",
          "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308582/3c8b8c3a-02bd-4624-a0e8-26f4cd238f6d.png",
          "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309122/96af624f-0fc9-4c02-81d6-28e0c1bb3299.png"
        ],
        isWide: false,
        status: "active",
        email: "info@plasticosmartinez.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "Logística SRL",
        description: "Empresa de transporte de cargas medianas y logística especializada",
        rating: 4.7,
        reviews: 98,
        location: "Córdoba, Argentina",
        plan: "plus",
        categories: "Logística",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309181/0bfe99d4-edbf-4deb-89de-76ba4762ec86.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309212/e39c3be1-345f-4b72-8919-d29aa63fa937.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309215/56abc1e1-6535-410f-be37-bbbcd70f6010.png"],
        isWide: false,
        status: "active",
        email: "info@logisticasrl.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "AVA Beauty",
        description: "Fabricante de productos cosméticos para el mayor y por menor",
        rating: 4.3,
        reviews: 76,
        location: "Rosario, Argentina",
        plan: "plus",
        categories: "Cosmética",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309286/6ef713f9-015d-4d31-9ef2-4448ac6a2bdd.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309290/0de56e43-d4fe-4b2c-a8f1-e14e83fc1591.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309265/e96b4e1b-9d33-4375-aa45-ba96da331331.png"],
        isWide: false,
        status: "active",
        email: "info@avabeauty.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "Plásticos Beta",
        description: "Productos plásticos desde 1980",
        rating: 4.2,
        reviews: 234,
        location: "Mendoza, Argentina",
        plan: "free",
        categories: "Plásticos",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309122/96af624f-0fc9-4c02-81d6-28e0c1bb3299.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308620/59274586-1468-46af-baa3-d66c083ec554.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751308323/plasticos_awdkf0.jpg"],
        isWide: false,
        status: "active",
        email: "info@plasticosbeta.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "Químicos Russo",
        description: "Químicos especializados y suministros",
        rating: 4.6,
        reviews: 45,
        location: "La Plata, Argentina",
        plan: "free",
        categories: "Química",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309391/d3637a49-becc-4cd8-8182-cf359c52e4b3.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309395/e6acdf91-5180-4707-8ca8-e43e0939f2d4.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309380/b5a3c481-004d-4b4f-8a55-600f12b1a0d8.png"],
        isWide: false,
        status: "active",
        email: "info@quimicosrusso.com",
        phone: 1123456789,
        website: "www.website.com.ar",
        verified: true
      },
      {
        company: "OYMSpace",
        description: "Soluciones digitales y marketing",
        rating: 4.8,
        reviews: 67,
        location: "Buenos Aires, Argentina",
        plan: "free",
        categories: "Digital",
        images: ["https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309450/c2e7ad28-beb9-498c-82ca-367753960937.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309462/eb733a0a-f3be-4d07-a5a7-626b66a3e446.png", "https://res.cloudinary.com/dvgyb22nw/image/upload/v1751309459/b5d5a799-7ed7-4559-b190-5a3130c7c4d8.png"],
        isWide: false,
        status: "active",
        email: "info@oymspace.com",
        phone: 1123456789,
        website: "www.website.com.ar",
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
