function buscar() {
  let busqueda = document.getElementById("busca").value;
  swal(busqueda);
  let informacion = {
    busqueda,
  }
  //Recorrer cada elemento del objeto, el cual se serializa en formato URL
  let pairs = [];
  for (objeto in informacion) {
    let valor = informacion[objeto];
    if (typeof valor !== "string") valor = JSON.stringify(valor);
    pairs.push(objeto + "=" + encodeURI(valor).replace(/=/g, '%3D').replace(/&/g, '%26').replace(/%20/g, '+'));
  }
  //Empaquetamos los objetos serializados en formato URL
  let body = "";
  body = pairs.join("&");
  //Le decimos a la peticion HTTP que vamos usar el formato URL de serializacion
  let head = new Headers();
  head.set('Content-Type', 'application/x-www-form-urlencoded');
  //Enviar la peticion HTTP diciendo el tipo de metodo, encabezado e informacion serializada
  swal({
    title: "¡A buscar!",
    text: "Ahi te voy san pedro",
    icon: "warning",
    buttons: {
      defeat: {
        text: "Si",
        closeModal: false,
      },
      cancel: 'No',
    },
    dangerMode: true,
  }).then((respuesta) => { //Respuesta del boton
    if (respuesta == "defeat") {
      return fetch("/Servicio/rest/ws/consulta_articulos", {
        method: 'POST',
        headers: head,
        body: body,
      }).then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      });
    }
    if (respuesta === null) return new Response("null");
  }).then((respuesta) => {
    if (respuesta != null) {
      if (Array.isArray(respuesta)) {
        // swal("Genial", "Si hay merca wey!!!", "success");
        swal.close();
        // agregaArticulos(respuesta);
        respuesta.map(console.log);
        respuesta.map((e) => { console.log(e) });
      } else {
        swal("Respuesta", `${respuesta}`, "info");
      }
    }
  }).catch((error) => {
    swal("Error", `${error}`, "error");
    console.log(error);
  });
}

function agregaArticulos(articulos) {
  let listaArti = "";
  articulos.map((e) => {
    listaArti += `
    <div class="col s12 l4 animate__animated animate__fadeInDown animate__fast">
      <div class="card blue lighten-2 center-box">
        <div class="card-image">
          <img src="data:image/jpeg;base64,${e.imagen}" alt='foto' />
          <span class="card-title"></span>
        </div>
        <div class="card-content">
          <h5>${e.descripcion}</h5>
          <p>Precio: ${e.precio} (MXN)</p>
          <p>Cantidad: ${e.cantidad} (MXN)</p>
          <form id=${e.descripcion} onsubmit="handleShop(event)" class='row'>
            <input id="descripcion" type="hidden" value="${e.descripcion}" />
            <div class="input-field col s12 contenedor">
              <p style="text-align:center;"> Cantidad a comprar </p>
              <input id='cantidad' type="number" value="1" step="1" min="1" placeholder='1' required></input>
            </div>
            <input id="cantidadOld" type="hidden" value=${e.cantidad} />
            <button type='submit' class='col s8 offset-s2 btn halfway-fab waves-effect waves-light blue darken-1'><i class="material-icons left">add_shopping_cart</i>Comprar</button>
          </form>
        </div>
      </div>
    </div>`;
  });
  let div = document.getElementById("MuestraArticulos");
  div.innerHTML = listaArti;
}