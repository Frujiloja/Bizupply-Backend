const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { loadProvidersInDB } = require("./src/helpers/initialProviders.js");

require("dotenv").config();
const { PORT } = process.env;

// Sincronizar modelos con la base de datos
conn.sync({ force: true }).then(async () => {
  // force: true para crear las tablas (cambiar a false después de la primera vez)
  server.listen(PORT, async () => {
    console.log(`🚀 BizSupply Backend corriendo en puerto ${PORT}`);
    console.log(`�� Base de datos sincronizada`);
    
    // Cargar datos iniciales de proveedores
    await loadProvidersInDB();
  });
});