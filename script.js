const form = document.querySelector("#registrationForm");
const modal = document.querySelector("#successModal");
const closeModal = document.querySelector(".modal-close");

function showModal() {
  modal.hidden = false;
}

function hideModal() {
  modal.hidden = true;
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

  const action = form.getAttribute("action") || "";

  if (!action || action.includes("YOUR_FORM_ID")) {
    alert("El formulario todavía no está conectado a Google Sheets.");
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    await fetch(action, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
    });

    form.reset();
    showModal();
  } catch (error) {
    alert("No se pudo enviar la inscripción. Comprueba tu conexión e inténtalo de nuevo.");
  }
});

const registrationsUrl = form?.getAttribute("action");

async function loadRegisteredTeams() {
  const container = document.querySelector("#registeredTeams");
  const registeredCount = document.querySelector("#registeredCount");
  const availableCount = document.querySelector("#availableCount");

  if (!container || !registrationsUrl) return;

  try {
    const response = await fetch(registrationsUrl);
    const teams = await response.json();

    registeredCount.textContent = teams.length;
    availableCount.textContent = Math.max(20 - teams.length, 0);

    if (teams.length === 0) {
      return;
    }

    container.innerHTML = "";

    teams.forEach((team) => {
      const isConfirmed = team.status.toLowerCase().includes("confirm");

      const card = document.createElement("div");
      card.className = `team-card ${isConfirmed ? "confirmed" : "pending"}`;

      card.innerHTML = `
        <div class="team-info">
          <span class="team-number">${team.number}</span>
          <span class="team-name">${team.player1} / ${team.player2}</span>
        </div>
        <span class="team-status">${isConfirmed ? "Confirmado" : "Pendiente"}</span>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("No se pudieron cargar las parejas registradas", error);
  }
}

loadRegisteredTeams();