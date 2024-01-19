<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { getCookie } from './helpers/helpers';
import { useRouter } from 'vue-router';
import VueTradingView from 'vue-trading-view';
import VueDatePicker from '@vuepic/vue-datepicker';

const router = useRouter();

let form = ref({
  userId: getCookie("userId"),
  name: '',
  enableSocialTrading: '',
  description: '',
  banReasonId: '',
  endDate: '',
});

let products = ref([]);
let productsQuery = ref([]);
let user = ref();
let productToDelete = ref(null);
let modal = ref(false)
let modalS = ref(false)
let showCreateGroupModal = ref(false)
let items = ref([]);


const mostrarModalGrupo = (category) => {
  showCreateGroupModal.value = true;
};

const cancelarGrupo = () => {
  showCreateGroupModal.value = false;
};

const crearPortafolio = async() => {

  try {
    const response = await axios.post('http://localhost:9010/briefcase/', form.value, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    showCreateGroupModal.value = false;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modal.value = true;
  }
};

const listGroup = async() => {

  try {
    const response = await axios.get('http://localhost:9010/briefcase/user/' + getCookie("userId"), {
        headers: {
          'Authorization': getCookie("token")
        }});
      items.value = response.data.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
      }));
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modal.value = true;
  }
};

listGroup();
</script>

<template>
  <b-container fluid>
    <h1>Portafolios</h1>
    <br>
    <h3>Mis portafolios</h3>
    <BButtonGroup>
        <b-button id="busqueda" variant="primary" @click="mostrarModalGrupo">Crear portafolio</b-button>
    </BButtonGroup>
    <b-row class="mt-3" style="text-align: left;" align-h="center" justify="center">
    </b-row>
    <br>
    <b-row id="Itemlist">
      <h1 v-if="items.length === 0" style="text-align: center;">No existen unidades de productos</h1>
      <b-col v-if="items.length > 0" md="12">
        <b-card v-for="item in items" :key="item.value" class="m-2">
          <Briefcase :item="item" :logged="isAdmin" :isAdmin="isAdmin" :eventEdit="setOperational" :eventDelete="deleteItemModal" />
        </b-card>
      </b-col>
    </b-row>


    <b-modal v-model="showCreateGroupModal" @ok="crearPortafolio()" @cancel="cancelarGrupo">
        <h5>Crear portafolio</h5>
        <div class="form-group">
          <label for="input1">Nombre del portafolio</label>
          <input v-model="form.name" type="text" class="form-control" id="input1" required>
        </div>
        <input
        class="form-check-input"
        type="checkbox"
        id="exampleCheckbox"
        v-model="form.enableSocialTrading" 
      >
      <label class="form-check-label" for="exampleCheckbox">
          Habilitar social trading
      </label>
    </b-modal>
    <BModal v-model="modal" title="Error" ok-only>Usuario no encontrado</BModal>
  </b-container>
</template>