const btnCarrito = document.getElementById('btn-carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const displayCarrito = document.getElementById('carrito');

const juego = [
  {
    id: 1,
    nombre: 'Crash Bandicoot Trilogy',
    precio: 420,
    imagen: 'crash.jpg',
  },
  {
    id: 2,
    nombre: 'Counter Strike Global Offensive',
    precio: 230,
    imagen: 'csgo.jpg',
  },
  {
    id: 3,
    nombre: 'Grand Theft Auto V',
    precio: 900,
    imagen: 'gta.jpg',
  },
  {
    id: 4,
    nombre: 'Stumble Guys',
    precio: 50,
    imagen: 'guys.jpg',
  },
  {
    id: 5,
    nombre: 'Mortal Kombat 11',
    precio: 1400,
    imagen: 'mk11.jpg',
  },
  {
    id: 6,
    nombre: 'Rainbow Six Siege',
    precio: 1000,
    imagen: 'r6.jpg',
  },
];

class Juego {
  constructor(obj) {
    this.nombre = obj.nombre;
    this.id = obj.id;
    this.cantidad = obj.cantidad;
    this.precio = obj.precio;
    this.precioIva = this.agregarIva();
  }

  agregarIva() {
    return this.precio + (this.precio * 21) / 100;
  }
}

const guardarProductosStorage = () => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

const cargarProductosStorage = () => {
  return JSON.parse(localStorage.getItem('carrito')) || [];
};

const carrito = cargarProductosStorage();

const generarHtmlCatalogo = () => {
  const inputBusqueda = document.querySelector('.filtros [name="busqueda"]');
  inputBusqueda.addEventListener('keyup', filtrarJuego);

  let catalogo = document.querySelector('#catalogo');

  juego.forEach((juego) => {
    let elemento = document.createElement('div');
    elemento.id = `card-${juego.id}`;
    elemento.className = 'card';
    elemento.innerHTML = `
      <img class="card__img" src="images/${juego.imagen}">
      <div class="card__info">
        <p class="card__nombre">${juego.nombre}</p>
        <p class="card__precio">$${juego.precio}</p>
      </div>      
      <button class="card__btn">
        <span class="material-icons">
          add_shopping_cart
        </span>
      </button>
      `;

    catalogo.appendChild(elemento);
  });
};

const buscarJuego = (id) => {
  return juego.find((juego) => juego.id === id);
};

const filtrarJuego = (e) => {
  let catalogo = document.querySelector('#catalogo');
  let value = e.target.value;
  let juegoFiltrados = juego.filter((el) =>
    el.nombre.toLowerCase().includes(value.toLowerCase())
  );

  catalogo.innerHTML = '';

  if (juegoFiltrados.length === 0) {
    catalogo.innerHTML = `<h2>No se encontraron productos con la busqueda: "${value}"`;
  } else {
    juegoFiltrados.forEach((juego) => {
      let elemento = document.createElement('div');
      elemento.id = `card-${juego.id}`;
      elemento.className = 'card';
      elemento.innerHTML = `
        <img class="card__img" src="images/${juego.imagen}">
        <div class="card__info">
          <p class="card__nombre">${juego.nombre}</p>
          <p class="card__precio">$${juego.precio}</p>
        </div>
        <button class="card__btn">
          <span class="material-icons">
            add_shopping_cart
          </span>
        </button>`;

      catalogo.appendChild(elemento);
    });
    cargarJuegoCarrito();
  }
};

const agregarJuego = (juego) => {
  if (carrito.some((item) => item.id === juego.id)) {
    let duplicado = carrito.find((item) => item.id === juego.id);
    duplicado.cantidad++;
  } else {
    juego.cantidad = 1;
    carrito.push(juego);
  }
  notificacionAgregado(juego);
};

const cargarJuegoCarrito = () => {
  let cardBtns = document.querySelectorAll('.card__btn');

  cardBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      let itemId = parseInt(e.target.closest('.card').id.slice(5));

      btnCarrito.classList.add('agregado');
      setTimeout(() => {
        btnCarrito.classList.remove('agregado');
      }, 1000);

      agregarJuego(buscarJuego(itemId));
      guardarProductosStorage();
      generarHtmlCarrito();
    });
  });
};

const eliminarJuego = (id) => {
  if (carrito.some((el) => el.id === id)) {
    if (carrito.find((el) => el.id === id).cantidad === 1) {
      let posicion = carrito.findIndex((juego) => Juego.id === id);
      carrito.splice(posicion, 1);
    } else {
      carrito.find((el) => el.id === id).cantidad--;
    }
  }
};

const eliminarJuegoCarrito = () => {
  let deleteBtns = document.querySelectorAll('.juego__eliminar');

  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      let itemId = parseInt(e.target.closest('.product-container').id.slice(9));

      eliminarJuego(itemId);
      guardarProductosStorage();
      generarHtmlCarrito();
    });
  });
  actualizarCantidadCarrito();
};

const actualizarCantidadCarrito = () => {
  let carritoCantidad = document.querySelector('#carrito-cantidad');

  const productosCarrito = cargarProductosStorage();
  let cantidadProductos = 0;

  productosCarrito.forEach((producto) => {
    cantidadProductos += producto.cantidad;
  });

  carritoCantidad.innerHTML = cantidadProductos;
};

const notificacionAgregado = (producto) => {
  Toastify({
    text: `Se agrego al carrito: "<b>${producto.nombre}</b>"`,
    duration: 3000,
    gravity: 'bottom',
    position: 'left',
    stopOnFocus: true,
    escapeMarkup: false,
    style: {
      background: '#333333',
      border: '1px solid #444444',
      fontSize: '14px',
    },
  }).showToast();
};

const generarHtmlCarrito = () => {
  let contenedorCarrito = document.querySelector('.contenedor-carrito');
  let totalCarrito = document.querySelector('.total-carrito');

  const productosCarrito = cargarProductosStorage();

  if (productosCarrito.length === 0) {
    contenedorCarrito.innerHTML = 'No hay productos en tu carrito.';
  } else {
    contenedorCarrito.innerHTML = '';
    productosCarrito.forEach((producto) => {
      let elemento = document.createElement('div');
      elemento.id = `producto-${producto.id}`;
      elemento.className = 'product-container';
      elemento.innerHTML = `
          <img class="juego__img" src="images/${producto.imagen}">
          <div class="juego__info">
            <p class="juego__nombre">${producto.nombre}</p>
            <p class="juego__precio">$${producto.precio}</p>
            <p class="juego__cantidad">Cantidad: ${producto.cantidad}</p>
          </div>
          <button class="juego__eliminar">&times</button>
        `;
      contenedorCarrito.appendChild(elemento);
    });
  }
  let total = 0;
  let totalIva = 0;

  for (const item of productosCarrito) {
    let juego = new Juego(item);
    juego.agregarIva();
    totalIva += juego.precioIva * juego.cantidad;
    total += juego.precio * juego.cantidad;
  }

  totalCarrito.innerHTML = `
  <span>Precio: $${total.toFixed(2)}</span>
  <span>Impuesto IVA: $${(totalIva - total).toFixed(2)}</span>
  <p>Total a pagar: $${totalIva.toFixed(2)}</p>
  `;

  eliminarJuegoCarrito();
};

generarHtmlCatalogo();
generarHtmlCarrito();
cargarJuegoCarrito();

btnCarrito.addEventListener('click', () => {
  displayCarrito.classList.add('active');
});

cerrarCarrito.addEventListener('click', () => {
  displayCarrito.classList.remove('active');
});

/* INCORPORANDO FETCHS */

fetch('https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random',{
	"method": 'GET',
	"headers": {
		"accept": "application/json",
		"X-RapidAPI-Key": "84346f13e1msh61c1656dbbac329p179e98jsne5f86178c06b",
		"X-RapidAPI-Host": "matchilling-chuck-norris-jokes-v1.p.rapidapi.com"
	}
}).then(response => {
  return response.json()
}).then(jokes => {
  const comedy = jokes.result.map(jokeline => {
    return `    
    <p class="joke">${jokeline.value}</p>
    `
  }).join('');
document.querySelector("#cnjokes").insertAdjacentHTML ('afterbegin',comedy);
})