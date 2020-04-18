<template>
    <div>
        <div class="card">
            <div class="card-header bg-dark text-white">
                <a class="btn btn-danger" href="/#/product" style="margin-top: 8px">Regresar</a>
                {{ $data['title'] }}  
            </div>
            <div class="card-body">
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label>Nombre</label>
                  <input type="text" class="form-control" placeholder="Ingrese el nombre" v-model="nombre">
                </div>
                <div class="form-group col-md-4">
                  <label>Imagen</label>
                  <div class="form-row">
                    <div class="form-group col-md-8">
                      <input type="text" class="form-control" placeholder="Ingrese la url" v-model="url_img">
                    </div>
                    <div class="form-group col-md-4">
                      <button type="buttom" class="btn btn-warning" @click="limpiar()">Limpiar</button>
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-4">
                  <label>Previsualización del producto</label>
                  <img :src="url_img" width="100px" />
                </div>
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <textarea class="form-control" rows="5" placeholder="Ingrese la descripción" v-model="descripcion"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group col-md-3">
                  <label>Costo</label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$</div>
                    </div>
                    <input type="number" class="form-control" @keyup="calcularPrecio" placeholder="Ingrese el costo" v-model="costo">
                    <div class="input-group-prepend">
                      <div class="input-group-text">COP</div>
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label>Iva</label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$</div>
                    </div>
                    <input type="number" class="form-control" @keyup="calcularPrecio" placeholder="Ingrese el iva" v-model="iva">
                    <div class="input-group-prepend">
                      <div class="input-group-text">COP</div>
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label>Ganancia</label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$</div>
                    </div>
                    <input type="number" class="form-control" @keyup="calcularPrecio" placeholder="Ingrese la ganancia" v-model="ganancia">
                    <div class="input-group-prepend">
                      <div class="input-group-text">COP</div>
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label>Precio</label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$</div>
                    </div>
                    <input type="text" class="form-control" readonly="readonly" v-model="precio">
                    <div class="input-group-prepend">
                      <div class="input-group-text">COP</div>
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label>Estado</label>
                  <select class="form-control" v-model="estado">
                    <option value="1">Activo</option>
                    <option value="2">Inactivo</option>
                  </select>
                </div>
              </div>
              <button type="button" class="btn btn-primary" @click="editProduct">Guardar</button>
            </div>
        </div>
        <br>
        <br>
    </div>
</template>

<script>
  import Swal from 'sweetalert2';
  import x2js from 'x2js';
  import axios from 'axios';
  export default {
    props: {
      idProduct:String
    },
    data: () => ({
      example : "Que mas",
      title: "Edición de producto",
      inverso: true,
      costo: 0,
      precio:0,
      ganancia:0,
      iva:0,
      descripcion:"",
      nombre:"",
      url_img:"",
      id:"",
      estado:""
    }),
    methods: {
      limpiar(){
        this.url_img = ""
      },
      calcularPrecio(){
        this.precio = Math.round((1*this.ganancia + 1*this.costo) * (1 + 1*this.iva/100)*100)/100
      },
      cambiar(){
          this.inverso = !this.inverso        
      },
      ifErrorList(listErrors){
        if(this.nombre == ""){
          listErrors.push("El nombre del producto es requerido")
        }
        if(this.descripcion == ""){  
          listErrors.push("La descripción del producto es requerido")
        }
        let costo = parseFloat(this.costo)
        if(isNaN(costo)){
          listErrors.push("La costo del producto es requerido y debe ser numerico")
        }else if(costo < 0){
          listErrors.push("La costo del producto no puede ser negativo")
        }

        let ganancia = parseFloat(this.ganancia)
        if(isNaN(ganancia)){
          listErrors.push("La ganancia del producto es requerido y debe ser numerico")
        }else if(ganancia < 0){
          listErrors.push("La ganancia del producto no puede ser negativo")
        }

        let iva = parseFloat(this.iva)
        if(isNaN(iva)){
          listErrors.push("El iva del producto es requerido y debe ser numerico")
        }else if(iva < 0){
          listErrors.push("El iva del producto no puede ser negativo")
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
      },editProductXML: function(item){
              return '\
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
              <soapenv:Header/>\
              <soapenv:Body>\
              <__call>\
                  <method_name>editProduct</method_name>\
                  <arguments>\
                      <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
                      <id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:int">'+item.id+'</id>\
                      <costo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:float">'+item.costo+'</costo>\
                      <ganancia xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:float">'+item.ganancia+'</ganancia>\
                      <iva xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:float">'+item.iva+'</iva>\
                      <descripcion xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.descripcion+'</descripcion>\
                      <nombre xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.nombre+'</nombre>\
                      <url_img xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.url_img+'</url_img>\
                      <estado xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:int">'+item.estado+'</estado>\
                  </arguments>\
              </__call>\
              </soapenv:Body>\
          </soapenv:Envelope>';
      },
      getProductXML: function(item){
              return '\
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
              <soapenv:Header/>\
              <soapenv:Body>\
              <__call>\
                  <method_name>getProduct</method_name>\
                  <arguments>\
                      <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
                      <id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:int">'+item.id+'</id>\
                  </arguments>\
              </__call>\
              </soapenv:Body>\
          </soapenv:Envelope>';
      },
      getProduct: function (){
        let X2JS = new x2js()
        let contenido = this
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios.post('http://localhost/projects/soap_project/Route/Product.php',
            this.getProductXML(contenido),{
                headers:{
                    'Content-Type': 'text/xml',
                    'Accept': 'text/xml',
                }
            }).then((res)=>{
              let jsonObj = X2JS.xml2js(res.data);
              window.test = jsonObj;
              let resultado = ''
              if(!contenido.accessModule(jsonObj)){
                return; 
              }
              for (let row of jsonObj.Envelope.Body.__callResponse.return.item.item){
                if(["descripcion","nombre", 'url_img','estado'].includes(row.key.toString())){
                  contenido[row.key.toString()] = row.value.toString()
                }else if(["costo", "iva", 'ganancia'].includes(row.key.toString())){
                  contenido[row.key.toString()] = parseFloat(row.value.toString())
                }
              }
              contenido.calcularPrecio()
            }).catch((err)=>{
                console.log(err)
            }
        );
      },
      accessModule(jsonObj){
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
      editProduct: function (){
        if(this.validateData() === true){  
          let X2JS = new x2js()
          let contenido = this
          axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
          axios.post('http://localhost/projects/soap_project/Route/Product.php',
              this.editProductXML(contenido),{
                  headers:{
                      'Content-Type': 'text/xml',
                      'Accept': 'text/xml',
                  }
              }).then((res)=>{
                let jsonObj = X2JS.xml2js(res.data);
                window.test = jsonObj;
                let resultado = ''
                if(!contenido.accessModule(jsonObj)){
                  return; 
                }
                for (let row of jsonObj.Envelope.Body.__callResponse.return.item){
                  if(row.key.toString() == "status" && row.value.toString() == "success"){
                    resultado = row.value.toString();
                  }
                  if(resultado == "success" && row.key.toString() == "message"){
                    
                    Swal.fire({
                      title: 'Respuesta por edición!',
                      text: row.value.toString(),
                      icon: 'success',
                      confirmButtonText: 'Cerrar'
                    })
                    contenido.getProduct()
                  }
                }
              }).catch((err)=>{
                  console.log(err)
              }
          );
        }
      }
    },created(){
      this.id = this.$route.params.idProduct
      this.getProduct()
    }
  }
</script>