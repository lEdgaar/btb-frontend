<script setup>

  import { defineProps } from 'vue'
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  const props = defineProps({ item : Object , logged : Boolean, isAdmin : Boolean,  eventEdit : Function, eventDelete : Function})

  let item = props.item;
  let logged = props.logged;
  let onEdit = props.eventEdit;
  let onDelete = props.eventDelete;

  let mostrar = ref(true)

  const router = useRouter();

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
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





</script>

<template>
  <div style="display: flex; justify-content: space-between;">

    <div style="justify-content: space-between; flex: 2; display: flex;  flex-direction: column;">
      <h4 md="2">{{ item.userSendedEmail }}</h4>
    </div>

    <div style="flex:3">
      <p md="2">Mensaje: {{ item.message }}</p>
    </div>
  </div>
  <b-row id="item"> </b-row>
</template>