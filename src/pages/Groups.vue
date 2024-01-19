<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { getCookie } from './helpers/helpers';
import { useRouter } from 'vue-router';
import VueTradingView from 'vue-trading-view';
import VueDatePicker from '@vuepic/vue-datepicker';

const router = useRouter();

let form = ref({
  userId: '',
  firstName: '',
  surname: '',
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

const crearGrupo = async() => {

  try {
    const response = await axios.post('http://localhost:9006/groups/', form.value, {
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
    const response = await axios.get('http://localhost:9006/groups/', {
        headers: {
          'Authorization': getCookie("token")
        }});
      items.value = response.data.map((item) => ({
        id: item.id,
        name: item.name,
        title: item.title,
        description: item.description
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
    <h1>Comunidad</h1>
    <br>
    <h3>Grupos</h3>
    <BButtonGroup>
        <b-button id="busqueda" variant="primary" @click="mostrarModalGrupo">Crear grupo</b-button>
    </BButtonGroup>
    <b-row class="mt-3" style="text-align: left;" align-h="center" justify="center">
    </b-row>
    <br>
    <b-row id="Itemlist">
      <h1 v-if="items.length === 0" style="text-align: center;">No existen unidades de productos</h1>
      <b-col v-if="items.length > 0" md="12">
        <b-card v-for="item in items" :key="item.value" class="m-2">
          <Item :item="item" :logged="isAdmin" :isAdmin="isAdmin" :eventEdit="setOperational" :eventDelete="deleteItemModal" />
        </b-card>
      </b-col>
    </b-row>


    <b-modal v-model="showCreateGroupModal" @ok="crearGrupo()" @cancel="crearGrupo">
        <h5>Crear grupo</h5>
        <div class="form-group">
          <label for="input1">Nombre</label>
          <input v-model="form.name" type="text" class="form-control" id="input1" required>
        </div>
        <div class="form-group">
          <label for="input1">Title</label>
          <input v-model="form.title" type="text" class="form-control" id="input1" required>
        </div>
        <div class="form-group">
          <label for="input2">Description</label>
          <input v-model="form.description" type="text" class="form-control" id="input2" required>
        </div>
    </b-modal>
    <BModal v-model="modal" title="Error" ok-only>Usuario no encontrado</BModal>
  </b-container>
</template>