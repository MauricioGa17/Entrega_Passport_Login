let listProducts = document.getElementById('products')
let products = listProducts.innerHTML;

//Conexion con Socket
const socket = io()
socket.emit('new');

//Obtener Lista
fetch('/api/products/')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.products.length; i++) {
        products += `
          <tr>
            <td>${data.products[i].title}</td>
            <td>
              <button onclick="onEliminar(${data.products[i].id})">Eliminar</button>
            </td>
          </tr>`
        listProducts.innerHTML = products;
    };
  })
  .catch(error => console.log(error))


//Formulario
const formulario = document.getElementById('form-products');
formulario.addEventListener('submit', event => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const descripcion = document.getElementById('descripcion').value;
  const code = document.getElementById('code').value;
  const price = document.getElementById('price').value;
  const status = document.getElementById('status').value;
  const stock = document.getElementById('stock').value;
  const category = document.getElementById('category').value;
  const thumbnails = document.getElementById('thumbnails').value;

  const product = {
    title,
    descripcion,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  }

  const url = '/api/products/';

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(product),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => {
    socket.emit('products', response.products)
  });
})

socket.on('response_products', products => {
  listProducts.innerHTML = '';
  for (let i = 0; i < products.length; i++) {
    const list = `
    <tr>
      <td>${products[i].title}</td>
      <td>
        <button onclick="onEliminar(${products[i].id})">Eliminar</button>
      </td>
    </tr>`
    listProducts.innerHTML += list
  };
})

const onEliminar = (idProduct) => {
  const url = `/api/products/${idProduct}`;

  fetch(url, {
    method: 'DELETE',
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => {
    socket.emit('products', response.products)
  });
}


