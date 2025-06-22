require("dotenv").config();
const {
  getProducts,
  getProductById,
  getProductByName,
  postProduct,
} = require("../controllers/productControllers");

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})

const getAllProducts = async (req, res) => {
  const { name } = req.query;
  const response = name ? await getProductByName(name) : await getProducts();

  try {
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductByIdHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const wantedProduct = await getProductById(id);

    if (!wantedProduct)
      throw new Error("Lo siento no existe un producto con ese id");
    res.status(200).json(wantedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const postProductHandler = async (req, res) => {
  const {name, brand, category, description, quantity, price} = req.body;

  const imageFile = req.file;

  console.log(imageFile);
    let imagen = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxik8f-0VdGyTPqLlOxXhJOHPms35wKycNT37kSN7_e-d7Bt3bOYslLO_BbD0ySMLvGsg&usqp=CAU";

    if(imageFile) {
      const showImagen = await cloudinary.uploader.upload(imageFile.path, {public_id: name});

      if (showImagen.error) {
        return res
          .status(500)
          .json({ message: "Error uploading image to Cloudinary" });
      }

      imagen = showImagen.secure_url;

      
    };

  if(!name || !brand || !category || !description || !quantity || !price) {
    return res.status(400).json({message: "falta informacion para crear el producto, revise que esten los 6 campos correspondientes y esten bien escritos sus nombres variables"});
  }

  const dataProduct = {
    name, brand, category, description, quantity, price, imagen
  };

  try {
    console.log(imageFile)
    const product = await postProduct(dataProduct);
    console.log(product)

    return res.status(201).json(product);
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message: "hubo un error en el server, intente mas tarde"})
  }
}

module.exports = {
  getAllProducts,
  getProductByIdHandler,
  postProductHandler,
};
