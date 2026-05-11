const express = require('express');
const prisma = require('../utils/prisma');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { product: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

// Create an order
router.post('/', async (req, res) => {
  try {
    const { type, productId, qty } = req.body;

    const order = await prisma.$transaction(async (tx) => {
      let status = 'Processing';
      if (type === 'Purchase') status = 'In Transit';

      const newOrder = await tx.order.create({
        data: {
          type,
          productId,
          qty: parseInt(qty, 10),
          status,
          timestamp: new Date()
        },
        include: { product: true }
      });

      // If it's a sales order, decrement stock immediately
      if (type === 'Sales') {
        const product = await tx.product.findUnique({ where: { id: productId } });
        const newStock = Math.max(0, product.stock - qty);
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: {
            stock: newStock,
            isCritical: newStock < product.maxStock * 0.1
          }
        });
        // Emit inventory update
        req.app.get('io').emit('inventory_updated', { action: 'update', product: updatedProduct });
      }

      return newOrder;
    });

    req.app.get('io').emit('order_updated', { action: 'create', order });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating order' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({ where: { id }, include: { product: true } });

      // If transitioning from In Transit to Completed for Purchase, increment stock
      if (existingOrder.type === 'Purchase' && existingOrder.status !== 'Completed' && status === 'Completed') {
        const product = existingOrder.product;
        const newStock = product.stock + existingOrder.qty;
        const updatedProduct = await tx.product.update({
          where: { id: existingOrder.productId },
          data: {
            stock: newStock,
            isCritical: newStock < product.maxStock * 0.1
          }
        });
        req.app.get('io').emit('inventory_updated', { action: 'update', product: updatedProduct });
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
        include: { product: true }
      });

      return updatedOrder;
    });

    req.app.get('io').emit('order_updated', { action: 'update', order });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating order' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    req.app.get('io').emit('order_updated', { action: 'delete', id });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting order' });
  }
});

module.exports = router;
