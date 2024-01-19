<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import { formatSelectedDate, checkDates } from '../src/pages/helpers/helpers';
import { useRouter } from 'vue-router'; // Importa el router


const router = useRouter(); // Obtiene el router;

let modal = ref(false)
let modalS = ref(false)
let modalRentDates = ref(false)
let areRentDatesSet = ref(false)
let rentDates = ref({
  from: '',
  to: '',
});

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function sesionModal() { modal.value = !modal.value; }

function rentDatesModal() { modalRentDates.value = !modalRentDates.value; }


function cerrarSesion() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  modal.value = false;
  modalS.value = true;
}


function refesh() {
  document.location.href = "/";
}

const onReset = () => {
  rentDates.value.from = '';
  rentDates.value.to = '';
};

</script>
<template>
  <body>
    <div>
      <b-navbar variant="dark">
        <div class="container">
          <b-navbar-brand style="color: white;" variant="light" to="/">
            BlackTradingBot
          </b-navbar-brand>
          <BButtonGroup v-if="getCookie('username') !== ''" style="float: right;">
            <BButton variant="link" style="color: white; text-decoration: none;" @click="sesionModal">Home</BButton>
            <BButton id="cerrarSesion" style="color: white; text-decoration: none;" variant="link" to="/briefcases">Portafolio</BButton>
            <BButton id="cerrarSesion" style="color: white; text-decoration: none;" variant="link" to="/mercado">Mercado</BButton>
            <BButton id="cerrarSesion" style="color: white; text-decoration: none;" variant="link" to="/community">Comunidad</BButton>
            <BButton id="cerrarSesion" style="color: white; text-decoration: none;" variant="link" to="/settings">IA</BButton>
          </BButtonGroup>

          <!-- Right aligned nav items -->
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            
            <b-nav-item-dropdown v-if="getCookie('username') !== ''" class="m-auto pe-4" text="Cuenta"
              toggle-class="nav-link-custom" right style="color: white;list-style-type: none;" id="accountOptions">
              <b-dropdown-item disabled>{{ getCookie("username") }}</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item to="/chats" v-if="getCookie('role') === 'Broker'">Invitaciones de grupo</b-dropdown-item>
              <b-dropdown-item to="/chats" v-if="getCookie('role') === 'Broker'">Chat</b-dropdown-item>
              <b-dropdown-item to="/settings" v-if="getCookie('role') === 'Broker'">Ajustes</b-dropdown-item>
              <b-dropdown-item to="/settingsOrganization" v-if="getCookie('role') === 'Organization'">Ajustes</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-item @click="sesionModal">Cerrar Sesión</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-navbar-nav class="ml-auto" v-if="getCookie('username') === ''">
              <b-button id="signup" variant="light" to="/signup">Sign Up</b-button>
              <b-button id="login" style="margin-left: 0.5rem" variant="primary" to="/signin">Log In</b-button>
            </b-navbar-nav>
          </div>
        </div>
      </b-navbar>
    </div>
    <main class="container page-view">
      <router-view />
    </main>
    <BModal v-model="modal" title="¿Quieres cerrar sesión?" hide-footer>
      ¿Quieres cerrar tu sesión actual?
      <br>
      <br>

      <BButtonGroup style="float: right;">
        <BButton @click="sesionModal">Cancelar</BButton>
        <BButton id="cerrarSesion" variant="danger" @click="cerrarSesion">Cerrar sesión</BButton>
      </BButtonGroup>
    </BModal>
    <BModal v-model="modalS" title="Cerrar sesión" hide-footer> Se ha cerrado sesión correctamente
      <br>
      <br>
      <BButtonGroup style="float: right;">
        <BButton variant="primary" id="okCerrarSesion" @click="refesh">Ok</BButton>
      </BButtonGroup>
    </BModal>
    <BModal v-model="modalRentDates" title="Fechas del alquiler" hide-footer>
      <BForm @submit="submitRentDates" @reset="onReset" class="form-group" id="rentDatesForm">
        <BFormGroup id="input-1" label="Fecha de inicio" class="mt-3">
          <VueDatePicker v-model="rentDates.from" :enable-time-picker="false" :format="formatSelectedDate" uid="from"
            required></VueDatePicker>
        </BFormGroup>

        <BFormGroup id="input-2" label="Fecha de fin" class="mt-3">
          <VueDatePicker v-model="rentDates.to" :enable-time-picker="false" :format="formatSelectedDate" uid="to"
            required></VueDatePicker>
        </BFormGroup>
        <div style="display:flex; justify-content:space-between; width: 50%; margin: 0 auto; margin-top: 2rem;">
          <b-button id="submitRentDates" type="submit" variant="primary">Enviar</b-button>
          <b-button type="reset" variant="danger">Resetear</b-button>
        </div>
      </BForm>

    </BModal>
  </body>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.page-view {
  margin-top: 2rem;
}

#test {
  color: white;
}
</style>
