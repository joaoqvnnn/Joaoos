const express = require('express');
const router = express.Router();
const validateTelegram = require('../../middlewares/validateTelegram');
const q = require('../../db/queries/dashboard');

router.get('/api/admin/dashboard', validateTelegram, async (req, res) => {
  try {
    const [stats, ultimasVendas, estoqueBaixo, ultimosClientes, faturamento7Dias] =
      await Promise.all([
        q.getDashboardStats(),
        q.getUltimasVendas(),
        q.getEstoqueBaixo(),
        q.getUltimosClientes(),
        q.getFaturamento7Dias(),
      ]);

    res.json({
      ok: true,
      admin: { id: req.tgUser.id, nome: req.tgUser.first_name },
      stats,
      ultimasVendas,
      estoqueBaixo,
      ultimosClientes,
      faturamento7Dias,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('[DASHBOARD]', err);
    res.status(500).json({ ok: false, error: 'Erro ao carregar dashboard' });
  }
});

module.exports = router;
