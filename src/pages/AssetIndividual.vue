<template>
  <div>
  <h1>Mercado</h1>
  <br>
    <h1>{{form.name}}</h1>
    <br>
    <br>
    <h3> Gráfica </h3>
    <br>
    <div id="tradingViewContainer" ref="tradingViewContainer" class="tradingview-widget-container"></div>
    <br>
    Operativa
    <br>
    <b-form-group class="mt-3" id="input-group-3" label="Cantidad" label-for="input-3">
      <b-form-input id="input-3" v-model.defer="form.cantidad" required></b-form-input>
    </b-form-group>
    <br>
    <input
        class="form-check-input"
        type="checkbox"
        id="exampleCheckbox"
        v-model="form.isSandbox" 
      >
      <label class="form-check-label" for="exampleCheckbox">
          Operativa entorno sandbox
      </label>
    <div style="display:flex; justify-content:space-around; width: 100%; margin: 0 auto; margin-top: 2rem;">
                <b-button style="width: 33%" @click="buy" id="modifyButton" variant="primary">Comprar</b-button>
                <b-button style="width: 33%" @click="sell" variant="danger">Vender</b-button>
              </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getCookie } from './helpers/helpers';
import VueTradingView from 'vue-trading-view';

const props = defineProps(['id']);
let group = ref([]);

let form = ref({
  cantidad: '',
  isSandbox: '',
  assetId: props.id,
  isAdmin: ''
});

const sell = async() => {
  // Descomentar si se añaden credenciales de binance
/*
  try {
    const response = await axios.post('http://localhost:9010/asset/sell', form.value, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    showCreateGroupModal.value = false;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modal.value = true;
  }
  */
};

const buy = async() => {
  // Descomentar si se añaden credenciales de binance
  /*
  try {
    const response = await axios.post('http://localhost:9010/asset/buy', form.value, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    showCreateGroupModal.value = false;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modal.value = true;
  }*/
  
};

const fetchGroup = async () => {
    let groupId = props.id;
  try {
    const response = await axios.get('http://localhost:9010/asset/' + groupId, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    group.value = {
      name: response.data.name,
      marketCode: response.data.marketCode
    };

    form.value.name = group.value.name;
    form.value.enableSocialTrading = group.value.enableSocialTrading;

    const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
  script.async = true;
  script.innerHTML = JSON.stringify({
    "container_id": "technical-analysis-chart-demo",
  "width": "400%",
  "height": "100%",
  "autosize": true,
  "symbol": group.value.marketCode,
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
  "popup_height": "900",
  "support_host": "https://www.tradingview.com"
  });

  const tradingViewContainer = document.getElementById('tradingViewContainer');
  if (tradingViewContainer) {
    tradingViewContainer.appendChild(script);
  } else {
    console.error('Element with ID "tradingViewContainer" not found.');
  }
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    // Asegúrate de tener modalError definido en tu componente si lo estás utilizando.
  }
};

onMounted(() => {
  fetchGroup();
  
});
</script>
