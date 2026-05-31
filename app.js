// =============================================
//   SISTEMA DE CONTROL DE ROLES
//   Unidad Video Diagnóstica de la Mujer
// =============================================

const USUARIOS = {
  "paciente@uvdm.com":  { pass:"123456", nombre:"María García",      rol:"paciente",      iniciales:"MG", email:"maria.garcia@email.com" },
  "recepcion@uvdm.com": { pass:"123456", nombre:"Juan Pérez",        rol:"recepcionista", iniciales:"JP", email:"recepcion@uvdm.com" },
  "doctora@uvdm.com":   { pass:"123456", nombre:"Dra. Carmen López", rol:"ginecologa",    iniciales:"CL", email:"doctora@uvdm.com" },
  "admin@uvdm.com":     { pass:"123456", nombre:"Admin Sistema",     rol:"admin",         iniciales:"AD", email:"admin@uvdm.com" }
};

const PERMISOS = {
  paciente: {
    secciones: ["inicio","citas","perfil"],
    verPacientes:false, verMedicos:false, verReportes:false, verUsuarios:false,
    puedeAgendarCita:true, verSoloPropiasCitas:true,
    mostrarBtnNuevoPaciente:false,
    labelRol:"Paciente", colorRol:"azul",
    bienvenidaTitulo:"Bienvenida",
    bienvenidaSub:"Gestiona tus citas médicas desde aquí",
    stats:[
      { num:"2", label:"Próximas Citas", icono:"📅", color:"azul" },
      { num:"3", label:"Total Citas",    icono:"🕐", color:"verde" }
    ]
  },
  recepcionista: {
    secciones:["inicio","pacientes","citas","medicos","reportes","perfil"],
    verPacientes:true, verMedicos:true, verReportes:true, verUsuarios:false,
    puedeAgendarCita:true, verSoloPropiasCitas:false,
    mostrarBtnNuevoPaciente:false,
    labelRol:"Recepcionista", colorRol:"verde",
    bienvenidaTitulo:"Panel de Recepción",
    bienvenidaSub:"Gestión de citas y recepción de pacientes",
    stats:[
      { num:"5",  label:"Citas Hoy",   icono:"📅", color:"azul"   },
      { num:"12", label:"Esta Semana", icono:"📋", color:"verde"  },
      { num:"4",  label:"Doctoras",    icono:"👩‍⚕️", color:"morado" }
    ]
  },
  ginecologa: {
    secciones:["inicio","pacientes","citas","perfil"],
    verPacientes:true, verMedicos:false, verReportes:false, verUsuarios:false,
    puedeAgendarCita:false, verSoloPropiasCitas:true,
    mostrarBtnNuevoPaciente:false,
    labelRol:"Ginecóloga", colorRol:"morado",
    bienvenidaTitulo:"Mi Agenda Médica",
    bienvenidaSub:"Dra. Carmen López — Ginecología · Colposcopía",
    stats:[
      { num:"3",  label:"Citas Hoy",     icono:"📅", color:"azul"   },
      { num:"18", label:"Pacientes Mes", icono:"👥", color:"verde"  },
      { num:"2",  label:"Pendientes",    icono:"⏳", color:"naranja" }
    ]
  },
  admin: {
    secciones:["inicio","pacientes","citas","medicos","reportes","usuarios","perfil"],
    verPacientes:true, verMedicos:true, verReportes:true, verUsuarios:true,
    puedeAgendarCita:true, verSoloPropiasCitas:false,
    mostrarBtnNuevoPaciente:true,
    labelRol:"Administrador", colorRol:"rojo",
    bienvenidaTitulo:"Panel Administrativo",
    bienvenidaSub:"Control total del sistema",
    stats:[
      { num:"5",   label:"Citas Hoy", icono:"📅", color:"azul"   },
      { num:"98",  label:"Pacientes", icono:"👥", color:"verde"  },
      { num:"4",   label:"Doctoras",  icono:"👩‍⚕️", color:"morado" },
      { num:"$45k",label:"Ingresos",  icono:"💰", color:"naranja" }
    ]
  }
};

// ===== CUPS ginecológicos frecuentes =====
const CUPS_DATA = [
  { codigo:"890301", desc:"Consulta de primera vez por medicina general" },
  { codigo:"890302", desc:"Consulta de control o seguimiento por medicina general" },
  { codigo:"890401", desc:"Consulta de primera vez por medicina especializada - Ginecología" },
  { codigo:"890402", desc:"Consulta de control por medicina especializada - Ginecología" },
  { codigo:"572200", desc:"Colposcopía" },
  { codigo:"880142", desc:"Ecografía pélvica transvaginal" },
  { codigo:"880143", desc:"Ecografía obstétrica" },
  { codigo:"572300", desc:"Biopsia de cuello uterino" },
  { codigo:"880151", desc:"Ecografía de mama bilateral" },
  { codigo:"572100", desc:"Citología cérvico-uterina" },
  { codigo:"572001", desc:"Conización del cuello uterino" },
  { codigo:"880161", desc:"Ecografía de tejidos blandos" },
];

// ===== CIE-10 ginecológicos frecuentes =====
const CIE10_DATA = [
  { codigo:"N87",   desc:"Displasia del cuello uterino" },
  { codigo:"N87.0", desc:"Displasia leve del cuello uterino (NIC I)" },
  { codigo:"N87.1", desc:"Displasia moderada del cuello uterino (NIC II)" },
  { codigo:"N87.2", desc:"Displasia grave del cuello uterino (NIC III)" },
  { codigo:"C53",   desc:"Tumor maligno del cuello del útero" },
  { codigo:"N92",   desc:"Menstruación excesiva, frecuente e irregular" },
  { codigo:"N80",   desc:"Endometriosis" },
  { codigo:"N83",   desc:"Trastornos no inflamatorios del ovario, trompa uterina y ligamento ancho" },
  { codigo:"N39.0", desc:"Infección de vías urinarias, sitio no especificado" },
  { codigo:"O00",   desc:"Embarazo ectópico" },
  { codigo:"Z34",   desc:"Supervisión de embarazo normal" },
  { codigo:"N76",   desc:"Otras inflamaciones de la vagina y de la vulva" },
  { codigo:"N70",   desc:"Salpingitis y ooforitis" },
  { codigo:"N91",   desc:"Menstruación ausente, escasa o rara" },
  { codigo:"N94",   desc:"Dolor y otras afecciones relacionadas con órganos genitales femeninos" },
  { codigo:"N60",   desc:"Displasia mamaria benigna" },
  { codigo:"D25",   desc:"Leiomioma del útero (mioma)" },
  { codigo:"Z12.4", desc:"Examen especial de detección de neoplasia del cuello uterino" },
];

// ===== DATOS =====
let PACIENTES = [
  { id:1, nombre:"María García",   iniciales:"MG", color:"azul",   email:"maria.garcia@email.com",   tel:"+57 300 123 4567", ultimaCita:"15 Abr 2026", eps:"Sura",         tipo:"Contributivo" },
  { id:2, nombre:"Laura Pérez",    iniciales:"LP", color:"verde",  email:"laura.perez@email.com",    tel:"+57 310 234 5678", ultimaCita:"22 Abr 2026", eps:"Colmédica",    tipo:"Contributivo" },
  { id:3, nombre:"Ana Martínez",   iniciales:"AM", color:"morado", email:"ana.martinez@email.com",   tel:"+57 320 345 6789", ultimaCita:"28 Abr 2026", eps:"Nueva EPS",    tipo:"Subsidiado"   },
  { id:4, nombre:"Sofía Ramírez",  iniciales:"SR", color:"naranja",email:"sofia.ramirez@email.com",  tel:"+57 311 456 7890", ultimaCita:"10 May 2026", eps:"Sanitas",      tipo:"Contributivo" },
];

let USUARIOS_SISTEMA = [
  { id:1, nombre:"Dra. María González", iniciales:"MG", color:"azul",   rol:"ginecologa",    rolLabel:"Ginecóloga",    especialidad:"Obstetricia",  email:"maria.gonzalez@uvdm.com", estado:"activo" },
  { id:2, nombre:"Dra. Carmen López",   iniciales:"CL", color:"verde",  rol:"ginecologa",    rolLabel:"Ginecóloga",    especialidad:"Colposcopía",  email:"carmen.lopez@uvdm.com",   estado:"activo" },
  { id:3, nombre:"Juan Pérez",          iniciales:"JP", color:"naranja",rol:"recepcionista", rolLabel:"Recepcionista", especialidad:"—",            email:"juan.perez@uvdm.com",     estado:"activo" },
  { id:4, nombre:"Admin Demo",          iniciales:"AD", color:"rojo",   rol:"admin",         rolLabel:"Administrador", especialidad:"—",            email:"admin@uvdm.com",          estado:"activo" },
];

let CITAS = [
  { id:1, paciente:"María García",  doctora:"Dra. Carmen López",   especialidad:"Ginecología - Colposcopía", fecha:"25 May 2026", hora:"10:00 AM", estado:"proxima",    tipo:"Colposcopía",     whatsapp:"+57 300 123 4567" },
  { id:2, paciente:"Laura Pérez",   doctora:"Dra. María González", especialidad:"Ginecología - Obstetricia", fecha:"28 May 2026", hora:"15:30 PM", estado:"proxima",    tipo:"Obstetricia",     whatsapp:"+57 310 234 5678" },
  { id:3, paciente:"María García",  doctora:"Dra. Ana Martínez",   especialidad:"Ginecología - Ecografía",   fecha:"15 Abr 2026", hora:"11:00 AM", estado:"completada", tipo:"Ecografía",       whatsapp:"+57 300 123 4567" },
  { id:4, paciente:"Ana Martínez",  doctora:"Dra. Carmen López",   especialidad:"Ginecología - Colposcopía", fecha:"30 May 2026", hora:"09:00 AM", estado:"proxima",    tipo:"Colposcopía",     whatsapp:"+57 320 345 6789" },
  { id:5, paciente:"Sofía Ramírez", doctora:"Dra. Laura Fernández",especialidad:"Ginecología - Mastología",  fecha:"02 Jun 2026", hora:"08:30 AM", estado:"proxima",    tipo:"Mastología",      whatsapp:"+57 311 456 7890" },
];

// Historias clínicas guardadas { citaId: { ...datos } }
let HISTORIAS_CLINICAS = {};

let siguienteIdCita = 6;
let usuarioActual   = null;

// =============================================
//   UTILIDADES
// =============================================
function mostrarToast(msg, tipo = "verde") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast visible " + tipo;
  setTimeout(() => { t.className = "toast"; }, 3000);
}

// =============================================
//   AUTENTICACIÓN
// =============================================
function iniciarSesion() {
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value.trim();
  const error = document.getElementById("login-error");
  if (!email || !pass) { error.textContent = "Por favor ingresa tu email y contraseña."; return; }
  const usuario = USUARIOS[email];
  if (!usuario || usuario.pass !== pass) { error.textContent = "Email o contraseña incorrectos."; return; }
  error.textContent = "";
  cargarApp(usuario);
}

function loginRapido(rol) {
  const mapa = { paciente:"paciente@uvdm.com", recepcionista:"recepcion@uvdm.com", ginecologa:"doctora@uvdm.com", admin:"admin@uvdm.com" };
  cargarApp(USUARIOS[mapa[rol]]);
}

function cerrarSesion() {
  usuarioActual = null;
  document.getElementById("pantalla-login").classList.add("activa");
  document.getElementById("pantalla-app").classList.remove("activa");
  document.getElementById("login-email").value = "";
  document.getElementById("login-pass").value  = "";
}

// =============================================
//   CARGAR APP
// =============================================
function cargarApp(usuario) {
  usuarioActual = usuario;
  const permisos = PERMISOS[usuario.rol];
  document.getElementById("pantalla-login").classList.remove("activa");
  document.getElementById("pantalla-app").classList.add("activa");
  const badge = document.getElementById("badge-rol");
  badge.textContent = permisos.labelRol;
  badge.className   = "badge-rol " + permisos.colorRol;
  document.getElementById("btn-header-cita").style.display = permisos.puedeAgendarCita ? "block" : "none";
  aplicarPermisosNav(permisos, usuario.rol);
  llenarInicio(permisos, usuario);
  llenarCitas(permisos, usuario);
  llenarPacientes();
  llenarUsuariosSistema();
  llenarPerfil(usuario);
  mostrarSeccion("inicio");
}

// =============================================
//   PERMISOS NAV
// =============================================
function aplicarPermisosNav(permisos, rol) {
  const show = (id, visible, tipo = "block") => {
    const el = document.getElementById(id);
    if (el) el.style.display = visible ? tipo : "none";
  };
  show("nav-li-pacientes",  permisos.verPacientes, "block");
  show("nav-inf-pacientes", permisos.verPacientes, "flex");
  show("nav-li-medicos",    permisos.verMedicos,   "block");
  show("nav-inf-medicos",   permisos.verMedicos,   "flex");
  show("nav-li-reportes",   permisos.verReportes,  "block");
  show("nav-inf-reportes",  permisos.verReportes,  "flex");
  show("nav-li-usuarios",   permisos.verUsuarios,  "block");
  show("nav-inf-usuarios",  permisos.verUsuarios,  "flex");
  show("btn-nuevo-paciente", permisos.mostrarBtnNuevoPaciente, "inline-flex");
  show("campo-paciente-modal", (rol === "admin" || rol === "recepcionista"), "block");
  // Botón nueva cita en sección citas: solo si puede agendar
  const btnSecCita = document.getElementById("btn-sec-nueva-cita");
  if (btnSecCita) btnSecCita.style.display = permisos.puedeAgendarCita ? "block" : "none";
}

// =============================================
//   INICIO
// =============================================
function llenarInicio(permisos, usuario) {
  document.getElementById("bienvenida-titulo").textContent = permisos.bienvenidaTitulo;
  document.getElementById("bienvenida-sub").textContent    = permisos.bienvenidaSub;
  const sc = document.getElementById("stats-container");
  sc.innerHTML = permisos.stats.map(s => `
    <div class="stat-card">
      <div class="stat-icono ${s.color}">${s.icono}</div>
      <div class="stat-num">${s.num}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join("");
  const lista = document.getElementById("lista-proximas-citas");
  lista.innerHTML = "";
  let citasMostrar = CITAS.filter(c => c.estado === "proxima");
  if (permisos.verSoloPropiasCitas && usuario.rol === "paciente") citasMostrar = citasMostrar.filter(c => c.paciente === usuario.nombre);
  if (permisos.verSoloPropiasCitas && usuario.rol === "ginecologa") citasMostrar = citasMostrar.filter(c => c.doctora === usuario.nombre);
  if (citasMostrar.length === 0) { lista.innerHTML = `<p style="color:#94a3b8;font-size:14px;text-align:center;padding:20px;">No hay próximas citas agendadas.</p>`; return; }
  citasMostrar.forEach(c => { lista.innerHTML += crearTarjetaCita(c, usuario.rol, true); });
}

// =============================================
//   CITAS
// =============================================
function llenarCitas(permisos, usuario) {
  const rol = usuario.rol;

  if (rol === "recepcionista") {
    // Mostrar panel recepción
    document.getElementById("panel-recepcion").style.display = "block";
    document.getElementById("lista-citas-normal").style.display = "none";
    const listaRec = document.getElementById("lista-todas-citas");
    listaRec.innerHTML = "";
    let citas = [...CITAS];
    citas.forEach(c => { listaRec.innerHTML += crearTarjetaCita(c, rol, false); });
    return;
  }

  // Para otros roles
  document.getElementById("panel-recepcion").style.display = "none";
  document.getElementById("lista-citas-normal").style.display = "flex";
  const lista = document.getElementById("lista-citas-normal");
  lista.innerHTML = "";
  let citasMostrar = [...CITAS];
  if (permisos.verSoloPropiasCitas && usuario.rol === "paciente") citasMostrar = citasMostrar.filter(c => c.paciente === usuario.nombre);
  if (permisos.verSoloPropiasCitas && usuario.rol === "ginecologa") citasMostrar = citasMostrar.filter(c => c.doctora === usuario.nombre);
  if (citasMostrar.length === 0) { lista.innerHTML = `<p style="color:#94a3b8;font-size:14px;text-align:center;padding:20px;">No hay citas registradas.</p>`; return; }
  citasMostrar.forEach(c => { lista.innerHTML += crearTarjetaCita(c, usuario.rol, false); });
}

// =============================================
//   TARJETA DE CITA (por rol)
// =============================================
function crearTarjetaCita(cita, rol, esInicio) {
  const esCompletada = cita.estado === "completada";
  const esCancelada  = cita.estado === "cancelada";
  const esRecepcionada = cita.estado === "recepcionada";
  const iniciales = cita.paciente.split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase();
  let acciones = "";

  if (!esCancelada) {
    if (rol === "recepcionista") {
      // Recepcionista: botón recepcionar en cada cita (lista izquierda del panel)
      acciones = `
        <div class="cita-acciones">
          ${!esCompletada && !esRecepcionada ? `<button class="btn-accion recepcionar" onclick="abrirPanelRecepcion(${cita.id})">🏥 Recepcionar</button>` : ""}
          ${!esCompletada ? `<button class="btn-accion whatsapp" onclick="abrirModalWA(${cita.id})">💬</button>` : ""}
          ${!esInicio ? `<button class="btn-accion editar" onclick="abrirModalEditar(${cita.id})">✏️</button>
          <button class="btn-accion eliminar" onclick="eliminarCita(${cita.id})">🗑️</button>` : ""}
        </div>`;
    } else if (rol === "admin") {
      acciones = `
        <div class="cita-acciones">
          ${!esCompletada && !esInicio ? `
            <button class="btn-accion whatsapp" onclick="abrirModalWA(${cita.id})">💬 Recordatorio</button>
            <button class="btn-accion reprogramar" onclick="abrirModalEditar(${cita.id})">🔄 Reprogramar</button>
            <button class="btn-accion cancelar" onclick="cancelarCita(${cita.id})">❌ Cancelar</button>
          ` : ""}
          ${!esInicio ? `<button class="btn-accion editar" onclick="abrirModalEditar(${cita.id})">✏️</button>
          <button class="btn-accion eliminar" onclick="eliminarCita(${cita.id})">🗑️</button>` : ""}
        </div>`;
    } else if (rol === "ginecologa") {
      // Ginecóloga: solo botón "Atender" → Historia Clínica (NO puede editar)
      if (!esCompletada) {
        acciones = `
          <div class="cita-acciones">
            <button class="btn-accion atender" onclick="abrirModalHC(${cita.id})">🩺 Atender</button>
          </div>`;
      }
    } else if (rol === "paciente" && !esCompletada && !esInicio) {
      acciones = `<div class="cita-acciones"><button class="btn-accion cancelar" onclick="cancelarCita(${cita.id})">❌ Cancelar</button></div>`;
    }
  }

  let estadoLabel = "Próxima";
  let estadoClase = "proxima";
  if (esCompletada)   { estadoLabel = "Completada";  estadoClase = "completada"; }
  if (esCancelada)    { estadoLabel = "Cancelada";   estadoClase = "cancelada";  }
  if (esRecepcionada) { estadoLabel = "Recepcionada"; estadoClase = "recepcionada"; }

  // Indicador de historia clínica guardada
  const tieneHC = HISTORIAS_CLINICAS[cita.id] ? `<span style="font-size:11px;background:#ede9fe;color:#5b21b6;padding:2px 7px;border-radius:12px;margin-left:6px;">📋 HC</span>` : "";

  return `
    <div class="cita-card ${esCompletada ? "completada" : ""} ${esCancelada ? "cancelada" : ""}" id="cita-card-${cita.id}">
      <div class="cita-info">
        <div class="avatar azul">${iniciales}</div>
        <div class="cita-detalle">
          <h4>${cita.paciente}${tieneHC}</h4>
          <p>${cita.tipo || cita.especialidad} — ${cita.doctora}</p>
          <div class="cita-fecha"><span>📅 ${cita.fecha}</span><span>🕐 ${cita.hora}</span></div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span class="badge-cita ${estadoClase}">${estadoLabel}</span>
        ${acciones}
      </div>
    </div>`;
}

// =============================================
//   PANEL RECEPCIÓN (solo recepcionista)
// =============================================
function abrirPanelRecepcion(citaId) {
  const cita = CITAS.find(c => c.id === citaId);
  if (!cita) return;

  // Marcar visualmente la cita seleccionada
  document.querySelectorAll(".cita-card").forEach(el => el.classList.remove("seleccionada"));
  const card = document.getElementById("cita-card-" + citaId);
  if (card) card.classList.add("seleccionada");

  // Datos del paciente
  const paciente = PACIENTES.find(p => p.nombre === cita.paciente) || {};

  // CUPS sugerido según tipo de cita
  const cupsSugerido = CUPS_DATA.find(c =>
    cita.tipo && c.desc.toLowerCase().includes(cita.tipo.toLowerCase().split("í")[0])
  ) || CUPS_DATA[3];

  // CIE10 sugerido
  const cie10Sugerido = CIE10_DATA.find(c =>
    cita.tipo && c.desc.toLowerCase().includes(cita.tipo.toLowerCase().split("í")[0])
  ) || CIE10_DATA[0];

  const panel = document.getElementById("recepcion-panel-detalle");
  panel.innerHTML = `
    <div class="recepcion-panel-header">
      <h3>🏥 Recepción de Paciente</h3>
      <p>Nro. Cita #${String(cita.id).padStart(6,"0")} — ${cita.fecha}</p>
    </div>

    <div class="recepcion-paciente-info">
      <div class="avatar azul" style="width:44px;height:44px;font-size:14px;">${cita.paciente.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase()}</div>
      <div>
        <div class="recepcion-pac-nombre">${cita.paciente}</div>
        <div class="recepcion-pac-sub">${cita.tipo} — ${cita.doctora}</div>
        <div style="font-size:11px;color:#64748b;margin-top:2px;">📅 ${cita.fecha} · 🕐 ${cita.hora}</div>
      </div>
    </div>

    <div class="recepcion-cuerpo">

      <!-- Datos aseguradora -->
      <div class="rec-seccion">
        <div class="rec-seccion-titulo">🏦 Aseguradora / EPS</div>
        <div class="rec-fila-dos">
          <div class="rec-campo">
            <label>EPS / Aseguradora</label>
            <input type="text" id="rec-eps" value="${paciente.eps || ""}" placeholder="EPS del paciente" />
          </div>
          <div class="rec-campo">
            <label>Tipo de Vinculación</label>
            <select id="rec-tipo-vinculacion">
              <option ${(paciente.tipo||"")=="Contributivo"?"selected":""}>Contributivo</option>
              <option ${(paciente.tipo||"")=="Subsidiado"?"selected":""}>Subsidiado</option>
              <option>Particular</option>
              <option>Convenio</option>
            </select>
          </div>
        </div>
        <div class="rec-fila-dos">
          <div class="rec-campo">
            <label>Nro. Autorización</label>
            <input type="text" id="rec-autorizacion" placeholder="Número de autorización" />
          </div>
          <div class="rec-campo">
            <label>Nro. Afiliado / Póliza</label>
            <input type="text" id="rec-afiliado" placeholder="Número de afiliado" />
          </div>
        </div>
      </div>

      <!-- Procedimiento / CUPS -->
      <div class="rec-seccion">
        <div class="rec-seccion-titulo">🔬 Procedimiento (CUPS)</div>
        <div class="rec-campo">
          <label>Código CUPS <span class="cups-codigo-badge" id="rec-cups-badge">${cupsSugerido.codigo}</span></label>
          <select id="rec-cups" onchange="actualizarCupsBadge()">
            ${CUPS_DATA.map(c => `<option value="${c.codigo}" ${c.codigo===cupsSugerido.codigo?"selected":""}>${c.desc}</option>`).join("")}
          </select>
        </div>
        <div class="rec-campo">
          <label>Cantidad</label>
          <input type="number" id="rec-cantidad" value="1" min="1" max="10" onchange="calcularTotal()" />
        </div>
      </div>

      <!-- Diagnóstico CIE-10 -->
      <div class="rec-seccion">
        <div class="rec-seccion-titulo">🩺 Diagnóstico (CIE-10)</div>
        <div class="rec-campo">
          <label>Código CIE-10</label>
          <select id="rec-cie10">
            ${CIE10_DATA.map(c => `<option value="${c.codigo}" ${c.codigo===cie10Sugerido.codigo?"selected":""}>${c.codigo} — ${c.desc}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- Valores -->
      <div class="rec-seccion">
        <div class="rec-seccion-titulo">💰 Valores y Cobro</div>
        <div class="rec-fila-dos">
          <div class="rec-campo">
            <label>Valor Procedimiento ($)</label>
            <input type="number" id="rec-valor-proc" value="80000" min="0" step="1000" onchange="calcularTotal()" />
          </div>
          <div class="rec-campo">
            <label>Cuota Moderadora ($)</label>
            <input type="number" id="rec-cuota-mod" value="5800" min="0" step="100" onchange="calcularTotal()" />
          </div>
        </div>
        <div class="rec-fila-dos">
          <div class="rec-campo">
            <label>Copago ($)</label>
            <input type="number" id="rec-copago" value="15000" min="0" step="500" onchange="calcularTotal()" />
          </div>
          <div class="rec-campo">
            <label>Cobro A</label>
            <select id="rec-cobro-a">
              <option>Paciente</option>
              <option>EPS</option>
              <option>Empresa</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="rec-total-bloque" id="rec-total-bloque">
        <div class="rec-total-fila"><span>Valor procedimiento:</span><span id="rtot-proc">$80,000</span></div>
        <div class="rec-total-fila"><span>Cuota moderadora:</span><span id="rtot-cuota">$5,800</span></div>
        <div class="rec-total-fila"><span>Copago paciente:</span><span id="rtot-copago">$15,000</span></div>
        <div class="rec-total-fila"><span>TOTAL A COBRAR:</span><span id="rtot-total">$20,800</span></div>
      </div>

    </div>

    <div class="recepcion-footer">
      <button class="btn-recepcionar-final" onclick="finalizarRecepcion(${cita.id})">✅ Confirmar Recepción</button>
      <button class="btn-recepcionar-wa" onclick="enviarConfirmacionWA(${cita.id})">💬 Enviar WhatsApp Confirmación</button>
    </div>
  `;
}

function actualizarCupsBadge() {
  const sel = document.getElementById("rec-cups");
  const badge = document.getElementById("rec-cups-badge");
  if (sel && badge) badge.textContent = sel.value;
}

function calcularTotal() {
  const proc  = parseFloat(document.getElementById("rec-valor-proc")?.value || 0);
  const cuota = parseFloat(document.getElementById("rec-cuota-mod")?.value  || 0);
  const copa  = parseFloat(document.getElementById("rec-copago")?.value     || 0);
  const cant  = parseFloat(document.getElementById("rec-cantidad")?.value   || 1);
  const totalCopa = cuota + copa;
  const fmt = n => "$" + Math.round(n).toLocaleString("es-CO");
  const rtProc  = document.getElementById("rtot-proc");
  const rtCuota = document.getElementById("rtot-cuota");
  const rtCopa  = document.getElementById("rtot-copago");
  const rtTot   = document.getElementById("rtot-total");
  if (rtProc)  rtProc.textContent  = fmt(proc * cant);
  if (rtCuota) rtCuota.textContent = fmt(cuota);
  if (rtCopa)  rtCopa.textContent  = fmt(copa);
  if (rtTot)   rtTot.textContent   = fmt(totalCopa);
}

function finalizarRecepcion(citaId) {
  const idx = CITAS.findIndex(c => c.id === citaId);
  if (idx === -1) return;
  CITAS[idx].estado = "recepcionada";
  mostrarToast("✅ Paciente recepcionada correctamente", "verde");
  llenarCitas(PERMISOS[usuarioActual.rol], usuarioActual);
  llenarInicio(PERMISOS[usuarioActual.rol], usuarioActual);
  document.getElementById("recepcion-panel-detalle").innerHTML = `
    <div class="recepcion-panel-vacio">
      <div style="font-size:48px;margin-bottom:12px;">✅</div>
      <p style="color:#15803d;font-size:14px;font-weight:600;">Paciente recepcionada exitosamente</p>
    </div>`;
}

function enviarConfirmacionWA(citaId) {
  const cita = CITAS.find(c => c.id === citaId);
  if (!cita) return;
  const cups = document.getElementById("rec-cups")?.value || "";
  const copa = document.getElementById("rec-copago")?.value || "0";
  const msg = encodeURIComponent(
    `🏥 *Unidad Video Diagnóstica de la Mujer*\n\n` +
    `Estimada ${cita.paciente}, ha sido recepcionada para:\n\n` +
    `🩺 Procedimiento: ${cita.tipo}\n` +
    `👩‍⚕️ Médico: ${cita.doctora}\n` +
    `📅 Fecha: ${cita.fecha} · 🕐 ${cita.hora}\n` +
    `💊 CUPS: ${cups}\n` +
    `💰 Copago: $${parseFloat(copa).toLocaleString("es-CO")}\n\n` +
    `Por favor preséntese 15 minutos antes. ¡Hasta pronto!`
  );
  const num = (cita.whatsapp || "").replace(/\D/g,"");
  if (num) window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  mostrarToast("💬 Confirmación enviada por WhatsApp", "verde");
}

// =============================================
//   MODAL HISTORIA CLÍNICA (GINECÓLOGA)
// =============================================
function abrirModalHC(citaId) {
  const cita = CITAS.find(c => c.id === citaId);
  if (!cita) return;
  document.getElementById("hc-cita-id").value = citaId;
  document.getElementById("hc-titulo").textContent    = `Historia Clínica — ${cita.paciente}`;
  document.getElementById("hc-subtitulo").textContent = `${cita.tipo} · ${cita.fecha} · ${cita.hora}`;

  // Info cita
  document.getElementById("hc-info-cita-bloque").innerHTML = `
    <div class="hc-info-item"><div class="hc-info-label">Paciente</div><div class="hc-info-valor">${cita.paciente}</div></div>
    <div class="hc-info-item"><div class="hc-info-label">Procedimiento</div><div class="hc-info-valor">${cita.tipo}</div></div>
    <div class="hc-info-item"><div class="hc-info-label">Médico</div><div class="hc-info-valor">${cita.doctora}</div></div>
    <div class="hc-info-item"><div class="hc-info-label">Fecha / Hora</div><div class="hc-info-valor">${cita.fecha} · ${cita.hora}</div></div>
  `;

  // Si ya existe HC guardada, cargar datos
  const hc = HISTORIAS_CLINICAS[citaId] || {};
  const campos = [
    "hc-motivo","hc-evolucion","hc-intensidad","hc-sintomas","hc-medicamentos",
    "hc-menarquia","hc-ciclo","hc-fum","hc-anticonceptivo",
    "hc-gestas","hc-partos","hc-abortos",
    "hc-enfermedades","hc-alergias","hc-familiares",
    "hc-peso","hc-talla","hc-ta","hc-fc",
    "hc-genitales","hc-cervix","hc-utero","hc-anexos","hc-colposcopia",
    "hc-diag-secundarios","hc-conducta","hc-formula","hc-proxima-cita","hc-observaciones"
  ];
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el && hc[id] !== undefined) el.value = hc[id];
    else if (el) el.value = "";
  });

  // CIE10 guardado
  if (hc["hc-cie10-codigo"]) {
    document.getElementById("hc-cie10-codigo").value  = hc["hc-cie10-codigo"];
    document.getElementById("hc-cie10-buscar").value  = hc["hc-cie10-texto"] || "";
    const sel = document.getElementById("hc-cie10-seleccionado");
    sel.style.display = "flex";
    sel.innerHTML = `<span><span class="cie10-codigo">${hc["hc-cie10-codigo"]}</span>${hc["hc-cie10-texto"] || ""}</span><button class="cie10-clear" onclick="limpiarCIE10()">✕</button>`;
  } else {
    document.getElementById("hc-cie10-codigo").value = "";
    document.getElementById("hc-cie10-buscar").value = "";
    document.getElementById("hc-cie10-seleccionado").style.display = "none";
    document.getElementById("hc-cie10-sugerencias").classList.remove("visible");
  }

  // Abrir en primera tab
  mostrarHCTab("anamnesis", document.querySelector(".hc-tab"));
  document.getElementById("modal-hc-overlay").classList.add("visible");
}

function cerrarModalHC() {
  document.getElementById("modal-hc-overlay").classList.remove("visible");
}

function mostrarHCTab(nombre, btn) {
  document.querySelectorAll(".hc-tab-content").forEach(t => t.classList.remove("activo"));
  document.querySelectorAll(".hc-tab").forEach(b => b.classList.remove("activo"));
  const tab = document.getElementById("hc-tab-" + nombre);
  if (tab) tab.classList.add("activo");
  if (btn) btn.classList.add("activo");
}

function guardarHistoriaClinica() {
  const citaId = parseInt(document.getElementById("hc-cita-id").value);
  const campos = [
    "hc-motivo","hc-evolucion","hc-intensidad","hc-sintomas","hc-medicamentos",
    "hc-menarquia","hc-ciclo","hc-fum","hc-anticonceptivo",
    "hc-gestas","hc-partos","hc-abortos",
    "hc-enfermedades","hc-alergias","hc-familiares",
    "hc-peso","hc-talla","hc-ta","hc-fc",
    "hc-genitales","hc-cervix","hc-utero","hc-anexos","hc-colposcopia",
    "hc-diag-secundarios","hc-conducta","hc-formula","hc-proxima-cita","hc-observaciones"
  ];
  const data = { fechaGuardado: new Date().toLocaleString("es-CO") };
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = el.value;
  });
  data["hc-cie10-codigo"] = document.getElementById("hc-cie10-codigo").value;
  data["hc-cie10-texto"]  = document.getElementById("hc-cie10-buscar").value;
  HISTORIAS_CLINICAS[citaId] = data;
  mostrarToast("💾 Historia clínica guardada correctamente", "morado");
  // Refrescar lista para mostrar badge HC
  llenarCitas(PERMISOS[usuarioActual.rol], usuarioActual);
  llenarInicio(PERMISOS[usuarioActual.rol], usuarioActual);
}

function marcarCitaCompletada() {
  const citaId = parseInt(document.getElementById("hc-cita-id").value);
  // Guardar HC primero si hay datos
  guardarHistoriaClinica();
  const idx = CITAS.findIndex(c => c.id === citaId);
  if (idx !== -1) {
    CITAS[idx].estado = "completada";
    mostrarToast("✅ Cita marcada como atendida", "verde");
    cerrarModalHC();
    llenarCitas(PERMISOS[usuarioActual.rol], usuarioActual);
    llenarInicio(PERMISOS[usuarioActual.rol], usuarioActual);
  }
}

// ===== CIE-10 búsqueda =====
function buscarCIE10(q) {
  const lista = document.getElementById("hc-cie10-sugerencias");
  if (!q || q.length < 1) { lista.classList.remove("visible"); lista.innerHTML = ""; return; }
  q = q.toLowerCase();
  const res = CIE10_DATA.filter(c =>
    c.codigo.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  ).slice(0, 8);
  if (res.length === 0) { lista.classList.remove("visible"); lista.innerHTML = ""; return; }
  lista.innerHTML = res.map(c => `
    <div class="cie10-item" onclick="seleccionarCIE10('${c.codigo}', '${c.desc}')">
      <span class="cie10-codigo">${c.codigo}</span>${c.desc}
    </div>`).join("");
  lista.classList.add("visible");
}

function seleccionarCIE10(codigo, desc) {
  document.getElementById("hc-cie10-codigo").value = codigo;
  document.getElementById("hc-cie10-buscar").value = `${codigo} — ${desc}`;
  const lista = document.getElementById("hc-cie10-sugerencias");
  lista.classList.remove("visible");
  lista.innerHTML = "";
  const sel = document.getElementById("hc-cie10-seleccionado");
  sel.style.display = "flex";
  sel.innerHTML = `<span><span class="cie10-codigo">${codigo}</span>${desc}</span><button class="cie10-clear" onclick="limpiarCIE10()">✕</button>`;
}

function limpiarCIE10() {
  document.getElementById("hc-cie10-codigo").value = "";
  document.getElementById("hc-cie10-buscar").value = "";
  document.getElementById("hc-cie10-seleccionado").style.display = "none";
}

// =============================================
//   SECCIÓN PACIENTES
// =============================================
function llenarPacientes() {
  const tbody = document.getElementById("tabla-pacientes-body");
  if (!tbody) return;
  tbody.innerHTML = PACIENTES.map((p) => `
    <tr id="tr-paciente-${p.id}">
      <td><div class="celda-usuario"><div class="avatar ${p.color}">${p.iniciales}</div>${p.nombre}</div></td>
      <td>${p.email}</td>
      <td>${p.tel}</td>
      <td>${p.ultimaCita}</td>
      <td>
        <button class="btn-accion editar"   onclick="abrirModalEditarPaciente(${p.id})">✏️</button>
        <button class="btn-accion eliminar" onclick="eliminarPaciente(${p.id})">🗑️</button>
      </td>
    </tr>`).join("");
}

function filtrarPacientes(q) {
  q = q.toLowerCase();
  document.querySelectorAll("#tabla-pacientes-body tr").forEach(fila => {
    fila.style.display = fila.textContent.toLowerCase().includes(q) ? "" : "none";
  });
}

// =============================================
//   SECCIÓN USUARIOS
// =============================================
function llenarUsuariosSistema() {
  const tbody = document.getElementById("tabla-usuarios-body");
  if (!tbody) return;
  tbody.innerHTML = USUARIOS_SISTEMA.map(u => `
    <tr id="tr-usuario-${u.id}">
      <td><div class="celda-usuario"><div class="avatar ${u.color}">${u.iniciales}</div>${u.nombre}</div></td>
      <td><span class="badge-rol ${u.color}">${u.rolLabel}</span></td>
      <td>${u.especialidad}</td>
      <td>${u.email}</td>
      <td><span class="estado ${u.estado}">${u.estado === "activo" ? "Activo" : "Inactivo"}</span></td>
      <td>
        <button class="btn-accion editar"   onclick="editarUsuario(${u.id})">✏️</button>
        <button class="btn-accion eliminar" onclick="eliminarUsuario(${u.id})">🗑️</button>
      </td>
    </tr>`).join("");
}

// =============================================
//   PERFIL
// =============================================
function llenarPerfil(usuario) {
  const permisos = PERMISOS[usuario.rol];
  document.getElementById("perfil-nombre").textContent    = usuario.nombre;
  document.getElementById("perfil-rol-texto").textContent = permisos.labelRol;
  document.getElementById("perfil-email").textContent     = usuario.email;
  document.getElementById("perfil-avatar").textContent    = usuario.iniciales;
  document.getElementById("perfil-avatar").className      = "avatar grande " + permisos.colorRol;
  const inp = document.getElementById("perfil-input-nombre");
  if (inp) inp.value = usuario.nombre;
}

function guardarPerfil() { mostrarToast("✅ Perfil actualizado correctamente", "verde"); }

// =============================================
//   NAVEGACIÓN
// =============================================
function mostrarSeccion(nombre) {
  if (usuarioActual) {
    const permisos = PERMISOS[usuarioActual.rol];
    if (!permisos.secciones.includes(nombre)) { mostrarToast("No tienes permiso para acceder a esta sección.", "rojo"); return; }
  }
  document.querySelectorAll(".seccion").forEach(s => s.classList.remove("activa"));
  const sec = document.getElementById("sec-" + nombre);
  if (sec) sec.classList.add("activa");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("activo"));
  const navBtn = document.getElementById("nav-" + nombre);
  if (navBtn) navBtn.classList.add("activo");
  document.querySelectorAll(".nav-inf-btn").forEach(b => b.classList.remove("activo"));
}

// =============================================
//   MODAL NUEVA CITA
// =============================================
function abrirModalCita() {
  if (!usuarioActual) return;
  if (!PERMISOS[usuarioActual.rol].puedeAgendarCita) { mostrarToast("No tienes permiso para agendar citas.", "rojo"); return; }
  document.getElementById("modal-overlay").classList.add("visible");
}
function cerrarModal() { document.getElementById("modal-overlay").classList.remove("visible"); }

function agendarCita() {
  const tipo     = document.getElementById("modal-tipo").value;
  const doctora  = document.getElementById("modal-doctora").value;
  const fecha    = document.getElementById("modal-fecha").value;
  const hora     = document.getElementById("modal-hora").value;
  const whatsapp = document.getElementById("modal-whatsapp").value;
  const confWA   = document.getElementById("conf-whatsapp").checked;
  const confEmail= document.getElementById("conf-email").checked;
  let paciente = "";
  const selectPac = document.getElementById("modal-paciente");
  const campoPac  = document.getElementById("campo-paciente-modal");
  if (campoPac && campoPac.style.display !== "none") paciente = selectPac.value;
  else paciente = usuarioActual.nombre;
  if (!tipo || !doctora || !fecha || !hora || !paciente) { mostrarToast("Por favor completa todos los campos obligatorios.", "rojo"); return; }
  const fechaObj = new Date(fecha + "T00:00:00");
  const fechaStr = fechaObj.toLocaleDateString("es-CO", { day:"2-digit", month:"short", year:"numeric" });
  const nuevaCita = { id:siguienteIdCita++, paciente, doctora, especialidad:tipo, tipo, fecha:fechaStr, hora, estado:"proxima", whatsapp:whatsapp||"" };
  CITAS.push(nuevaCita);
  if (confWA && whatsapp) {
    const msg = encodeURIComponent(`✅ Cita Confirmada\n\nPaciente: ${paciente}\nMédico: ${doctora}\nFecha: ${fechaStr}\nHora: ${hora}\nProcedimiento: ${tipo}\n\n📍 Unidad Video Diagnóstica de la Mujer`);
    window.open(`https://wa.me/${whatsapp.replace(/\D/g,"")}?text=${msg}`,"_blank");
  }
  if (confEmail) {
    mostrarToast("📧 Confirmación de correo enviada","azul");
    setTimeout(()=>{ mostrarToast(`✅ Cita agendada: ${paciente} — ${fechaStr}`,"verde"); },1500);
  } else {
    mostrarToast(`✅ Cita agendada: ${paciente} — ${fechaStr}`,"verde");
  }
  cerrarModal();
  llenarCitas(PERMISOS[usuarioActual.rol], usuarioActual);
  llenarInicio(PERMISOS[usuarioActual.rol], usuarioActual);
}

// =============================================
//   MODAL EDITAR CITA (solo admin)
// =============================================
function abrirModalEditar(id) {
  const cita = CITAS.find(c => c.id === id);
  if (!cita) return;
  document.getElementById("editar-cita-id").value = id;
  document.getElementById("editar-tipo").value    = cita.tipo || "";
  document.getElementById("editar-paciente").value= cita.paciente;
  document.getElementById("editar-doctora").value = cita.doctora;
  document.getElementById("editar-estado").value  = cita.estado;
  document.getElementById("modal-editar-titulo").textContent = `Editar Cita — ${cita.paciente}`;
  try {
    const meses = {Ene:0,Feb:1,Mar:2,Abr:3,May:4,Jun:5,Jul:6,Ago:7,Sep:8,Oct:9,Nov:10,Dic:11};
    const partes = cita.fecha.split(" ");
    const d = parseInt(partes[0]), m = meses[partes[1].replace(".","")], y = parseInt(partes[2]);
    if (!isNaN(d) && m !== undefined && !isNaN(y)) {
      document.getElementById("editar-fecha").value = new Date(y,m,d).toISOString().split("T")[0];
    }
  } catch(e) {}
  document.getElementById("editar-hora").value = cita.hora.replace(" AM","").replace(" PM","");
  document.getElementById("modal-editar-overlay").classList.add("visible");
}
function cerrarModalEditar() { document.getElementById("modal-editar-overlay").classList.remove("visible"); }
function guardarEdicionCita() {
  const id  = parseInt(document.getElementById("editar-cita-id").value);
  const idx = CITAS.findIndex(c => c.id === id);
  if (idx === -1) return;
  const fechaRaw = document.getElementById("editar-fecha").value;
  const fechaStr = new Date(fechaRaw+"T00:00:00").toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"});
  CITAS[idx] = { ...CITAS[idx], tipo:document.getElementById("editar-tipo").value, especialidad:document.getElementById("editar-tipo").value, paciente:document.getElementById("editar-paciente").value, doctora:document.getElementById("editar-doctora").value, fecha:fechaStr, hora:document.getElementById("editar-hora").value, estado:document.getElementById("editar-estado").value };
  cerrarModalEditar();
  llenarCitas(PERMISOS[usuarioActual.rol], usuarioActual);
  llenarInicio(PERMISOS[usuarioActual.rol], usuarioActual);
  mostrarToast("✅ Cita actualizada correctamente","verde");
}

// =============================================
//   CANCELAR / ELIMINAR CITA
// =============================================
function cancelarCita(id) {
  const cita = CITAS.find(c=>c.id===id);
  if (!cita) return;
  abrirModalConfirm("Cancelar Cita",`¿Deseas cancelar la cita de ${cita.paciente} el ${cita.fecha}?`,()=>{
    const idx = CITAS.findIndex(c=>c.id===id);
    CITAS[idx].estado = "cancelada";
    llenarCitas(PERMISOS[usuarioActual.rol],usuarioActual);
    llenarInicio(PERMISOS[usuarioActual.rol],usuarioActual);
    mostrarToast("Cita cancelada.","rojo");
  });
}
function eliminarCita(id) {
  const cita = CITAS.find(c=>c.id===id);
  if (!cita) return;
  abrirModalConfirm("Eliminar Cita",`¿Eliminar definitivamente la cita de ${cita.paciente}?`,()=>{
    CITAS = CITAS.filter(c=>c.id!==id);
    llenarCitas(PERMISOS[usuarioActual.rol],usuarioActual);
    llenarInicio(PERMISOS[usuarioActual.rol],usuarioActual);
    mostrarToast("Cita eliminada.","rojo");
  });
}

// =============================================
//   MODAL EDITAR PACIENTE
// =============================================
function abrirModalNuevoPaciente() {
  document.getElementById("editar-paciente-idx").value = "-1";
  ["ep-nombre","ep-email","ep-telefono","ep-ultima"].forEach(id=>{ document.getElementById(id).value=""; });
  document.getElementById("modal-paciente-titulo").textContent = "Nuevo Paciente";
  document.getElementById("modal-paciente-overlay").classList.add("visible");
}
function abrirModalEditarPaciente(id) {
  const p = PACIENTES.find(x=>x.id===id);
  if (!p) return;
  document.getElementById("editar-paciente-idx").value = id;
  document.getElementById("ep-nombre").value   = p.nombre;
  document.getElementById("ep-email").value    = p.email;
  document.getElementById("ep-telefono").value = p.tel;
  document.getElementById("ep-ultima").value   = p.ultimaCita;
  document.getElementById("modal-paciente-titulo").textContent = "Editar Paciente";
  document.getElementById("modal-paciente-overlay").classList.add("visible");
}
function cerrarModalPaciente() { document.getElementById("modal-paciente-overlay").classList.remove("visible"); }
function guardarPaciente() {
  const id     = parseInt(document.getElementById("editar-paciente-idx").value);
  const nombre = document.getElementById("ep-nombre").value.trim();
  const email  = document.getElementById("ep-email").value.trim();
  const tel    = document.getElementById("ep-telefono").value.trim();
  const ultima = document.getElementById("ep-ultima").value.trim();
  if (!nombre) { mostrarToast("El nombre es obligatorio.","rojo"); return; }
  if (id === -1) {
    const colores = ["azul","verde","morado","naranja","rojo"];
    const iniciales = nombre.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase();
    PACIENTES.push({ id:Date.now(), nombre, iniciales, color:colores[PACIENTES.length%colores.length], email, tel, ultimaCita:ultima||"—", eps:"", tipo:"Contributivo" });
    mostrarToast("✅ Paciente agregado.","verde");
  } else {
    const idx = PACIENTES.findIndex(x=>x.id===id);
    if (idx !== -1) { PACIENTES[idx] = { ...PACIENTES[idx], nombre, email, tel, ultimaCita:ultima }; mostrarToast("✅ Paciente actualizado.","verde"); }
  }
  cerrarModalPaciente();
  llenarPacientes();
}
function eliminarPaciente(id) {
  const p = PACIENTES.find(x=>x.id===id);
  if (!p) return;
  abrirModalConfirm("Eliminar Paciente",`¿Eliminar al paciente ${p.nombre}?`,()=>{
    PACIENTES = PACIENTES.filter(x=>x.id!==id);
    llenarPacientes();
    mostrarToast("Paciente eliminado.","rojo");
  });
}

// =============================================
//   USUARIOS
// =============================================
function editarUsuario(id)    { mostrarToast("Funcionalidad de edición — próximamente.","azul"); }
function eliminarUsuario(id)  {
  const u = USUARIOS_SISTEMA.find(x=>x.id===id);
  if (!u) return;
  abrirModalConfirm("Eliminar Usuario",`¿Eliminar al usuario ${u.nombre}?`,()=>{
    USUARIOS_SISTEMA = USUARIOS_SISTEMA.filter(x=>x.id!==id);
    llenarUsuariosSistema();
    mostrarToast("Usuario eliminado.","rojo");
  });
}
function abrirModalNuevoUsuario() { mostrarToast("Formulario de nuevo usuario — próximamente.","azul"); }

// =============================================
//   MODAL CONFIRMACIÓN
// =============================================
let _confirmCallback = null;
function abrirModalConfirm(titulo, mensaje, callback) {
  document.getElementById("confirm-titulo").textContent  = titulo;
  document.getElementById("confirm-mensaje").textContent = mensaje;
  _confirmCallback = callback;
  document.getElementById("modal-confirm-overlay").classList.add("visible");
}
function cerrarModalConfirm() {
  document.getElementById("modal-confirm-overlay").classList.remove("visible");
  _confirmCallback = null;
}
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("confirm-btn-ok").addEventListener("click",()=>{
    if (_confirmCallback) _confirmCallback();
    cerrarModalConfirm();
  });
});

// =============================================
//   MODAL WHATSAPP
// =============================================
function abrirModalWA(id) {
  const cita = CITAS.find(c=>c.id===id);
  if (!cita) return;
  document.getElementById("wa-info-cita").innerHTML = `<strong>📋 Cita:</strong> ${cita.tipo}<br><strong>👤 Paciente:</strong> ${cita.paciente}<br><strong>👩‍⚕️ Médico:</strong> ${cita.doctora}<br><strong>📅 Fecha:</strong> ${cita.fecha} — ${cita.hora}`;
  document.getElementById("wa-numero").value  = cita.whatsapp || "";
  document.getElementById("wa-mensaje").value = `Hola ${cita.paciente},\n\nLe recordamos que tiene una cita en la Unidad Video Diagnóstica de la Mujer:\n\n🩺 Procedimiento: ${cita.tipo}\n👩‍⚕️ Médico: ${cita.doctora}\n📅 Fecha: ${cita.fecha}\n🕐 Hora: ${cita.hora}\n\nPor favor confirme su asistencia. ¡Hasta pronto!`;
  document.getElementById("wa-cita-id").value = id;
  document.getElementById("modal-wa-overlay").classList.add("visible");
}
function cerrarModalWA() { document.getElementById("modal-wa-overlay").classList.remove("visible"); }
function enviarWhatsApp() {
  const numero  = document.getElementById("wa-numero").value.replace(/\D/g,"");
  const mensaje = document.getElementById("wa-mensaje").value;
  if (!numero) { mostrarToast("Ingresa el número de WhatsApp.","rojo"); return; }
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,"_blank");
  cerrarModalWA();
  mostrarToast("💬 Recordatorio enviado por WhatsApp","verde");
}

// =============================================
//   REPORTES
// =============================================
function exportarExcel() {
  const enc  = ["Paciente","Médico","Procedimiento","Fecha","Hora","Estado"];
  const fils  = CITAS.map(c=>[c.paciente,c.doctora,c.tipo||c.especialidad,c.fecha,c.hora,c.estado]);
  const csv  = [enc,...fils].map(r=>r.join(";")).join("\n");
  const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download="reporte_citas_uvdm.csv"; a.click();
  URL.revokeObjectURL(url);
  mostrarToast("✅ Archivo Excel generado","verde");
}
function exportarPDF() { window.print(); }

// =============================================
//   TABS LOGIN
// =============================================
function mostrarTab(nombre, ev) {
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("activo"));
  document.querySelectorAll(".tab-contenido").forEach(c=>c.classList.remove("activo"));
  document.getElementById("tab-"+nombre).classList.add("activo");
  if (ev && ev.target) ev.target.classList.add("activo");
}

// =============================================
//   ENTER EN LOGIN
// =============================================
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const loginVisible = document.getElementById("pantalla-login").classList.contains("activa");
    if (loginVisible) iniciarSesion();
  }
});