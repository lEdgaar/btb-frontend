<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { getCookie } from './helpers/helpers';
import { useRouter } from 'vue-router';

let form = ref({
  userId: '',
  firstName: '',
  surname: '',
  description: '',
  banReasonId: '',
  endDate: '',
});
let modal = ref(false)

const getUsersByEmail = async () => {
  const desc = form.value.description;
  try {
    const response = await axios.get('http://localhost:9005/brokers/search?name=' + desc , {
      headers: {
        'Authorization': getCookie("token")
      }
    });
    user.value = {
      firstName: response.data['firstName'],
      surname: response.data['surname'],
      dateOfBirth: response.data['dateOfBirth'],
      gender: response.data['gender'],
      id: response.data['userId'],
    };
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    modal.value = true;
  }
}
</script>
<template>
<b-container fluid>
    <h1>Panel de Organización</h1>
    <br>
    <h3>Añadir broker a organización</h3>
    <br>
    <b-row class="mt-3" style="text-align: left;" align-h="center" justify="center">
      <b-col md="8">
        <b-form-group label="Búsqueda:" label-for="searchAsset">
          <b-form-input id="searchAsset" v-model="form.description"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <br>
    <div style="text-align: center;">
      <BButtonGroup>
        <b-button id="busqueda" variant="primary" @click="getUsersByEmail">Encontrar</b-button>
      </BButtonGroup>
    </div>
    <br>
    <h3 class="text-center">Información</h3>
    <div v-if="user != null">
        <h3>Información del Usuario</h3>
            Nombre: {{user.firstName}} <br/>
            Apellido: {{user.surname}} <br />
        <br>
        <br>

        <b-form @submit="onSubmit">

                            <BFormGroup id="input-1" label="Fecha finalización bloqueo" class="mt-3">
                            <VueDatePicker v-model="form.endDate" :enable-time-picker="false" :format="formatSelectedDate" uid="from"
                                required></VueDatePicker>
                            </BFormGroup>

                            <b-form-group class="mt-3" id="input-group-4" label="Motivo" label-for="input-4">
                            <b-form-select id="input-4" v-model.defer="form.banReasonId" required>
                                <b-form-select-option value="1">MALA CONDUCTA</b-form-select-option>
                                <b-form-select-option value="2">FALTAS DE RESPETO</b-form-select-option>
                                <b-form-select-option value="3">NO CUMPLE EL ACUERDO LEGAL</b-form-select-option>
                                <b-form-select-option value="4">MAL USO DE LA PLATAFORMA</b-form-select-option>
                            </b-form-select>
                            </b-form-group>

                            
                            <div style="display:flex; justify-content:space-between; width: 100%; margin: 4rem auto 0;">
                                <b-button @click="mostrarModalBloquear" id="signupbutton" variant="danger">Bloquear</b-button>
                            </div>

                        </b-form>
    </div>


    <!-- Modal de confirmación -->
    <b-modal v-model="showConfirmationModal" @ok="bloquearUsuario()" @cancel="cancelarBloqueo">
        <h5>Confirmar bloqueo</h5>
        <p>
            ¿Estás seguro de que deseas bloquear el usuario?
        </p>
    </b-modal>
    <BModal v-model="modal" title="Error" ok-only>Usuario no encontrado</BModal>
  </b-container>
</template>