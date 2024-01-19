<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';
import { regexPassword, regexEmail } from './helpers/helpers';
import { useRouter } from 'vue-router';
import VueDatePicker from '@vuepic/vue-datepicker';

const router = useRouter();

let form = ref({
    firstName: '',
    surname: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    passwordSecurity: '',
    countryCode: 'ES',
});


let formState = ref({
    nameValueE: null,
    email: null,
    password: null,
    passwordSecurity: null,
});


let modal = ref(false);
let modalEmail = ref(false);


const onSubmit = async () => {
    if (form.value.firstName.length !== 0 && form.value.surname.length !== 0 && formState.value.email === true && formState.value.password === true && formState.value.passwordSecurity === true) {

        var dia = form.value.dateOfBirth.getUTCDate();
        var mes = form.value.dateOfBirth.getUTCMonth() + 1;
        var anio = form.value.dateOfBirth.getUTCFullYear();
        form.value.dateOfBirth = dia + '-' + mes + '-' + anio;

        try {
            axios.post('http://localhost:9005/brokers/', form.value
                
            ).then(() => {
                router.push({name: "Login"});
            }).catch(function (a) {
                modalEmail.value = true;
            });

        } catch (error) {
            console.error('Error al obtener datos de la API de usuarios:', error);
            modalEmail.value = true;
        }



    } else {
        modal.value = true;
    }
}

const testRegexPass = () => {
    return regexPassword(form.value.password) !== null
}

const testRegexEmail = () => {
    return regexEmail(form.value.email) !== null
}


const stateName = computed(() => form.value.firstName.length > 0 ? formState.value.nameValueE = true : formState.value.nameValueE = null)
const stateSurname = computed(() => form.value.surname.length > 0 ? formState.value.nameValueE = true : formState.value.nameValueE = null)

const stateEmail = computed(() => form.value.email.length === 0 ? formState.value.password = null : formState.value.email = testRegexEmail())
const invalidFeedbackEmail = computed(() => form.value.email.length > 0 ? 'El correo no cumple con los requisitos' : '')

const statePass = computed(() => form.value.password.length === 0 ? formState.value.password = null : formState.value.password = testRegexPass())
const invalidFeedbackPass = computed(() => form.value.password.length >= 8 ? 'La contraseña no cumple con los requisitos' : form.value.password.length > 0 ? 'Escribe mas de 8 caracteres' : '')

const statePassSecu = computed(() => form.value.passwordSecurity.length > 0 ? form.value.password === form.value.passwordSecurity ? formState.value.passwordSecurity = true : formState.value.passwordSecurity = false : formState.value.passwordSecurity = null)
const invalidFeedbackPassSecu = computed(() => form.value.passwordSecurity.length > 0 ? form.value.password === form.value.passwordSecurity ? '' : 'Las contraseñas no coinciden' : '')

</script>
<template>
    <b-container fluid>
        <b-row align-h="center" justify="center">
            <b-col md="7">
                <b-card class="p-3" rounded="lg" shadow="hover" style="height: 100%;">
                    <div>
                        <b-card-title class="mb-3">Registrate</b-card-title>
                        <b-button id="organization" variant="primary" to="/signupOrganization">Soy una organización</b-button>
                        <b-form @submit="onSubmit">
                            <b-form-group class="mt-3" id="input-group-1" label="Nombre" label-for="input-1"
                                :state="stateName">
                                <b-form-input id="input-1" v-model="form.firstName" placeholder="Escribe tu nombre completo"
                                    type=text :state="stateName"></b-form-input>
                            </b-form-group>
                            <b-form-group class="mt-3" id="input-group-5" label="Apellido" label-for="input-5"
                                :state="stateSurname">
                                <b-form-input id="input-5" v-model="form.surname" placeholder="Escribe tu apellido"
                                    type=text :state="stateSurname"></b-form-input>
                            </b-form-group>
                            <b-form-group class="mt-3" id="input-group-2" label="Correo electronico" label-for="input-2"
                                :invalid-feedback="invalidFeedbackEmail" :state="stateEmail">
                                <b-form-input id="input-2" v-model="form.email" placeholder="Escribe tu correo electronico"
                                    type=email :invalid-feedback="invalidFeedbackEmail" :state="stateEmail"></b-form-input>
                            </b-form-group>

                            <BFormGroup id="input-1" label="Fecha de nacimiento" class="mt-3">
                            <VueDatePicker v-model="form.dateOfBirth" :enable-time-picker="false" :format="formatSelectedDate" uid="from"
                                required></VueDatePicker>
                            </BFormGroup>

                            <b-form-group class="mt-3" id="input-group-4" label="Género" label-for="input-4">
                            <b-form-select id="input-4" v-model.defer="form.gender" required>
                                <b-form-select-option value="M">Masculino</b-form-select-option>
                                <b-form-select-option value="F">Femenino</b-form-select-option>
                            </b-form-select>
                            </b-form-group>

                            <div style="display:flex; justify-content:space-between; margin: 0 auto;">
                                <b-form-group style="flex: 1; padding: 0 1rem 0 0;" class="mt-3" id="input-group-3"
                                    label="Contraseña" label-for="input-3"
                                    description="Debe tener al menos un caracter especial, una minuscula, una mayuscula y un numero"
                                    :invalid-feedback="invalidFeedbackPass" :state="statePass">
                                    <b-form-input id="input-3" v-model="form.password" type=password
                                        :invalid-feedback="invalidFeedbackPass" :state="statePass"></b-form-input>
                                </b-form-group>
                                <b-form-group style="flex: 1;" class="mt-3" id="input-group-4" label="Confirma contraseña"
                                    label-for="input-4" :invalid-feedback="invalidFeedbackPassSecu" :state="statePassSecu">
                                    <b-form-input id="input-4" v-model="form.passwordSecurity" type=password
                                        :invalid-feedback="invalidFeedbackPassSecu" :state="statePassSecu"></b-form-input>
                                </b-form-group>
                            </div>
                            <div style="display:flex; justify-content:space-between; width: 100%; margin: 4rem auto 0;">
                                <b-button type="submit" id="signupbutton" variant="primary">Registrate</b-button>
                            </div>

                        </b-form>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
    <BModal v-model="modal" title="Valores incorrectos o sin introducir" ok-only> Debe de introducir todos los campos
        correctamente. </BModal>
    <BModal v-model="modalEmail" title="Error" ok-only> El correo electronico indicado esta en uso. Escriba otro correo
        electronico </BModal>
</template>