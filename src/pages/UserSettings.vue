<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { getCookie } from './helpers/helpers';

let form = ref({
  firstName: '',
  surname: '',
  dateOfBirth: '',
  gender: ''
});

let modal = ref(false);
let user = ref([]);
let modalError = ref(false);

function deteleAccount() { modal.value = !modal.value; }

const fetchUser = async () => {
  var userId = getCookie("userId");
  try {
    const response = await axios.get('http://localhost:9005/brokers/' + userId, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    user.value = {
      firstName: response.data['firstName'],
      surname: response.data['surname'],
      dateOfBirth: response.data['dateOfBirth'],
      gender: response.data['gender'],
      id: response.data['id'],
    };
    form.value.firstName = user.value.firstName;
    form.value.surname = user.value.surname;
    form.value.dateOfBirth = user.value.dateOfBirth;
    form.value.gender = user.value.gender;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modalError.value = true;
  }
};

const eliminarCuenta = async () => {
  var userId = getCookie("userId");
  try {
    const response = await axios.delete('http://localhost:9005/brokers/' + userId, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modalError.value = true;
  }

  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  modal.value = false;
  document.location.href = "/";

};

const onSubmit = async (event) => {
  var userId = getCookie("userId");
  event.preventDefault();
  try {
    const response = await axios.put('http://localhost:9005/brokers/' + userId, form.value, {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    alert('Se ha modificado correctamente');
  } catch (error) {
    console.error('Error al enviar datos a la API:', error);
    modalError.value = true;
  } finally {
    onReset();
  }
  fetchUser();
};

const onReset = () => {
  form.value = {
    firstName: '',
    surname: '',
    dateOfBirth: '',
    gender: ''
  };
};

onMounted(() => {
  fetchUser();
});

</script>

<template>
  <b-container fluid>
    <b-row align-h="center" justify="center">
      <b-col md="6">
        <b-card class="p-3" rounded="lg" shadow="hover" style="height: 100%;">
          <div>
            <b-card-title class="mb-3">Ajustes de la cuenta</b-card-title>
            <b-form @submit="onSubmit" @reset="onReset">

            <b-form-group class="mt-3" id="input-group-1" label="Nombre" label-for="input-1">
      <b-form-input id="input-1" v-model.defer="form.firstName" required></b-form-input>
    </b-form-group>

    <b-form-group class="mt-3" id="input-group-2" label="Apellido" label-for="input-2">
      <b-form-input id="input-2" v-model.defer="form.surname" required></b-form-input>
    </b-form-group>

    <b-form-group class="mt-3" id="input-group-3" label="Fecha de Nacimiento" label-for="input-3">
      <b-form-input id="input-3" v-model.defer="form.dateOfBirth" required></b-form-input>
    </b-form-group>

    <b-form-group class="mt-3" id="input-group-4" label="Género" label-for="input-4">
      <b-form-select id="input-4" v-model.defer="form.gender" required>
        <b-form-select-option value="M">Masculino</b-form-select-option>
        <b-form-select-option value="F">Femenino</b-form-select-option>
      </b-form-select>
    </b-form-group>

              <div style="display:flex; justify-content:space-around; width: 100%; margin: 0 auto; margin-top: 2rem;">
                <b-button style="width: 33%" type="submit" id="modifyButton" variant="primary">Modificar</b-button>
                <b-button style="width: 33%" @click="deteleAccount" variant="danger">Eliminar cuenta</b-button>
              </div>
            </b-form>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>

  <BModal v-model="modal" title="¿Quieres eliminar la cuenta?" hide-footer>
      ¿Quieres eliminar la cuenta?
      <br>
      <br>

      <BButtonGroup style="float: right;">
        <BButton @click="sesionModal">Cancelar</BButton>
        <BButton id="cerrarSesion" variant="danger" @click="eliminarCuenta">Eliminar</BButton>
      </BButtonGroup>
    </BModal>

  <b-modal v-model="modalError" title="Error" ok-only> Se ha producido un error en el sistema.</b-modal>

</template>