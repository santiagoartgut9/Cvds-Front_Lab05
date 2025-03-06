const apiBase = "http://localhost:8080";  // Ajusta el puerto si es diferente

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

    const response = await fetch(`${apiBase}/reservas`);
    const reservas = await response.json();

    const reservada = reservas.some(r =>
        r.idLaboratorio === idLab &&
        r.fecha === fecha &&
        r.horaInicio <= hora &&
        r.horaFin > hora
    );

    alert(reservada ? "El laboratorio está reservado." : "El laboratorio está disponible.");
}

async function reservarLaboratorio() {
    const reserva = {
        idLaboratorio: document.getElementById("laboratorioReserva").value,
        fecha: document.getElementById("fechaReserva").value,           // YYYY-MM-DD
        horaInicio: document.getElementById("horaInicioReserva").value, // HH:mm
        horaFin: document.getElementById("horaFinReserva").value,       // HH:mm
        proposito: document.getElementById("propositoReserva").value,
        usuario: document.getElementById("usuarioReserva").value,
        estado: "Confirmada"
    };

    const response = await fetch(`${apiBase}/reservas`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reserva)
    });
    console.log(response)

    alert(response.ok ? "Reserva creada con éxito!" : "Error al crear la reserva");
}

async function cancelarReserva() {
    const id = document.getElementById("idReservaCancelar").value;

    const response = await fetch(`${apiBase}/reservas/${id}`, {
        method: "DELETE"
    });

    alert(response.ok ? "Reserva cancelada!" : "Error al cancelar");
}

document.addEventListener("DOMContentLoaded", cargarLaboratorios);
