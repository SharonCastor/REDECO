document.addEventListener('DOMContentLoaded', () => {
  obtenerInstituciones();

  const formulario = document.getElementById('formulario');
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const estado = document.getElementById('estado').value;
    const tipo = document.getElementById('tipo').value;

    await fetch('http://localhost:3000/api/instituciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, estado, tipo })
    });

    formulario.reset();
    obtenerInstituciones();
  });
});

async function obtenerInstituciones() {
  const respuesta = await fetch('http://localhost:3000/api/instituciones');
  const instituciones = await respuesta.json();

  const lista = document.getElementById('lista-instituciones');
  const total = document.getElementById('total');
  lista.innerHTML = '';
  total.textContent = instituciones.length;

  instituciones.forEach(inst => {
    const elemento = document.createElement('li');
    elemento.innerHTML = `
      <strong>${inst.nombre}</strong> - ${inst.estado} (${inst.tipo}) - Registrado: ${inst.fecha_registro}
      <button onclick="eliminarInstitucion(${inst.id})">Eliminar</button>
      <button onclick="editarInstitucion(${inst.id}, '${inst.nombre}', '${inst.estado}', '${inst.tipo}')">Editar</button>
    `;
    lista.appendChild(elemento);
  });
}

async function eliminarInstitucion(id) {
  if (!confirm('¿Estás segura de eliminar esta institución?')) return;

  await fetch(`http://localhost:3000/api/instituciones/${id}`, {
    method: 'DELETE'
  });

  obtenerInstituciones();
}

function editarInstitucion(id, nombre, estado, tipo) {
  const nuevoNombre = prompt('Nuevo nombre:', nombre);
  const nuevoEstado = prompt('Nuevo estado:', estado);
  const nuevoTipo = prompt('Nuevo tipo:', tipo);

  if (nuevoNombre && nuevoEstado && nuevoTipo) {
    fetch(`http://localhost:3000/api/instituciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nuevoNombre,
        estado: nuevoEstado,
        tipo: nuevoTipo
      })
    }).then(() => obtenerInstituciones());
  }
}
