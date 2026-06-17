const CONFIG = window.TOURNAMENT_CONFIG;

const form = document.querySelector("#registrationForm");
const modal = document.querySelector("#successModal");
const closeModal = document.querySelector(".modal-close");
const submitButton = document.querySelector("#submitButton");

const registeredTeamsContainer = document.querySelector("#registeredTeams");
const registeredCount = document.querySelector("#registeredCount");
const availableCount = document.querySelector("#availableCount");
const maxTeams = document.querySelector("#maxTeams");

const DEFAULT_SUBMIT_TEXT = "Enviar inscripción";
const LOADING_SUBMIT_TEXT = "Enviando inscripción...";

if (form) {
  form.action = CONFIG.registrationsApi;
}

if (maxTeams) {
  maxTeams.textContent = CONFIG.maxTeams;
}

function setSubmitLoading(isLoading) {
  if (!submitButton) return;

  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? LOADING_SUBMIT_TEXT : DEFAULT_SUBMIT_TEXT;
}

function showModal() {
  modal.hidden = false;
}

function hideModal() {
  modal.hidden = true;
  setSubmitLoading(false);

  setTimeout(() => {
    loadRegisteredTeams();
  }, 300);
}

closeModal?.addEventListener("click", hideModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!CONFIG.registrationsApi) {
    alert("El formulario todavía no está conectado a Google Sheets.");
    return;
  }

  setSubmitLoading(true);

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    data.type = "team";

      await fetch(CONFIG.registrationsApi, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
    });

    form.reset();
    showModal();

    setTimeout(() => {
      loadRegisteredTeams();
    }, 300);
  } catch (error) {
    setSubmitLoading(false);
    alert("No se pudo enviar la inscripción. Comprueba tu conexión e inténtalo de nuevo.");
  }
});

function renderEmptyState() {
  if (!registeredTeamsContainer) return;

  registeredTeamsContainer.innerHTML = `
    <div class="team-card pending">
      <div class="team-info">
        <span class="team-number">1</span>
        <span class="team-name">¡Sé la primera pareja inscrita!</span>
      </div>
      <span class="team-status">Disponible</span>
    </div>
  `;
}

async function loadRegisteredTeams() {
  if (!registeredTeamsContainer || !CONFIG.registrationsApi) return;

  try {
    const response = await fetch(CONFIG.registrationsApi);
    const teams = await response.json();

    if (registeredCount) {
      registeredCount.textContent = teams.length;
    }

    if (availableCount) {
      availableCount.textContent = Math.max(CONFIG.maxTeams - teams.length, 0);
    }

    if (teams.length === 0) {
      renderEmptyState();
      return;
    }

    registeredTeamsContainer.innerHTML = "";

    teams.forEach((team) => {
      const status = (team.status || "").toLowerCase();

      let cssClass = "pending";
      let statusText = "Pendiente";

      if (status.includes("confirm")) {
        cssClass = "confirmed";
        statusText = "Confirmado";
      } else if (status.includes("deneg")) {
        cssClass = "denied";
        statusText = "Denegado";
      }

      const card = document.createElement("div");
      card.className = `team-card ${cssClass}`;

      card.innerHTML = `
        <div class="team-info">
          <span class="team-number">${team.number}</span>
          <span class="team-name">${team.player1} / ${team.player2}</span>
        </div>
        <span class="team-status">${statusText}</span>
      `;

      registeredTeamsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("No se pudieron cargar las parejas registradas", error);
  }
}

window.addEventListener("scroll", () => {
  const button = document.querySelector(".back-to-top");

  if (window.scrollY > 700) {
    button.classList.add("visible");
  } else {
    button.classList.remove("visible");
  }
});

loadRegisteredTeams();

const freeAgentForm = document.querySelector("#freeAgentForm");
const freeAgentsList = document.querySelector("#freeAgentsList");
const freeAgentButton = document.querySelector("#freeAgentButton");

freeAgentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!freeAgentForm.checkValidity()) {
    freeAgentForm.reportValidity();
    return;
  }

  freeAgentButton.disabled = true;
  freeAgentButton.textContent = "Publicando...";

  const formData = new FormData(freeAgentForm);
  const data = Object.fromEntries(formData.entries());

  data.type = "freeAgent";

  try {
    await fetch(CONFIG.registrationsApi, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
    });

    freeAgentForm.reset();

    setTimeout(() => {
      loadFreeAgents();
    }, 300);

  } finally {
    freeAgentButton.disabled = false;
    freeAgentButton.textContent = "Buscar pareja";
  }
});

async function loadFreeAgents() {
  if (!freeAgentsList || !CONFIG.registrationsApi) return;

  try {
    const response = await fetch(`${CONFIG.registrationsApi}?type=freeAgents`);
    const players = await response.json();

    freeAgentsList.innerHTML = "";

    if (players.length === 0) {
      freeAgentsList.innerHTML = `
        <div class="team-card pending">
          <div class="team-info">
            <span class="team-number">🏐</span>
            <span class="team-name">Todavía no hay jugadores buscando pareja.</span>
          </div>
        </div>
      `;
      return;
    }

    players.forEach((player) => {

      if (!player.name) return;

      const card = document.createElement("div");
      card.className = "team-card pending";

      card.innerHTML = `
        <div class="team-info free-agent-info">
          <span class="team-number">🏐</span>

          <span class="team-name">
            ${player.name}<br>
            <span class="free-agent-meta">
              ${player.role || "Me adapto"} · ${player.side || "Me da igual"}
            </span>

            ${
              player.comment
                ? `<span class="free-agent-comment">“${player.comment}”</span>`
                : ""
            }
          </span>
        </div>
      `;

      freeAgentsList.appendChild(card);
    });
  } catch (error) {
    console.error("No se pudieron cargar los free agents", error);
  }
}

loadFreeAgents();