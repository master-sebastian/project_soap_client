<template>
    <div>
        <hr>
        <button v-if="inverso" type="buttom" class="btn btn-primary" @click="cambiar()">{{text}}</button>
        <div class="card" v-if="!inverso">
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
              </div>
              <button type="button" class="btn btn-primary" @click="createdProduct">Guardar</button>
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
      example : "Que mas",
      title: "Creacion de productos",
      inverso: true,
      costo: 0,
      precio:0,
      ganancia:0,
      iva:0,
      descripcion:"",
      nombre:"",
      url_img:""
    }),
    methods: {
      limpiar(){
        this.url_img = ""
      },
      calcularPrecio(){
        this.precio = 1*this.ganancia + this.costo * (1 + this.iva/100)
      },
      cambiar(){
          this.inverso = !this.inverso        
      },
      createProductXML: function(item){
              return '\
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
              <soapenv:Header/>\
              <soapenv:Body>\
              <__call>\
                  <method_name>createProduct</method_name>\
                  <arguments>\
                      <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">15hyhy</authentication>\
                      <costo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:float">'+item.costo+'</costo>\
                      <ganancia xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:float">'+item.ganancia+'</ganancia>\
                      <iva xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:float">'+item.iva+'</iva>\
                      <descripcion xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.descripcion+'</descripcion>\
                      <nombre xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.nombre+'</nombre>\
                      <url_img xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+item.img_url+'</url_img>\
                  </arguments>\
              </__call>\
              </soapenv:Body>\
          </soapenv:Envelope>';
      },
      createdProduct: function (){
        let X2JS = new x2js()
        let contenido = this
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios.post('http://localhost/projects/soap_project/Route/Product.php',
            this.createProductXML(contenido),{
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
                  
                  contenido.costo = 0
                  contenido.precio = 0
                  contenido.ganancia = 0
                  contenido.iva = 0
                  contenido.descripcion = ""
                  contenido.nombre = ""
                  contenido.limpiar()
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
    },created(){
      this.calcularPrecio()
    }
  }
</script>