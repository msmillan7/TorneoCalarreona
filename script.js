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