const { put, del } = require("@vercel/blob");
const slugify = require("slugify");
const prisma = require("../config/database");

async function uploadImages(files, spotName) {
  const slug = slugify(spotName, { lower: true });
  const urls = [];

  for (const file of files) {
    const pathname = `turism/${slug}/${Date.now()}-${file.originalname}`;
    const blob = await put(pathname, file.buffer, {
      access: "private",
      contentType: file.mimetype,
    });
    urls.push(blob.url);
  }

  return urls;
}

async function deleteImages(urls) {
  for (const url of urls) {
    await del(url);
  }
}

async function listSpots(filters) {
  const where = {};

  if (filters.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }

  if (filters.requires_ticket !== undefined) {
    where.requires_ticket = filters.requires_ticket === "true";
  }

  if (filters.category) {
    where.category = { equals: filters.category, mode: "insensitive" };
  }

  const spots = await prisma.turismSpot.findMany({
    where,
    orderBy: [{ requires_ticket: "asc" }, { name: "asc" }],
    include: { images: true },
  });

  return spots;
}

async function getSpotById(id) {
  const spot = await prisma.turismSpot.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: true,
      author: { select: { name: true } },
    },
  });

  if (!spot) {
    const error = new Error("Ponto turístico não encontrado");
    error.status = 404;
    throw error;
  }

  return spot;
}

async function createSpot(data, files, userId) {
  // Validate required fields
  const requiredFields = [
    "name",
    "description",
    "district",
    "category",
    "latitude",
    "longitude",
    "requires_ticket",
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === "") {
      const error = new Error(`Campo obrigatório ausente: ${field}`);
      error.status = 400;
      throw error;
    }
  }

  // Validate description length
  if (data.description.length > 200) {
    const error = new Error("Descrição deve ter no máximo 200 caracteres");
    error.status = 400;
    throw error;
  }

  // Validate coordinates
  const latitude = parseFloat(data.latitude);
  const longitude = parseFloat(data.longitude);

  if (isNaN(latitude) || latitude < 30.7 || latitude > 31.53) {
    const error = new Error("Latitude deve estar entre 30.70 e 31.53");
    error.status = 400;
    throw error;
  }

  if (isNaN(longitude) || longitude < 120.85 || longitude > 122.12) {
    const error = new Error("Longitude deve estar entre 120.85 e 122.12");
    error.status = 400;
    throw error;
  }

  // Validate images
  if (!files || files.length === 0) {
    const error = new Error("É necessário enviar pelo menos 1 imagem");
    error.status = 400;
    throw error;
  }

  if (files.length > 5) {
    const error = new Error("Máximo de 5 imagens permitidas");
    error.status = 400;
    throw error;
  }

  // Upload images to Vercel Blob
  const imageUrls = await uploadImages(files, data.name);

  // Create spot with images
  const spot = await prisma.turismSpot.create({
    data: {
      name: data.name,
      description: data.description,
      district: data.district,
      category: data.category,
      latitude,
      longitude,
      requires_ticket:
        data.requires_ticket === "true" || data.requires_ticket === true,
      created_by: userId,
      images: {
        create: imageUrls.map((url) => ({ file_url: url })),
      },
    },
    include: { images: true },
  });

  return spot;
}

async function updateSpot(id, data, files) {
  const spotId = parseInt(id);

  // Check if spot exists
  const existingSpot = await prisma.turismSpot.findUnique({
    where: { id: spotId },
    include: { images: true },
  });

  if (!existingSpot) {
    const error = new Error("Ponto turístico não encontrado");
    error.status = 404;
    throw error;
  }

  // Forbidden fields
  if (data.name !== undefined && data.name !== "") {
    const error = new Error('Não é permitido alterar o campo "name"');
    error.status = 400;
    throw error;
  }

  if (data.district !== undefined && data.district !== "") {
    const error = new Error('Não é permitido alterar o campo "district"');
    error.status = 400;
    throw error;
  }

  // Build update data
  const updateData = {};

  if (data.description !== undefined) {
    if (data.description.length > 200) {
      const error = new Error("Descrição deve ter no máximo 200 caracteres");
      error.status = 400;
      throw error;
    }
    updateData.description = data.description;
  }

  if (data.category !== undefined) {
    updateData.category = data.category;
  }

  if (data.latitude !== undefined) {
    const latitude = parseFloat(data.latitude);
    if (isNaN(latitude) || latitude < 30.7 || latitude > 31.53) {
      const error = new Error("Latitude deve estar entre 30.70 e 31.53");
      error.status = 400;
      throw error;
    }
    updateData.latitude = latitude;
  }

  if (data.longitude !== undefined) {
    const longitude = parseFloat(data.longitude);
    if (isNaN(longitude) || longitude < 120.85 || longitude > 122.12) {
      const error = new Error("Longitude deve estar entre 120.85 e 122.12");
      error.status = 400;
      throw error;
    }
    updateData.longitude = longitude;
  }

  if (data.requires_ticket !== undefined) {
    updateData.requires_ticket =
      data.requires_ticket === "true" || data.requires_ticket === true;
  }

  // Handle image replacement
  if (files && files.length > 0) {
    // Delete old images from Vercel Blob
    const oldUrls = existingSpot.images.map((img) => img.file_url);
    await deleteImages(oldUrls);

    // Delete old image records from database
    await prisma.turismImage.deleteMany({ where: { spot_id: spotId } });

    // Upload new images
    const newUrls = await uploadImages(files, existingSpot.name);

    // Create new image records
    await prisma.turismImage.createMany({
      data: newUrls.map((url) => ({ spot_id: spotId, file_url: url })),
    });
  }

  // Update spot
  const updatedSpot = await prisma.turismSpot.update({
    where: { id: spotId },
    data: updateData,
    include: { images: true },
  });

  return updatedSpot;
}

async function deleteSpot(id) {
  const spotId = parseInt(id);

  const spot = await prisma.turismSpot.findUnique({
    where: { id: spotId },
    include: { images: true },
  });

  if (!spot) {
    const error = new Error("Ponto turístico não encontrado");
    error.status = 404;
    throw error;
  }

  // Delete images from Vercel Blob
  const urls = spot.images.map((img) => img.file_url);
  await deleteImages(urls);

  // Delete spot (images cascade)
  await prisma.turismSpot.delete({ where: { id: spotId } });
}

module.exports = {
  listSpots,
  getSpotById,
  createSpot,
  updateSpot,
  deleteSpot,
};
