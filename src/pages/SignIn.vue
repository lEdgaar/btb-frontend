<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';
import { regexEmail } from './helpers/helpers';
import { useRouter } from 'vue-router'; // Importa el router


const router = useRouter(); // Obtiene el router


let form = ref({
    email: '',
    password: '',
});

let formState = ref({
    email: null,
    password: null,
});


let modal = ref(false);
let modalEmail = ref(false);
let emailQuere = ref(false);

const onSubmit = async () => {
    try {
        const response = await axios.post('http://localhost:9005/user/login', form.value)
            .then((data) => {
                const d = new Date();
                d.setTime(d.getTime() + (0.1 * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toUTCString();
                document.cookie = "token=" + data.data.token + "; " + expires;
                document.cookie = "username=" + form.value.email + "; " + expires;
                document.cookie = "role=" + data.data.role + "; " + expires;
                document.cookie = "userId=" + data.data.userId + "; " + expires;
                if (data.data.role == "Admin") {
                    router.push("/admin").then(() => { document.location.reload(); });
                } else if (data.data.role == "Organization") {
                    router.push("/organization").then(() => { document.location.reload(); });
                } else {
                    router.push("/").then(() => { document.location.reload(); });
                }
                
                
            });
    } catch (error) {
        console.error('Error al obtener datos de la API de usuarios:', error);
        modalEmail.value = true;
    }
}

const testRegexEmail = () => {
    return regexEmail(form.value.email) !== null
}

const stateEmail = computed(() => form.value.email.length === 0 ? formState.value.password = null : formState.value.email = testRegexEmail())
const invalidFeedbackEmail = computed(() => form.value.email.length > 0 ? 'El correo no cumple con los requisitos' : '')

</script>
<template>
    <b-container fluid>
        <b-row align-h="center" justify="center">
            <b-col md="7">
                <b-card class="p-3" rounded="lg" shadow="hover" style="height: 100%;">
                    <div>
                        <b-card-title class="mb-3">Iniciar Sesión</b-card-title>
                        <b-form @submit="onSubmit">
                            <b-form-group class="mt-3" id="input-group-2" label="Correo electronico" label-for="input-2"
                                :invalid-feedback="invalidFeedbackEmail" :state="stateEmail">
                                <b-form-input id="input-2" v-model="form.email" placeholder="Escribe tu correo electronico"
                                    type=email :invalid-feedback="invalidFeedbackEmail" :state="stateEmail"></b-form-input>
                            </b-form-group>
                            <div style="display:flex; justify-content:space-between; margin: 0 auto;">
                                <b-form-group style="flex: 1; padding: 0 1rem 0 0;" class="mt-3" id="input-group-3"
                                    label="Contraseña" label-for="input-3">
                                    <b-form-input id="input-3" v-model="form.password" type=password></b-form-input>
                                </b-form-group>
                            </div>
                            <div style="display:flex; justify-content:space-between; width: 50%; margin: 4rem auto 0;">
                                <b-button id="submitLogin" type="submit" variant="primary">Iniciar Sesión</b-button>
                                <b-button type="reset" variant="danger" to="/">Cancelar</b-button>
                            </div>

                        </b-form>

                    </div>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
    <BModal v-model="modal" title="Valores incorrectos o sin introducir" ok-only> Debe de introducir todos los campos
        correctamente. </BModal>
    <BModal v-model="modalEmail" title="Error" ok-only> El correo electronico o la contraseña indicado son incorrectos.
    </BModal>
</template>