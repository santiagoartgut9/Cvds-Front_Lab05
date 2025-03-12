const apiBase = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
    cargarLaboratorios();
    agregarAnimaciones();
});

async function cargarLaboratorios() {
    const response = await fetch(`${apiBase}/laboratorios`);
    const laboratorios = await response.json();

    ["laboratorioSelect", "laboratorioReserva"].forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = "";
        laboratorios.forEach(lab => {
            const option = document.createElement("option");
            option.value = lab.id;
            option.textContent = lab.nombre;
            select.appendChild(option);
        });
    });
}

async function consultarDisponibilidad() {
    const idLab = document.getElementById("laboratorioSelect").value;
    const fecha = document.getElementById("fechaConsulta").value;
    const hora = document.getElementById("horaConsulta").value;
    const banner = document.querySelector("#consultaForm").closest(".banner");

    const response = await fetch(`${apiBase}/reservas`);
    const reservas = await response.json();

    const reservada = reservas.some(r =>
        r.idLaboratorio === idLab &&
        r.fecha === fecha &&
        r.horaInicio <= hora &&
        r.horaFin > hora
    );

    mostrarNotificacion(reservada ? "El laboratorio está reservado." : "El laboratorio está disponible.", banner);
}

async function reservarLaboratorio() {
    const reserva = {
        idLaboratorio: document.getElementById("laboratorioReserva").value,
        fecha: document.getElementById("fechaReserva").value,
        horaInicio: document.getElementById("horaInicioReserva").value,
        horaFin: document.getElementById("horaFinReserva").value,
        proposito: document.getElementById("propositoReserva").value,
        usuario: document.getElementById("usuarioReserva").value,
        estado: "Confirmada"
    };

    const banner = document.querySelector("#reservaForm").closest(".banner");

    const response = await fetch(`${apiBase}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva)
    });

    mostrarNotificacion(response.ok ? "Reserva creada con éxito!" : "Error al crear la reserva", banner);
}

async function cancelarReserva() {
    const id = document.getElementById("idReservaCancelar").value;
    const banner = document.querySelector("#cancelarForm").closest(".banner");

    const response = await fetch(`${apiBase}/reservas/${id}`, {
        method: "DELETE"
    });

    mostrarNotificacion(response.ok ? "Reserva cancelada!" : "Error al cancelar", banner);
}

function mostrarNotificacion(mensaje, banner) {
    const notificacionExistente = banner.querySelector(".notificacion");
    if (notificacionExistente) {
        notificacionExistente.remove();
    }

    const notificacion = document.createElement("div");
    notificacion.className = "notificacion";
    notificacion.innerHTML = `<span>${mensaje}</span> <button onclick="this.parentElement.remove()">✖</button>`;

    banner.appendChild(notificacion);

    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

function agregarAnimaciones() {
    document.querySelectorAll(".banner").forEach(banner => {
        banner.style.opacity = 0;
        banner.style.transform = "translateY(20px)";
        setTimeout(() => {
            banner.style.transition = "all 0.5s ease-out";
            banner.style.opacity = 1;
            banner.style.transform = "translateY(0)";
        }, 300);
    });
}