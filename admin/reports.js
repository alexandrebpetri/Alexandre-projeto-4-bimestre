document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://127.0.0.1:3000';

  const refreshSalesBtn = document.getElementById('refresh-sales');
  const printSalesBtn = document.getElementById('print-sales');
  const salesTable = document.getElementById('sales-table');
  const salesTbody = salesTable.querySelector('tbody');
  const salesLoading = document.getElementById('sales-loading');

  const refreshProfitBtn = document.getElementById('refresh-profit');
  const printProfitBtn = document.getElementById('print-profit');
  const profitTable = document.getElementById('profit-table');
  const profitTbody = profitTable.querySelector('tbody');
  const profitLoading = document.getElementById('profit-loading');

  refreshSalesBtn && refreshSalesBtn.addEventListener('click', loadReports);
  refreshProfitBtn && refreshProfitBtn.addEventListener('click', loadReports);
  printSalesBtn && printSalesBtn.addEventListener('click', () => printElement(salesTable));
  printProfitBtn && printProfitBtn.addEventListener('click', () => printElement(profitTable));

  async function loadReports() {
    salesLoading.style.display = 'block';
    profitLoading.style.display = 'block';
    salesTable.style.display = 'none';
    profitTable.style.display = 'none';
    salesTbody.innerHTML = '';
    profitTbody.innerHTML = '';

    try {
      // Busca todos os jogos para mapear id->info
      const gamesRes = await fetch(`${API_BASE_URL}/games`);
      const games = await gamesRes.json();
      const gamesById = {};
      games.forEach(g => { gamesById[g.id] = g; });

      // Busca todos os usuários para percorrer bibliotecas
      const usersRes = await fetch(`${API_BASE_URL}/users`);
      const users = await usersRes.json();

      const salesCount = {}; // gameId -> count
      const salesProfit = {}; // gameId -> sum of price

      // Para cada usuário, busca sua biblioteca
      for (const u of users) {
        try {
          const libRes = await fetch(`${API_BASE_URL}/api/library/${u.id}`);
          if (!libRes.ok) continue;
          const items = await libRes.json();
          for (const it of items) {
            const gid = it.id; // controller returns game id in `id`
            const price = parseFloat(it.price) || 0;
            salesCount[gid] = (salesCount[gid] || 0) + 1;
            salesProfit[gid] = (salesProfit[gid] || 0) + price;
          }
        } catch (err) {
          // ignora falha por usuário
          console.warn('Erro ao buscar biblioteca do usuário', u.id, err);
        }
      }

      // Prepara arrays ordenadas
      const soldList = Object.keys(salesCount).map(k => ({ id: Number(k), count: salesCount[k], name: (gamesById[k] && gamesById[k].name) || 'Desconhecido' }));
      soldList.sort((a,b) => b.count - a.count);

      const profitList = Object.keys(salesProfit).map(k => ({ id: Number(k), profit: salesProfit[k], count: salesCount[k] || 0, price: (gamesById[k] && parseFloat(gamesById[k].price)) || 0, name: (gamesById[k] && gamesById[k].name) || 'Desconhecido' }));
      profitList.sort((a,b) => b.profit - a.profit);

      // Preenche tabela de vendas
      let pos = 1;
      for (const row of soldList) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${pos++}</td><td>${escapeHtml(row.name)}</td><td>${row.count}</td>`;
        salesTbody.appendChild(tr);
      }

      // Preenche tabela de lucro
      for (const row of profitList) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${escapeHtml(row.name)}</td><td>${row.count}</td><td>${row.price ? 'R$ ' + Number(row.price).toFixed(2) : 'Grátis'}</td><td>R$ ${Number(row.profit).toFixed(2)}</td>`;
        profitTbody.appendChild(tr);
      }

      salesLoading.style.display = 'none';
      profitLoading.style.display = 'none';
      salesTable.style.display = soldList.length ? '' : 'none';
      profitTable.style.display = profitList.length ? '' : 'none';

      if (!soldList.length) salesLoading.textContent = 'Nenhuma venda registrada.';
      if (!profitList.length) profitLoading.textContent = 'Nenhuma venda registrada.';

    } catch (err) {
      console.error('Erro ao gerar relatórios', err);
      salesLoading.textContent = 'Erro ao gerar relatório.';
      profitLoading.textContent = 'Erro ao gerar relatório.';
    }
  }

  function escapeHtml(text) {
    if (text == null) return '';
    return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function printElement(el) {
    const w = window.open('', '_blank');
    const title = document.querySelector('.admin-logo') ? document.querySelector('.admin-logo').alt : 'Relatório';
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><link rel="stylesheet" href="admin.css"></head><body> ${el.outerHTML} <script>window.onload=function(){window.print();}</script></body></html>`;
    w.document.write(html);
    w.document.close();
  }

  // auto-load ao abrir a página
  loadReports();
});
