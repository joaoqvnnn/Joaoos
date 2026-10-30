const { Markup } = require('telegraf');

const WEBAPP_URL = process.env.WEBAPP_URL; // ex: https://seu-app.onrender.com/admin/dashboard.html

function adminPanelHandler(bot) {
  bot.command('admin', async (ctx) => {
    const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(Number);
    if (!ADMIN_IDS.includes(ctx.from.id)) return;

    await ctx.reply(
      `🛠️ *Painel Administrativo*\n\n` +
      `Bem-vindo, *${ctx.from.first_name}*.\n` +
      `Aqui você gerencia toda a sua loja em tempo real.\n\n` +
      `👇 Toque abaixo para abrir o painel:`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.webApp('🚀 Abrir Painel Admin', WEBAPP_URL)],
        ]),
      }
    );
  });
}

module.exports = adminPanelHandler;
