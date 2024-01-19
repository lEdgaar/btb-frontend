<template>
  <div>
  <h1>Grupo</h1>
  <br>
  <br>
    <h1>{{form.name}}</h1>
    <br>
    <h2>{{form.title}}</h2>
    <br>
    <h3> Description: {{form.description}}</h3>
    <br>
    <div v-if="form.isAdmin" style="display:flex; justify-content:space-around; width: 100%; margin: 0 auto; margin-top: 2rem;">
                <b-button style="width: 33%"  id="modifyButton" variant="primary">Modificar</b-button>
                <b-button style="width: 33%" variant="danger">Eliminar cuenta</b-button>
              </div>
    <br>
    <br>
    <h3> Canales </h3>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getCookie } from './helpers/helpers';

const props = defineProps(['id']);
let group = ref([]);

let form = ref({
  name: '',
  title: '',
  description: '',
  isAdmin: ''
});

const fetchGroup = async () => {
    let groupId = props.id;
  try {
    const response = await axios.get('http://localhost:9006/groups/' + groupId, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    group.value = {
      name: response.data.group.name,
      title: response.data.group.title,
      description: response.data.group.description,
      isAdmin: response.data.admin
    };

    form.value.name = group.value.name;
    form.value.title = group.value.title;
    form.value.description = group.value.description;
    form.value.isAdmin = group.value.isAdmin;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    // Asegúrate de tener modalError definido en tu componente si lo estás utilizando.
  }
};

onMounted(() => {
  fetchGroup();
});
</script>
