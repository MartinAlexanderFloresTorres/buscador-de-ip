//=============== variables ===============//
const formulario = document.querySelector("#formulario");
const previa = document.querySelector("#previa");
const resultados = document.querySelector("#resultados");
const input = document.querySelector("#formulario input");
const button = document.querySelector("#formulario button");

//=============== eventos ===============//
input.addEventListener("input", validar);
input.addEventListener("paste", validar);

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const { value } = input;
  if (value.trimStart().split("").length > 8) {
    consultarApi(value.trimStart());
  } else {
    input.setAttribute("aria-invalid", "true");
  }
});

//=============== funciones ===============//
async function consultarApi (ip){
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "56d46dbc20mshff9ff635de8aaeep15feedjsn7829431e434e",
      "X-RapidAPI-Host": "ip-geolocation-and-threat-detection.p.rapidapi.com",
    },
  };

  try {
    button.setAttribute("disabled", "true");
    button.setAttribute("aria-busy", "true");
    resultados.innerHTML = '{"Los resultados apareceran aqui"}';
    previa.innerHTML = "";
    const respuesta = await fetch(
      `https://ip-geolocation-and-threat-detection.p.rapidapi.com/${ip}`,
      options
    );
    const data = await respuesta.json();
    button.removeAttribute("disabled");
    button.removeAttribute("aria-busy");
    imprimiHtml(data);
  } catch (error) {
    console.error(error);
  }
};

// validar el input
function validar() {
  input.value = input.value.trimStart()
  const { value } = input;
  value.trimStart().split("").length > 8
    ? input.setAttribute("aria-invalid", "false")
    : input.setAttribute("aria-invalid", "true");
};

// mostrar resultados
function imprimiHtml(data) {
  resultados.innerHTML = JSON.stringify(data, null, 2);

  if (data?.code != "INVALID_IP_ADDRESS") {
    previa.innerHTML = `
      <div class="informacion">
        ${data?.carrier?.name != null ? `<h3>Nombre: <span>${data?.carrier.name}</span></h3>` : ""}
        ${data?.ip != null ? `<h3>IP:  <span>${data?.ip}</span></h3>` : ""}
        ${data?.connection?.domain != null ? `<h3>Dominio: <span><a href="https://${data?.connection.domain}" target="_blank">${data?.connection.domain}</a></span></h3>` : ""}
        ${data?.connection?.organization != null ? `<h3>Organización: <span>${data?.connection.organization}</span></h3>` : ""}
        ${data?.connection?.type != null ? `<h3>Tipo: <span>${data?.connection.type}</span></h3>` : ""}
        <div>
          ${data?.location?.country?.name != null ? `<h3>País: <span>${data?.location.country.name}</span></h3>` : ""}
          ${data?.location?.country?.flag?.wikimedia != null ? `<img width="50" src="${data?.location.country.flag.wikimedia}" alt="imagen" />` : ""}
        </div>
      </div>
    `;
  }
}
