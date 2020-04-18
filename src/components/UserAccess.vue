<template>
    <div class="text-center">
        <div class="card text-left">
            <div class="card-header bg-dark text-white">
                {{ $data['title'] }}  
            </div>
            <div class="card-body">
              <div class="form-row">
                <div class="form-group col-md-5">
                  <label>Nombre</label>
                  <input type="text" class="form-control" placeholder="Ingrese el nombre" v-model="nombre">
                </div>
                <div class="form-group col-md-5">
                  <label>Contraseña de acceso</label>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <input type="password" class="form-control" placeholder="Ingrese la contraseña de acceso" v-model="clave">
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-2">
                  <div class="form-row">
                    <div class="form-group col-md-12 ">
                      <br>
                      <button type="button" class="btn btn-primary" style="margin-top: 8px;" @click="createdUser">Acceder</button>
                    </div>              
                  </div>              
                </div>              
              </div>              
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
      title: "Acceso de usuario",
      clave:"",
      nombre:"",
    }),
    methods: {
      ifErrorList(listErrors){
        if(this.nombre == ""){
          listErrors.push("El nombre de la usuario es requerido")
        }
        if(this.clave == ""){  
          listErrors.push("La contraseña de acceso a la usuario es requerido")
        }
        
        if(this.clave.length < 6){
          listErrors.push("La contraseña de acceso debe tener 6 caracteres o digitos")
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
      },
      createUserXML: function(item){
              return '\
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
              <soapenv:Header/>\
              <soapenv:Body>\
              <__call>\
                  <method_name>loginUser</method_name>\
                  <arguments>\
                    <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">15hyhy</authentication>\
                    <nombre xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.nombre+'</nombre>\
                    <clave xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.clave+'</clave>\
                  </arguments>\
              </__call>\
              </soapenv:Body>\
          </soapenv:Envelope>';
      },
      createdUser: function (){

        if(this.validateData() === true){  
          let X2JS = new x2js()
          let contenido = this
          axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
          axios.post('http://localhost/projects/soap_project/Route/User.php',
              this.createUserXML(contenido),{
                  headers:{
                      'Content-Type': 'text/xml',
                      'Accept': 'text/xml',
                  }
              }).then((res)=>{
                let jsonObj = X2JS.xml2js(res.data);
                window.test = jsonObj;
                let resultado = ''
                
                for (let row of jsonObj.Envelope.Body.__callResponse.return.item){
                  
                  if(row.key.toString() == "status"){
                    resultado = row.value.toString();
                  }

                  if(resultado == "success" && row.key.toString() == "token"){
                    localStorage.setItem('token-access-user', row.value.toString())
                    location.href = "/#/dashboard"
                  }

                  if(resultado == "success" && row.key.toString() == "message"){
                    Swal.fire({
                      title: 'Respuesta por acceso!',
                      text: row.value.toString(),
                      icon: 'success',
                      confirmButtonText: 'Cerrar'
                    })
                  }
                  if(resultado == "error" && row.key.toString() == "message"){
                    Swal.fire({
                      title: 'Respuesta por error!',
                      text: row.value.toString(),
                      icon: 'warning',
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