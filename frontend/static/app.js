const apiBase = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", cargarLaboratorios);

async function cargarLaboratorios() {
    try {
        const response = await fetch(`${apiBase}/laboratorios`);
        if (!response.ok) throw new Error("Error al obtener los laboratorios");

        const laboratorios = await response.json();

        ["laboratorioSelect", "laboratorioReserva"].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = "<option value=''>Seleccione un laboratorio</option>";
            laboratorios.forEach(lab => {
                const option = document.createElement("option");
                option.value = lab.id;
                option.textContent = lab.nombre;
                select.appendChild(option);
            });
        });
    } catch (error) {
        mostrarNotificacion("Error al cargar los laboratorios", "error");
    }
}

async function consultarDisponibilidad() {
    const idLab = document.getElementById("laboratorioSelect").value;
    const fecha = document.getElementById("fechaConsulta").value;
    const hora = document.getElementById("horaConsulta").value;

    if (!idLab || !fecha || !hora) {
        mostrarNotificacion("Por favor, complete todos los campos.", "warning");
        return;
    }

    try {
        const response = await fetch(`${apiBase}/reservas`);
        if (!response.ok) throw new Error("Error al obtener reservas");

        const reservas = await response.json();
        const fechaIngresada = new Date(fecha).toISOString().split("T")[0];
        const reservada = reservas.some(r =>
            r.idLaboratorio === idLab &&
            r.fecha.split("T")[0] === fechaIngresada &&
            r.horaInicio <= hora &&
            r.horaFin > hora
        );

        mostrarNotificacion(reservada ? "El laboratorio está reservado." : "El laboratorio está disponible.", reservada ? "info" : "success");
    } catch (error) {
        mostrarNotificacion("No se pudo verificar la disponibilidad.", "error");
    }
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

    if (!reserva.idLaboratorio || !reserva.fecha || !reserva.horaInicio || !reserva.horaFin || !reserva.proposito || !reserva.usuario) {
        mostrarNotificacion("Por favor, complete todos los campos.", "warning");
        return;
    }

    try {
        const response = await fetch(`${apiBase}/reservas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reserva)
        });

        if (!response.ok) throw new Error("Error al crear la reserva");
        mostrarNotificacion("Reserva creada con éxito!", "success");
    } catch (error) {
        mostrarNotificacion("No se pudo crear la reserva.", "error");
    }
}

async function cancelarReserva() {
    const id = document.getElementById("idReservaCancelar").value;

    if (!id) {
        mostrarNotificacion("Por favor, ingrese el ID de la reserva.", "warning");
        return;
    }

    try {
        const response = await fetch(`${apiBase}/reservas/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Error al cancelar la reserva");
        mostrarNotificacion("Reserva cancelada con éxito!", "success");
    } catch (error) {
        mostrarNotificacion("No se pudo cancelar la reserva.", "error");
    }
}

function mostrarNotificacion(mensaje, tipo) {
    Swal.fire({
        text: mensaje,
        icon: tipo,
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000
    });
}