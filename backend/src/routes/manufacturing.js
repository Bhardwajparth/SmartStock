const express = require('express');
const prisma = require('../utils/prisma');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

// Get all manufacturing jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.manufacturingJob.findMany({
      include: { finishedGood: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching manufacturing jobs' });
  }
});

// Create a manufacturing job
router.post('/', async (req, res) => {
  try {
    const { rawMaterialIds, finishedGoodId, qty } = req.body;

    const job = await prisma.$transaction(async (tx) => {
      // Decrement raw materials
      for (const id of rawMaterialIds) {
        const material = await tx.product.findUnique({ where: { id } });
        if (material) {
          const newStock = Math.max(0, material.stock - qty);
          const updatedMaterial = await tx.product.update({
            where: { id },
            data: { stock: newStock, isCritical: newStock < material.maxStock * 0.1 }
          });
          req.app.get('io').emit('inventory_updated', { action: 'update', product: updatedMaterial });
        }
      }

      // Increment finished good
      const finishedGood = await tx.product.findUnique({ where: { id: finishedGoodId } });
      if (finishedGood) {
        const newStock = finishedGood.stock + qty;
        const updatedFinishedGood = await tx.product.update({
          where: { id: finishedGoodId },
          data: { stock: newStock, isCritical: newStock < finishedGood.maxStock * 0.1 }
        });
        req.app.get('io').emit('inventory_updated', { action: 'update', product: updatedFinishedGood });
      }

      // Create job record
      const newJob = await tx.manufacturingJob.create({
        data: {
          finishedGoodId,
          qty: parseInt(qty, 10),
          status: 'Completed',
          timestamp: new Date()
        },
        include: { finishedGood: true }
      });

      return newJob;
    });

    req.app.get('io').emit('manufacturing_updated', { action: 'create', job });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating manufacturing job' });
  }
});

// Update job status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedJob = await prisma.manufacturingJob.update({
      where: { id },
      data: { status },
      include: { finishedGood: true }
    });

    req.app.get('io').emit('manufacturing_updated', { action: 'update', job: updatedJob });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating manufacturing job' });
  }
});

module.exports = router;
