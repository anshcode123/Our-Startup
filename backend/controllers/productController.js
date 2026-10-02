const prisma = require("../lib/prisma");
const {
  validateProductInput,
  validateImageBuffer,
} = require("../lib/validation");
const { uploadImageToCloud } = require("../lib/cloudinary");

async function handleListProducts({ query = {}, admin = null } = {}) {
  const isAdminScope = query.scope === "admin" || query.all === "true";

  if (isAdminScope) {
    if (!admin) {
      return {
        status: 401,
        body: { error: "Unauthorized access. Admin authentication required." },
      };
    }

    try {
      const products = await prisma.product.findMany({
        orderBy: [{ updatedAt: "desc" }],
      });

      const stats = {
        total: products.length,
        published: products.filter((p) => p.status === "PUBLISHED").length,
        draft: products.filter((p) => p.status === "DRAFT").length,
        featured: products.filter((p) => p.featured).length,
      };

      return {
        status: 200,
        body: { products, stats },
      };
    } catch (error) {
      console.error("[productController.handleListProducts:admin] Error:", error.message);
      return {
        status: 500,
        body: { error: "Failed to load products from the database." },
      };
    }
  }

  try {
    const where = { status: "PUBLISHED" };

    if (query.featured === "true") {
      where.featured = true;
    }

    if (query.category && String(query.category).trim()) {
      where.category = {
        equals: String(query.category).trim(),
        mode: "insensitive",
      };
    }

    const parsedLimit = Number.parseInt(query.limit, 10);
    const take =
      Number.isFinite(parsedLimit) && parsedLimit > 0 && parsedLimit <= 50
        ? parsedLimit
        : undefined;

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      ...(take ? { take } : {}),
    });

    return {
      status: 200,
      body: { products },
    };
  } catch (error) {
    console.error("[productController.handleListProducts:public] Error:", error.message);
    return {
      status: 500,
      body: { error: "Failed to retrieve published products." },
    };
  }
}

async function handleGetProduct({ slugOrId = "", query = {}, admin = null } = {}) {
  const identifier = String(slugOrId || "").trim();
  if (!identifier) {
    return {
      status: 400,
      body: { error: "Product identifier is required." },
    };
  }

  const isAdminScope = query.scope === "admin";
  if (isAdminScope && !admin) {
    return {
      status: 401,
      body: { error: "Unauthorized access. Admin authentication required." },
    };
  }

  try {
    if (isAdminScope && admin) {
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ slug: identifier.toLowerCase() }, { id: identifier }],
        },
      });

      if (!product) {
        return {
          status: 404,
          body: { error: "Product not found." },
        };
      }

      return {
        status: 200,
        body: { product },
      };
    }

    const product = await prisma.product.findUnique({
      where: { slug: identifier.toLowerCase() },
    });

    if (!product || product.status !== "PUBLISHED") {
      return {
        status: 404,
        body: { error: "Product not found." },
      };
    }

    return {
      status: 200,
      body: { product },
    };
  } catch (error) {
    console.error("[productController.handleGetProduct] Error:", error.message);
    return {
      status: 500,
      body: { error: "Failed to fetch product details." },
    };
  }
}

async function handleCreateProduct(body = {}) {
  const validation = validateProductInput(body, { partial: false });
  if (!validation.valid) {
    return {
      status: 400,
      body: {
        error: validation.error,
        errors: validation.errors,
      },
    };
  }

  const data = validation.data;

  try {
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (existingSlug) {
      return {
        status: 409,
        body: {
          error:
            "A product with this slug already exists. Please choose a unique slug.",
        },
      };
    }

    const product = await prisma.product.create({
      data,
    });

    return {
      status: 201,
      body: {
        message: "Product created successfully.",
        product,
      },
    };
  } catch (error) {
    if (error && error.code === "P2002") {
      return {
        status: 409,
        body: {
          error:
            "A product with this slug already exists. Please choose a unique slug.",
        },
      };
    }

    console.error("[productController.handleCreateProduct] Error:", error.message);
    return {
      status: 500,
      body: { error: "Failed to create product. Please try again." },
    };
  }
}

async function handleUpdateProduct(id = "", body = {}) {
  const productId = String(id || "").trim();
  if (!productId) {
    return {
      status: 400,
      body: { error: "Product ID is required." },
    };
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existing) {
      return {
        status: 404,
        body: { error: "Product not found." },
      };
    }

    const mergedInput = {
      name: body.name !== undefined ? body.name : existing.name,
      slug: body.slug !== undefined ? body.slug : existing.slug,
      shortDescription:
        body.shortDescription !== undefined
          ? body.shortDescription
          : existing.shortDescription,
      description:
        body.description !== undefined ? body.description : existing.description,
      category: body.category !== undefined ? body.category : existing.category,
      logoUrl: body.logoUrl !== undefined ? body.logoUrl : existing.logoUrl,
      coverImage:
        body.coverImage !== undefined ? body.coverImage : existing.coverImage,
      galleryImages:
        body.galleryImages !== undefined
          ? body.galleryImages
          : existing.galleryImages,
      technologies:
        body.technologies !== undefined
          ? body.technologies
          : existing.technologies,
      features:
        body.features !== undefined ? body.features : existing.features,
      liveUrl: body.liveUrl !== undefined ? body.liveUrl : existing.liveUrl,
      githubUrl:
        body.githubUrl !== undefined ? body.githubUrl : existing.githubUrl,
      status: body.status !== undefined ? body.status : existing.status,
      featured:
        body.featured !== undefined ? body.featured : existing.featured,
    };

    const validation = validateProductInput(mergedInput, { partial: false });
    if (!validation.valid) {
      return {
        status: 400,
        body: {
          error: validation.error,
          errors: validation.errors,
        },
      };
    }

    const data = validation.data;

    if (data.slug !== existing.slug) {
      const slugConflict = await prisma.product.findFirst({
        where: {
          slug: data.slug,
          NOT: { id: productId },
        },
        select: { id: true },
      });

      if (slugConflict) {
        return {
          status: 409,
          body: {
            error:
              "A product with this slug already exists. Please choose a unique slug.",
          },
        };
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return {
      status: 200,
      body: {
        message: "Product updated successfully.",
        product,
        previousSlug: existing.slug,
      },
    };
  } catch (error) {
    if (error && error.code === "P2002") {
      return {
        status: 409,
        body: {
          error:
            "A product with this slug already exists. Please choose a unique slug.",
        },
      };
    }

    console.error("[productController.handleUpdateProduct] Error:", error.message);
    return {
      status: 500,
      body: { error: "Failed to update product. Please try again." },
    };
  }
}

async function handleDeleteProduct(id = "") {
  const productId = String(id || "").trim();
  if (!productId) {
    return {
      status: 400,
      body: { error: "Product ID is required." },
    };
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, slug: true, name: true },
    });

    if (!existing) {
      return {
        status: 404,
        body: { error: "Product not found." },
      };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return {
      status: 200,
      body: {
        message: "Product deleted successfully.",
        deletedId: existing.id,
        deletedSlug: existing.slug,
      },
    };
  } catch (error) {
    console.error("[productController.handleDeleteProduct] Error:", error.message);
    return {
      status: 500,
      body: { error: "Failed to delete product. Please try again." },
    };
  }
}

async function handlePublishProduct(id = "", shouldPublish = true) {
  const productId = String(id || "").trim();
  if (!productId) {
    return {
      status: 400,
      body: { error: "Product ID is required." },
    };
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return {
        status: 404,
        body: { error: "Product not found." },
      };
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        status: shouldPublish ? "PUBLISHED" : "DRAFT",
      },
    });

    return {
      status: 200,
      body: {
        message: shouldPublish
          ? "Product published successfully."
          : "Product unpublished and moved to draft.",
        product,
      },
    };
  } catch (error) {
    console.error("[productController.handlePublishProduct] Error:", error.message);
    return {
      status: 500,
      body: { error: "Failed to update product status." },
    };
  }
}

async function handleUploadProductImage({
  buffer,
  mimeType = "",
  originalName = "",
} = {}) {
  const validation = validateImageBuffer(buffer, mimeType, originalName);
  if (!validation.valid) {
    return {
      status: 400,
      body: { error: validation.error },
    };
  }

  try {
    const uploaded = await uploadImageToCloud(buffer, {
      mimeType,
      folder: "anshul-dev/products",
    });

    return {
      status: 200,
      body: {
        message: "Image uploaded successfully.",
        url: uploaded.url,
        publicId: uploaded.publicId,
        width: uploaded.width,
        height: uploaded.height,
        format: uploaded.format,
        bytes: uploaded.bytes,
      },
    };
  } catch (error) {
    const statusCode = error.statusCode || 502;
    return {
      status: statusCode,
      body: {
        error:
          error.message ||
          "Image upload failed. Please check your image storage configuration.",
      },
    };
  }
}

async function listProducts(req, res) {
  const result = await handleListProducts({
    query: req.query,
    admin: req.admin || null,
  });
  return res.status(result.status).json(result.body);
}

async function getProductBySlug(req, res) {
  const result = await handleGetProduct({
    slugOrId: req.params.slug || req.params.id,
    query: req.query,
    admin: req.admin || null,
  });
  return res.status(result.status).json(result.body);
}

async function createProduct(req, res) {
  const result = await handleCreateProduct(req.body);
  return res.status(result.status).json(result.body);
}

async function updateProduct(req, res) {
  const result = await handleUpdateProduct(req.params.id, req.body);
  return res.status(result.status).json(result.body);
}

async function deleteProduct(req, res) {
  const result = await handleDeleteProduct(req.params.id);
  return res.status(result.status).json(result.body);
}

async function publishProduct(req, res) {
  const result = await handlePublishProduct(req.params.id, true);
  return res.status(result.status).json(result.body);
}

async function unpublishProduct(req, res) {
  const result = await handlePublishProduct(req.params.id, false);
  return res.status(result.status).json(result.body);
}

async function uploadProductImage(req, res) {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({
      error: "No image file received. Please select a valid image file.",
    });
  }

  const result = await handleUploadProductImage({
    buffer: req.file.buffer,
    mimeType: req.file.mimetype,
    originalName: req.file.originalname,
  });

  return res.status(result.status).json(result.body);
}

module.exports = {
  handleListProducts,
  handleGetProduct,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handlePublishProduct,
  handleUploadProductImage,
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
  uploadProductImage,
};
