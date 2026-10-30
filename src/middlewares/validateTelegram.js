// Valida o initData do Telegram WebApp (evita qualquer um acessar o painel)
const crypto = require('crypto');

function validateTelegram(req, res, next) {
  try {
    const initData = req.headers['x-telegram-init-data'] || req.query.initData;
    if (!initData) return res.status(401).json({ ok: false, error: 'initData ausente' });

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) {
      return res.status(403).json({ ok: false, error: 'Assinatura inválida' });
    }

    const user = JSON.parse(params.get('user'));
    const ADMINS = (process.env.ADMIN_IDS || '').split(',').map(Number);
    if (!ADMINS.includes(user.id)) {
      return res.status(403).json({ ok: false, error: 'Acesso negado' });
    }

    req.tgUser = user;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: 'initData inválido' });
  }
}

module.exports = validateTelegram;
