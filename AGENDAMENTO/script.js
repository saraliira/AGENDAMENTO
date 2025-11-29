const servicos = [
  { id: 1, nome: "Design de Sobrancelha", preco: 45, duracao: 30 },
  { id: 2, nome: "Henna", preco: 25, duracao: 45 },
  { id: 3, nome: "Brow Lamination", preco: 120, duracao: 60 },
  { id: 4, nome: "Micropigmentação", preco: 350, duracao: 120 },
  { id: 5, nome: "Combo Completo", preco: 95, duracao: 60 },
];

const listaServicosEl = document.getElementById("lista-servicos");
const duracaoTotalEl = document.getElementById("duracao-total");
const valorTotalEl = document.getElementById("valor-total");
const resumoDuracaoEl = document.getElementById("resumo-duracao");
const resumoValorEl = document.getElementById("resumo-valor");
const calendarEl = document.getElementById("calendar");
const selectedDateText = document.getElementById("selected-date-text");
const horariosGrid = document.getElementById("horarios-grid");

let selecionados = new Set();
let selectedDate = null;
let selectedHorario = null;

function renderServicos() {
  listaServicosEl.innerHTML = "";

  servicos.forEach(s => {
    const card = document.createElement("div");
    card.className = "card-servico";
    card.dataset.id = s.id;

    card.innerHTML = `
      <div>
        <h6>${s.nome}</h6>
        <small>${s.duracao} min — R$ ${s.preco.toFixed(2)}</small>
      </div>
    `;

    card.addEventListener("click", () => toggleServico(s.id, card));
    listaServicosEl.appendChild(card);
  });
}

function toggleServico(id, card) {
  if (selecionados.has(id)) {
    selecionados.delete(id);
    card.classList.remove("selecionado");
  } else {
    selecionados.add(id);
    card.classList.add("selecionado");
  }

  atualizarResumo();
}

function atualizarResumo() {
  let dur = 0;
  let val = 0;

  selecionados.forEach(id => {
    const s = servicos.find(x => x.id === id);
    dur += s.duracao;
    val += s.preco;
  });

  duracaoTotalEl.textContent = dur;
  valorTotalEl.textContent = `R$ ${val.toFixed(2).replace(".", ",")}`;
  resumoDuracaoEl.textContent = `${dur} min`;
  resumoValorEl.textContent = `R$ ${val.toFixed(2).replace(".", ",")}`;
}

// ---------------------------- CALENDÁRIO ----------------------------

function buildCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const startDay = first.getDay();

  // Cabeçalho
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  days.forEach(d => {
    const el = document.createElement("div");
    el.textContent = d;
    el.classList.add("small", "text-muted", "text-center");
    calendarEl.appendChild(el);
  });

  // Espaços vazios
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    calendarEl.appendChild(empty);
  }

  // Dias do mês
  for (let d = 1; d <= last.getDate(); d++) {
    const el = document.createElement("div");
    el.className = "calendar-day";
    el.textContent = d;

    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    el.addEventListener("click", () => {
      document.querySelectorAll(".calendar-day").forEach(x => x.classList.remove("selected"));
      el.classList.add("selected");
      selectedDate = dateStr;
      selectedDateText.textContent = `Data selecionada: ${dateStr}`;
      renderHorarios();
    });

    calendarEl.appendChild(el);
  }
}

// ---------------------------- HORÁRIOS ----------------------------

const horarios = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"];

function renderHorarios() {
  horariosGrid.innerHTML = "";

  horarios.forEach(h => {
    const btn = document.createElement("button");
    btn.textContent = h;
    btn.className = "btn btn-light";

    btn.addEventListener("click", () => {
      horariosGrid.querySelectorAll("button").forEach(b => b.classList.remove("btn-ativo"));
      btn.classList.add("btn-ativo");

      selectedHorario = h;
      abrirModal();
    });

    horariosGrid.appendChild(btn);
  });
}

// ---------------------------- MODAL ----------------------------

function abrirModal() {
  if (selecionados.size === 0) {
    alert("Selecione pelo menos 1 serviço!");
    return;
  }

  const servs = [...selecionados].map(id => servicos.find(s => s.id === id).nome);
  const total = [...selecionados].reduce((soma, id) => soma + servicos.find(s => s.id === id).preco, 0);

  document.getElementById("confirmaData").textContent = selectedDate;
  document.getElementById("confirmaHorario").textContent = selectedHorario;
  document.getElementById("confirmaServico").textContent = servs.join(", ");
  document.getElementById("confirmaTotal").textContent = total.toFixed(2).replace(".", ",");

  new bootstrap.Modal(document.getElementById("modalConfirmar")).show();
}

function confirmarAgendamento() {
  const nome = document.getElementById("nome").value.trim();
  const tel = document.getElementById("telefone").value.trim();

  if (!nome || !tel) {
    alert("Preencha nome e telefone!");
    return;
  }

  alert("Agendamento confirmado!");
}

// ---------------------------- INICIAR ----------------------------

renderServicos();
atualizarResumo();
buildCalendar();
