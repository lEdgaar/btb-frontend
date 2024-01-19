<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { getCookie } from './helpers/helpers';
import { useRouter } from 'vue-router';
import VueTradingView from 'vue-trading-view';

const router = useRouter();

let form = ref({
  product: '',
  description: '',
  dailyPrice: '',
  brand: '',
  model: '',
  categoryName: ''
});

let products = ref([]);
let productsQuery = ref([]);
let categories = ref([]);
let productToDelete = ref(null);
let modal = ref(false)
let modalS = ref(false)

let isAdmin = (getCookie("isAdmin") + '').toLowerCase() === 'true';

const getProducts = async () => {
  try {

    const isAnyFieldFilled = Object.values(form.value).some(value => (value !== '' && value !== 0));
    if (isAnyFieldFilled) {
      console.log(isAnyFieldFilled);
      // En este caso, solo esta hecha la búsqueda por nombre de producto.
      // En futuras versiones, se desarrollará la funcionalidad para realizar las búsquedas
      // según los campos que se introduzcan
      productsQuery = ref([]);
      if (form.value.product !== '') {
        await getProductsByName();
      }
      if (form.value.categoryName !== 0 && form.value.categoryName !== '') {
        await getProductsByCategory();
      }      
      if (form.value.brand !== '') {
        await getProductsByBrand();
      }      
      if (form.value.description !== '') {
        await getProductsByDesc();
      }
      
      filterProducts();

    } else {
      const response = await axios.get(`http://localhost:18081/products/`, {
        headers: {
          'Authorization': getCookie("token")
        }
      });
      products.value = response.data.map((item) => ({
        value: item.id,
        name: item.name,
        description: item.description,
        model: item.model,
        brand: item.brand,
        dailyPrice: item.dailyPrice,
        category: item.category
      }));
    }
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
  }
};

const getMethodAxios = async (url, param) => {
  try {
    const response = await axios.get(url + param, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    let productTEMP = response.data.map((item) => ({
        value: item.id,
        name: item.name,
        description: item.description,
        model: item.model,
        brand: item.brand,
        dailyPrice: item.dailyPrice,
        category: item.category
      }));
      return productTEMP;
  } catch(e){
    console.error('Error al obtener datos de la API:', e);
  }

}


const filterProducts = () => {
  productsQuery.value.map((item) => {
    products.value = item.map((item2) => ({
      value: item2.value,
      name: item2.name,
      description: item2.description,
      model: item2.model,
      brand: item2.brand,
      dailyPrice: item2.dailyPrice,
      category: item2.category
    }))
  })
  if (form.value.product !== '') { products.value = filterByName(form.value.product); }
  if (form.value.brand !== '') { products.value = filterByBrand(form.value.brand); }
  if (form.value.description !== '') { products.value = filterByDescription(form.value.description); }
  if (form.value.categoryName !== 0 && form.value.categoryName !== '') { 
    products.value = filterByCategory(categories.value[form.value.categoryName-1].text); 
  }

}
function filterByName(query) {
  return products.value.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
}
function filterByBrand(query) {
  return products.value.filter(item => item.brand.toLowerCase().includes(query.toLowerCase()));
}
function filterByCategory(query) {
  return products.value.filter(item => item.category.name.toLowerCase().includes(query.toLowerCase()));
}
function filterByDescription(query) {
  return products.value.filter(item => item.description.name.toLowerCase().includes(query.toLowerCase()));
}
/*
function navigateToItem(productId) { // Al clickar en un product te envia a Items con el productId
  router.push({name: "Items", params: {id: productId}})
}*/

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:18081/categories/', {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    categories.value = response.data.map((category) => ({
      value: category.id,
      text: category.name
    }));
    categories.value.push({
      value: 0,
      text: "Sin seleccionar"
    });
    form.value.parentId = 0;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modal.value = true;
  }
};

const deleteProductModal = (id) => {
  productToDelete.value = id.value;
  modal.value = true;
}

const deleteProduct = async () => {
  modal.value = false;
  await axios.delete(`http://localhost:18081/products/${productToDelete.value}`, {
    headers: {
      'Authorization': getCookie("token")
    }
  })
    .then(() => {
      modalS.value = true;
    });

}

const resetForm = () => {
  products.value = []
  form.value = {
    product: '',
    description: '',
    dailyPrice: '',
    brand: '',
    model: '',
    categoryName: ''
  };
};

function refesh() {
  document.location.reload();
}
getProducts();
fetchCategories();

onMounted(() => {
  // Inicialización de TradingView
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
  script.async = true;
  script.innerHTML = JSON.stringify({
    "container_id": "technical-analysis-chart-demo",
  "width": "100%",
  "height": "100%",
  "autosize": true,
  "symbol": "AAPL",
  "interval": "D",
  "timezone": "exchange",
  "theme": "light",
  "style": "1",
  "withdateranges": true,
  "hide_side_toolbar": false,
  "allow_symbol_change": true,
  "save_image": false,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "support_host": "https://www.tradingview.com"
  });

  const tradingViewContainer = document.getElementById('tradingViewContainer');
  if (tradingViewContainer) {
    tradingViewContainer.appendChild(script);
  } else {
    console.error('Element with ID "tradingViewContainer" not found.');
  }
});
</script>
<template>
  <b-container style="text-align:center;" fluid @keyup.enter="getProducts">
    <h1>
      Acciones
    </h1>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <b-button v-if="isAdmin" class="btn btn-primary" type="submit" variant="primary" to="/products/create">Añadir
        productos</b-button>
    </div>
    <br>
    <b-row class="mt-3" style="text-align: left;" align-h="center" justify="center">
      <b-col md="8">
        <b-form-group label="Búsqueda:" label-for="searchAsset">
          <b-form-input id="searchAsset" v-model="form.product"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <br>
    <div style="text-align: center;">
      <BButtonGroup>
        <b-button id="busqueda" variant="primary" @click="getProducts">Buscar</b-button>
      </BButtonGroup>
    </div>
    <br>
    <b-row id="listaProductos">
      <b-col v-if="products.length > 0" md="12">
        <b-card v-for="product in products" :key="product.value" class="m-2">
          <Product :product="product" :eventEdit="null" :eventDelete="deleteProductModal" :isAdmin="isAdmin" />
        </b-card>
      </b-col>
    </b-row>
    <div id="tradingViewContainer" ref="tradingViewContainer" class="tradingview-widget-container"></div>
  </b-container>
  
</template> 