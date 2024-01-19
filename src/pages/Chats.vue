<template>
  <b-container fluid>
    <h1>Chats</h1>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <b-button class="btn btn-primary" type="submit" variant="primary" @click="mostrarModalChat">Crear chat</b-button>
    </div>
    <br>
    <h3 class="text-center">Conversaciones</h3>

    <b-row id="Itemlist">
      <h1 v-if="items.length === 0" style="text-align: center;">No existen unidades de productos</h1>
      <b-col v-if="items.length > 0" md="12">
        <b-card v-for="item in items" :key="item.value" class="m-2">
          <Chat :item="item" :logged="isAdmin" :isAdmin="isAdmin" :eventEdit="setOperational" :eventDelete="deleteItemModal" />
        </b-card>
      </b-col>
    </b-row>
    

    <!-- Modal de confirmación -->
    <b-modal v-model="showCreateChat" @ok="crearChat()" @cancel="cerrarChat">
        <h5>Crear chat</h5>
        <div class="form-group">
          <label for="input1">Introduce email del broker</label>
          <input v-model="form.email" type="text" class="form-control" id="input1" required>
        </div>
        <div class="form-group">
          <label for="input1">Message</label>
          <input v-model="form.message" type="text" class="form-control" id="input1" required>
        </div>
    </b-modal>
    <BModal v-model="modal" title="Error" ok-only>Usuario no encontrado</BModal>
    </b-container>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { getCookie } from './helpers/helpers';

let categories = ref([]);
let showConfirmationModal = ref(false);
let modal = ref(false);

let form = ref({
  email: '',
  message: '',
});


let categoryToDelete = ref(null);
let showCreateChat = ref(false);
let items = ref([]);

const listChat = async() => {

  try {
    const response = await axios.get('http://localhost:9005/chat/get/' + getCookie("userId"), {
        headers: {
          'Authorization': getCookie("token")
        }});
      items.value = response.data.map((item) => ({
        userSendedEmail: item.userSendedId.email,
        message: item.message,
        createdAt: item.createdAt,
      }));
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modal.value = true;
  }
};

const mostrarModalChat = (category) => {
  showCreateChat.value = true;
};

const cerrarChat = () => {
  showCreateChat.value = false;
};

const crearChat = async() => {

  try {
    const response = await axios.post('http://localhost:9005/chat/' + getCookie('username'), form.value, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    showCreateChat.value = false;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modal.value = true;
  }
};

const eliminarCategoria = async (categoryId) => {
  try {
    await axios.delete(`http://localhost:18081/categories/${categoryId}`);

    showConfirmationModal.value = false;
    getCategories();
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    modal.value = true;
  }
};

const mostrarModalEliminar = (category) => {
  categoryToDelete.value = category || null;
  showConfirmationModal.value = true;
};

const cancelarEliminacion = () => {
  categoryToDelete.value = null;
  showConfirmationModal.value = false;
};

const mostrarCategoriaPadre = (id) => {
  return categories.value[id].name;
}
listChat();
</script>
