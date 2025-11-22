/* script.js - lógica de seleção de serviços, resumo, calendário e horários */

// === Dados iniciais dos serviços (pode ajustar) ===
const servicos = [
  { id: 1, nome: 'Design de Sobrancelha', desc: 'Modelagem e design completo...', preco: 45.00, duracao: 30 },
  { id: 2, nome: 'Henna', desc: 'Aplicação de henna para preenchimento e definição', preco: 25.00, duracao: 45 },
  { id: 3, nome: 'Brow Lamination', desc: 'Laminação para efeito mais volumoso', preco: 120.00, duracao: 60 },
  { id: 4, nome: 'Micropigmentação', desc: 'Micropigmentação fio a fio para sobrancelhas naturais', preco: 350.00, duracao: 120 },
  { id: 5, nome: 'Combo Completo', desc: 'Design + Henna + Hidratação', preco: 95.00, duracao: 60 },
];

function buildCalendar(year, month) {
  calendarEl.innerHTML = '';

  weekdayNames.forEach(d => {
    const hd = document.createElement('div');
    hd.className = 'text-center small text-muted';
    hd.style.padding = '6px 0';
    hd.textContent = d;
    calendarEl.appendChild(hd);
  });

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();

  // Pré espaços
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day disabled';
    calendarEl.appendChild(empty);
  }

  function getStatusDoDia(dateStr) {
  const dia = Number(dateStr.split("-")[2]);

  if (dia % 5 === 0) return "lotado";   // exemplo
  if (dia % 2 === 0) return "parcial";  // exemplo
  return "disponivel";
}

  for (let d = 1; d <= last.getDate(); d++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = d;

    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    day.dataset.date = dateStr;

    // Verifica o status
    const status = getStatusDoDia(dateStr);

    if (status === "parcial") {
      day.classList.add("dia-parcial");
    }
    if (status === "lotado") {
      day.classList.add("dia-lotado");
      day.classList.add("disabled");
      day.style.pointerEvents = "none";
    }
    

    // Clique só em dias normais e parciais
    if (status !== "lotado") {
      day.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
        day.classList.add('selected');

        selectedDate = dateStr;
        selectedHorario = null;

        selectedDateText.textContent = `Data selecionada: ${formatDateBr(dateStr)}`;
        renderHorariosParaData(dateStr);
      });
    }

    calendarEl.appendChild(day);
  }
}


// referências DOM
const listaServicosEl = document.getElementById('lista-servicos');
const duracaoTotalEl = document.getElementById('duracao-total');
const valorTotalEl = document.getElementById('valor-total');
const resumoDuracaoEl = document.getElementById('resumo-duracao');
const resumoValorEl = document.getElementById('resumo-valor');
const calendarEl = document.getElementById('calendar');
const selectedDateText = document.getElementById('selected-date-text');
const horariosGrid = document.getElementById('horarios-grid');

let selecionados = new Set();
let selectedDate = null;
let selectedHorario = null;


// === renderizar serviços ===
function renderServicos() {
  listaServicosEl.innerHTML = '';
  servicos.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card-servico';
    card.dataset.id = s.id;

    card.innerHTML = `
      <div class="info">
        <h6>${s.nome}</h6>
        <p>${s.desc}</p>
      </div>
      <div class="badges text-end">
        <div class="price">R$ ${s.preco.toFixed(2)}</div>
        <div class="time">${s.duracao} min</div>
      </div>
    `;

    card.addEventListener('click', () => toggleServico(s.id, card));
    listaServicosEl.appendChild(card);
  });
}

// === selecionar ou remover serviço ===
function toggleServico(id, cardEl) {
  if (selecionados.has(id)) {
    selecionados.delete(id);
    cardEl.classList.remove('selecionado');
  } else {
    selecionados.add(id);
    cardEl.classList.add('selecionado');
  }
  atualizarResumo();
}

// === atualizar resumo ===
function atualizarResumo() {
  let dur = 0;
  let val = 0;
  selecionados.forEach(id => {
    const s = servicos.find(x => x.id === id);
    if (s) { dur += s.duracao; val += s.preco; }
  });

  duracaoTotalEl.textContent = dur;
  valorTotalEl.textContent = `R$ ${val.toFixed(2).replace('.', ',')}`;
  resumoDuracaoEl.textContent = dur > 0 ? `${dur} min` : '0 min';
  resumoValorEl.textContent = val > 0 ? `R$ ${val.toFixed(2).replace('.', ',')}` : 'R$ 0,00';
}



// === CALENDÁRIO ===

const weekdayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];

function buildCalendar(year, month) {
  calendarEl.innerHTML = '';

  // cabeçalho dos dias da semana
  weekdayNames.forEach(d => {
    const hd = document.createElement('div');
    hd.className = 'text-center small text-muted';
    hd.style.padding = '6px 0';
    hd.textContent = d;
    calendarEl.appendChild(hd);
  });

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();

  // espaços vazios antes do dia 1
  for (let i=0; i<startDay; i++){
    const empty = document.createElement('div');
    empty.className = 'calendar-day disabled';
    calendarEl.appendChild(empty);
  }

  // dias do mês
  for (let d=1; d<=last.getDate(); d++){
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = d;

    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    day.dataset.date = dateStr;

    day.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
      day.classList.add('selected');

      selectedDate = dateStr;
      selectedHorario = null;

      selectedDateText.textContent = `Data selecionada: ${formatDateBr(dateStr)}`;
      renderHorariosParaData(dateStr);

      verificarMensagemAgendamento();
    });

    calendarEl.appendChild(day);
  }
}

function formatDateBr(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}



// === HORÁRIOS ===

const horariosPadrao = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];

function renderHorariosParaData(dateStr) {
  horariosGrid.innerHTML = '';

  const blocked = getBlockedTimesForDate(dateStr);

  horariosPadrao.forEach(h => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-light';
    btn.textContent = h;

    if (blocked.includes(h)) {
      btn.disabled = true;
      btn.classList.add('opacity-50');
    } else {
      btn.addEventListener('click', () => {
        horariosGrid.querySelectorAll('button').forEach(b => b.classList.remove('btn-ativo'));
        btn.classList.add('btn-ativo');

        selectedHorario = h;
        verificarMensagemAgendamento();
        abrirModalConfirmacao();
      });
    }

    horariosGrid.appendChild(btn);
  });
}

function getBlockedTimesForDate(dateStr) {
  const day = (new Date(dateStr)).getDate();
  if (day % 2 === 0) return ['11:00','15:00'];
  return ['12:00'];
}



// === MENSAGEM "NÃO TEM AGENDAMENTOS" ===

function verificarMensagemAgendamento() {
  const msg = document.getElementById('mensagem-sem-agendamento');

  if (!selectedDate || !selectedHorario) {
    msg.style.display = 'block';
  } else {
    msg.style.display = 'none';
  }
}



// === MODAL DE CONFIRMAÇÃO ===

function abrirModalConfirmacao() {
  if (!selectedDate || !selectedHorario) return;

  document.getElementById("confirmaData").textContent = selectedDate;
  document.getElementById("confirmaHorario").textContent = selectedHorario;

  const modal = new bootstrap.Modal(document.getElementById('modalConfirmar'));
  modal.show();
}

function confirmarAgendamento() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !email || !telefone) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  alert("Agendamento confirmado! 🎉");
}



// === INÍCIO ===

function init() {
  renderServicos();
  atualizarResumo();

  const today = new Date();
  buildCalendar(today.getFullYear(), today.getMonth());

  const info = document.createElement('div');
  info.className = 'd-flex justify-content-between align-items-center mb-2';
  const title = document.createElement('div');
  title.innerHTML = `<strong>${today.toLocaleDateString('pt-BR',{ month:'long', year:'numeric'})}</strong>`;
  info.appendChild(title);

  calendarEl.parentNode.insertBefore(info, calendarEl);
}

init();
