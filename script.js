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
  const action = form.getAttribute("action") || "";

  // Mientras no se configure Formspree/Google Forms, evitamos un envío roto
  // y mostramos el mensaje de instrucciones.
  if (action.includes("YOUR_FORM_ID")) {
    event.preventDefault();
    showModal();
    return;
  }

  event.preventDefault();

  try {
    const response = await fetch(action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      form.reset();
      showModal();
    } else {
      alert("No se pudo enviar la inscripción. Revisa los datos o inténtalo de nuevo.");
    }
  } catch (error) {
    alert("No se pudo enviar la inscripción. Comprueba tu conexión e inténtalo de nuevo.");
  }
});
