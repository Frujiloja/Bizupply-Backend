const { Product } = require("../db");
const listProducts = require("../data/MusicProducts.js");
require("dotenv").config();
const { Op } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})

//!-------------

const getProducts = async () => {
  return await Product.findAll();
};

const loadProductsInDB = async (req, res, next) => {
  const fillProductDb = await Product.bulkCreate(listProducts.map((p) => p));
  if (!fillProductDb) {
    throw new Error("Error loading the products ");
  } else {
    {
      console.log("Products successfully loaded");
    }
  }
};

const getProductByName = async (name) => {
  const nameId = parseInt(name)
  if (!isNaN(nameId)) {
    try {
      let userName = await Product.findAll({
        where: {
          id: name,
        },
      });
      return userName;
    } catch (error) {
      throw new Error(error.message);
    };
  } else {
  try {
    let userName = await Product.findAll({
      where: {
        [Op.or]: [
          {
            brand: {
              [Op.iLike]: `%${name}%`,
            },
          },
          {
            category: {
              [Op.iLike]: `%${name}%`,
            },
          },
          {
            name: {
              [Op.iLike]: `%${name}%`,
            },
          },
        ],
      },
    });
    return userName;
  } catch (error) {
    throw new Error(error.message);
};
};
  // try {
  //   let productName = await Product.findAll({
  //     where: {
  //       name: {
  //         [Op.iLike]: `%${name}%`,
  //       },
  //     },
  //   });
  //   return productName;
  // } catch (error) {
  //   throw new Error(error.message);
  // }
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id);
  return product;
};

//-----post------//

const postProduct = async(data) => {


  try {
    //let imagen = null;
//
    //if(data.imageFile) {
    //  const showImagen = await cloudinary.uploader.upload(data.imageFile.path, {public_id: data.name});
//
    //  imagen = showImagen.secure_url;
//
    //  
    //};

    const newProduct = await Product.create({
      name: data.name,
      brand: data.brand,
      category: data.category,
      description: data.description,
      quantity: data.quantity,
      price: data.price,
      image: data.imagen  
    });

    return newProduct;

  } catch (error) {
    throw new Error(error.message);
  }
}


const putProduct = async (req, res, next) => {
  const {
    name,
    brand,
    category,
    description,
    quantity,
    price,
    image,
    product_status,
  } = req.body;
  const { id } = req.params;
  try {

    let imagenUpdate = null;
    if(req.file){
      const showImage = await cloudinary.uploader.upload(req.file.path, {
        public_id: name,
      });
      imagenUpdate = showImage.secure_url;
    };

    const product = await Product.findByPk(id);
    if (!product) res.status(404).json({ message: "Product does not exist" });

    if(!imagenUpdate){
     const productModified = await product.update({
      name,
      brand,
      category,
      description,
      quantity,
      price,
      image,
      product_status,
    });
    if (productModified) res.status(201).json({ message: "Product modified" }); 
    } else {
      const productModified = await product.update({
        name,
        brand,
        category,
        description,
        quantity,
        price,
        image: imagenUpdate,
        product_status,
      });
      if (productModified) res.status(201).json({ message: "Product modified" });
    }
    
  } catch (error) {
    console.log(error)
    res.status(404).json(error.message);
  }
};

const changeProductStatus = async (req, res) => {
  const {id} = req.params;
  try {
    const productStatus = await Product.findOne({
      where: {
        id: id,
      },
    });
    if(!productStatus) res.status(400).json({error: error.message});
    const status = productStatus.product_status === true ? false : true
    const modifiedProduct = await productStatus.update({
      product_status: status
    });
    if(modifiedProduct) res.status(200).json({message: "Product status modified"})
  } catch (error) {
    throw new Error(error.message)
  };
};


module.exports = {
  getProductById,
  loadProductsInDB,
  getProducts,
  getProductByName,
  postProduct,
  putProduct,
  changeProductStatus,
};
