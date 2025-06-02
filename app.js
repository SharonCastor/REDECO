const lista = document.getElementById('lista');
const formulario = document.getElementById('formulario');
const contador = document.getElementById('contador');
const busqueda = document.getElementById('busqueda');

let filtro = '';

const obtenerInstituciones = async () => {
  const res = await fetch(`http://localhost:3000/api/instituciones?filtro=${encodeURIComponent(filtro)}`);
  const data = await res.json();
  lista.innerHTML = '';
  contador.textContent = data.length;

  data.forEach(inst => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${inst.nombre}</strong> - ${inst.estado} (${inst.tipo}) - Registrado: ${inst.fecha_registro}
      <button onclick="eliminarInstitucion(${inst.id})">Eliminar</button>
      <button onclick="editarInstitucion(${inst.id}, '${inst.nombre}', '${inst.estado}', '${inst.tipo}')">Editar</button>
    `;
    lista.appendChild(li);
  });
};

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

busqueda.addEventListener('input', (e) => {
  filtro = e.target.value;
  obtenerInstituciones();
});

const eliminarInstitucion = async (id) => {
  if (!confirm('¿Eliminar esta institución?')) return;
  await fetch(`http://localhost:3000/api/instituciones/${id}`, { method: 'DELETE' });
  obtenerInstituciones();
};

const editarInstitucion = (id, nombre, estado, tipo) => {
  const nuevoNombre = prompt('Nuevo nombre:', nombre);
  const nuevoEstado = prompt('Nuevo estado:', estado);
  const nuevoTipo = prompt('Nuevo tipo:', tipo);
  if (!nuevoNombre || !nuevoEstado || !nuevoTipo) return;

  fetch(`http://localhost:3000/api/instituciones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: nuevoNombre,
      estado: nuevoEstado,
      tipo: nuevoTipo
    })
  }).then(obtenerInstituciones);
};

obtenerInstituciones();
