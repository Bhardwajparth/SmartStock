const express = require('express');
const prisma = require('../utils/prisma');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching inventory' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newProduct = await prisma.product.create({
      data: {
        ...data,
        isCritical: data.stock < (data.maxStock || 500) * 0.1
      }
    });
    req.app.get('io').emit('inventory_updated', { action: 'create', product: newProduct });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Calculate critical status if stock or maxStock changes
    if (data.stock !== undefined || data.maxStock !== undefined) {
      const product = await prisma.product.findUnique({ where: { id } });
      const currentStock = data.stock !== undefined ? data.stock : product.stock;
      const currentMax = data.maxStock !== undefined ? data.maxStock : product.maxStock;
      data.isCritical = currentStock < currentMax * 0.1;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data
    });
    req.app.get('io').emit('inventory_updated', { action: 'update', product: updatedProduct });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    req.app.get('io').emit('inventory_updated', { action: 'delete', id });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting product' });
  }
});

module.exports = router;
