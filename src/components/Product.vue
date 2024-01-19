<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({ product: Object , eventEdit : Function, eventDelete : Function, isAdmin: Boolean})

let product = props.product;
let onEdit = props.eventEdit;
let onDelete = props.eventDelete;
let isAdmin = props.isAdmin;

function navigateToItem(productId) { // Al clickar en un product te envia a Items con el productId
  router.push({name: "Items", params: {id: productId}})
}

</script>

<template>
    
    <b-row id="producto">
        <div style="display: flex; justify-content: space-between;">
        <div style="flex:1">
            <img style="width: 100px; height: 100px;" class="img-thumbnail" src="../assets/img/png.png">
        </div>
        <div style="justify-content: space-between;flex: 2 ;
             display: flex;  flex-direction: column;">
            <h4 md="2">{{ product.name }}</h4>
            <p md="2">{{ product.category.description }}</p>
            <!--<p md="2">{{ product.brand }} {{ product.model }}</p>-->
        </div>
        <div style="flex:3">
          <p md="2">{{ product.description }}</p>
          <b-button id="toItems" variant="light" @click="navigateToItem(product.value)">Unidades</b-button>
        </div>
        <div style="justify-content: center;
             display: flex;  flex-direction: column;">
            <p md="2"><strong>{{ product.dailyPrice }} €/día</strong></p>
        </div>
        <div v-if="isAdmin" style="justify-content: center; display: flex;  flex-direction: column;">
              <b-nav-item-dropdown id="menuProduct" class="m-auto pe-4" text="Opciones" toggle-class="nav-link-custom"
                style="list-style-type: none;">
                <b-dropdown-item @click="onEdit(product)" >Editar producto</b-dropdown-item>
                <div id="deleteProduct" @click="onDelete(product)"><b-dropdown-item >Borrar producto</b-dropdown-item></div>
              </b-nav-item-dropdown>
            </div>
    </div>
    </b-row>
</template>