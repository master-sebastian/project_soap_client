<template>
    <div class="text-center">
        <hr>
        <button v-if="inverso" type="buttom" class="btn btn-primary" @click="cambiar()">{{text}}</button>
        <div class="card text-left" v-if="!inverso">
            <div class="card-header bg-dark text-white">
                <button type="buttom" class="btn btn-danger" @click="cambiar()">X</button>
                {{ $data['title'] }}  
            </div>
            <div class="card-body">
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label>Nombre</label>
                  <input type="text" class="form-control" placeholder="Ingrese el nombre" v-model="nombre">
                </div>
                <div class="form-group col-md-4">
                  <label>Clave de acceso</label>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input type="password" class="form-control" placeholder="Ingrese la clave de acceso" v-model="token">
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-4">
                  <label>Confirmacion de clave de acceso</label>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input type="password" class="form-control" placeholder="Ingrese la confirmación de la clave de acceso" v-model="confirmacionToken">
                    </div>
                  </div>
                </div>
              </div>              
              <button type="button" class="btn btn-primary" @click="createdTable">Guardar</button>
            </div>
        </div>
    </div>
</template>

<script>
  import Swal from 'sweetalert2';
  import x2js from 'x2js';
  import axios from 'axios';
  export default {
    props: {
      text: String,   
    },
    data: () => ({
      title: "Creación de mesa",
      inverso: true,
      confirmacionToken:"",
      token:"",
      nombre:"",
    }),
    methods: {
      cambiar(){
          this.inverso = !this.inverso        
      },
      ifErrorList(listErrors){
        if(this.nombre == ""){
          listErrors.push("El nombre de la mesa es requerido")
        }
        if(this.token == ""){  
          listErrors.push("La clave de acceso a la mesa es requerido")
        }
        
        if(this.token.length < 6){
          listErrors.push("La clave de acceso debe tener 6 caracteres o digitos")
        }
        
        if(this.confirmacionToken == ""){  
          listErrors.push("La confirmación clave de acceso a la mesa es requerido")
        }
        
        if(this.token != this.confirmacionToken){  
          listErrors.push("La clave y su confirmación correspondiente deben ser iguales")
        }
        return listErrors
      },
      validateData(){
        let errors = [];
        errors = this.ifErrorList(errors);
        if(errors.length > 0){
          let text = "";
          for(let i = 0; i < errors.length; i++){
            text = text + '<li class="text-left">'+errors[i]+'</li>'
          }
          Swal.fire({
            title: '',
            html: '<div class="alert alert-warning" role="alert">\
                    <h4 class="alert-heading">Error en el formulario!</h4>\
                    <hr>\
                    <ul class="mb-0">'+text+'</ul>\
                    </div>',  
            icon: 'warning',
            confirmButtonText: 'Cerrar'
          })
          return false;
        }else{
          return true;
        }
      },accessModule(jsonObj){
          let resultado = ''
          if(jsonObj.Envelope.Body.__callResponse.return["_SOAP-ENC:arrayType"] != "xsd:ur-type[0]" && Array.isArray(jsonObj.Envelope.Body.__callResponse.return.item)){
              for (let row of jsonObj.Envelope.Body.__callResponse.return.item){
                  if(row.item != undefined){
                      return true;
                  }
                  if(row.key.toString() == "status"){
                      resultado = row.value.toString();
                  }
                  if(resultado == "error-autentication" && row.key.toString() == "message"){
                      alert(row.value.toString())
                      location.href = "/#/user-access"
                      return false;
                  }
              }
          }
          return true;
      },
      createTableXML: function(item){
              return '\
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
              <soapenv:Header/>\
              <soapenv:Body>\
              <__call>\
                  <method_name>createTable</method_name>\
                  <arguments>\
                      <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
                      <nombre xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.nombre+'</nombre>\
                      <token xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.token+'</token>\
                  </arguments>\
              </__call>\
              </soapenv:Body>\
          </soapenv:Envelope>';
      },
      createdTable: function (){

        if(this.validateData() === true){  
          let X2JS = new x2js()
          let contenido = this
          axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
          axios.post('http://localhost/projects/soap_project/Route/Table.php',
              this.createTableXML(contenido),{
                  headers:{
                      'Content-Type': 'text/xml',
                      'Accept': 'text/xml',
                  }
              }).then((res)=>{
                let jsonObj = X2JS.xml2js(res.data);
                window.test = jsonObj;
                let resultado = ''
                for (let row of jsonObj.Envelope.Body.__callResponse.return.item){
                  if(row.key.toString() == "status" && row.value.toString() == "success"){
                    resultado = row.value.toString();
                  }
                  if(resultado == "success" && row.key.toString() == "message"){
                    
                    contenido.nombre = ""
                    contenido.token = ""
                    contenido.confirmacionToken = ""
                    contenido.cambiar()
                    contenido.$emit("click", 'refresh')

                    Swal.fire({
                      title: 'Respuesta por creación!',
                      text: row.value.toString(),
                      icon: 'success',
                      confirmButtonText: 'Cerrar'
                    })
                  }
                }
              }).catch((err)=>{
                  console.log(err)
              }
          );
        }
      }
    },created(){      
    }
  }
</script>