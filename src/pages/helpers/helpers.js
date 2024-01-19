// Formatea la fecha seleccionada para enviarla a la API
export const formatDate = (date) => {
    // Formatear la fecha a "yyyy-MM-dd"
    let newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Formatea la fecha seleccionada para mostrarla en el componente VueDatePicker
export const formatSelectedDate = (date) => {
    // Formatear la fecha a "dd/MM/yyyy"
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

//Comprueba que la fecha de inicio no sea mayor que la fecha de fin
export const checkDates = (dateFrom, dateTo) => {
    if (dateFrom > dateTo) {
        return false;
    }
    return true;
};

export const regexPassword = (pass) => {
    let exp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/gm)
    return exp.exec(pass);
}

export const regexEmail = (pass) => {
    let exp = new RegExp(/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/)
    return exp.exec(pass);
}

export function getCookie(cname) {
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

