<template>
    <div class="text-center">
        <div class="card text-left">
            <div class="card-header bg-dark text-white">
                {{ $data['title'] }}  
            </div>
            <div class="card-body">
              <div class="container">      
                <hr>
                <h1>DashBoard</h1>
                <hr>
                <div class="row form-group ">
                  <div class="col-lg-5">
                    <label>Fecha inicial</label>
                    <input type="date" class="form-control" v-model="fecha_ini">
                  </div>
                  <div class="col-lg-5">
                    <label>Fecha final</label>
                    <input type="date" class="form-control" v-model="fecha_fin">
                  </div>
                  <div class="col-lg-2">
                    <label><br></label>
                    <br>
                    <button type="button" @click="getListMoney()" class="btn btn-primary"> Graficar</button> 
                  </div>
                </div>
                <div class="row form-group ">
                  <div class="col-lg-4">
                    <div class="alert alert-success" role="alert">
                    <h4 class="alert-heading">Le damos la bienvenida al bar basico</h4>
                    <p>Este sistemas de información le permitira aportar en sus dia a dia como empresa para la gestion de sus actividades</p>
                    <hr>
                    <p class="mb-0">¡Que tenga un buen dia utilizando esta herramienta!</p>
                    </div>
                    <table class="table table-bordered">
                      <thead class="thead-dark">
                        <tr>
                          <th scope="col">Fecha</th>
                          <th scope="col">Vendido COP</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in list">
                          <td>{{item.x}}</td>
                          <td>$ {{getFormatMoney(item.y)}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="col-lg-8">
                      <div class="container row">
                        <canvas id="myChart" style="width:100%;height:400px"></canvas>
                      </div>
                      <div class="container row">
                        <canvas id="myChart1" style="width:100%;height:400px"></canvas>
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
  import Chart from 'chart.js';
  export default {
    props: {
      text: String,   
    },
    data: () => ({
      title: "Bienvenido usuario",
      list: [],
      fecha_ini: "",
      fecha_fin: ""
    }),
    methods: {
      getListMoneyXML: function(fecha_ini, fecha_fin){
              return '\
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
              <soapenv:Header/>\
              <soapenv:Body>\
              <__call>\
                  <method_name>getListMoneyDate</method_name>\
                  <arguments>\
                      <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
                      <fecha_ini xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+fecha_ini+'</fecha_ini>\
                      <fecha_fin xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+fecha_fin+'</fecha_fin>\
                  </arguments>\
              </__call>\
              </soapenv:Body>\
          </soapenv:Envelope>';
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
      getListMoney: function (){
        let X2JS = new x2js()
        let contenido = this
        this.list = []
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios.post('http://localhost/projects/soap_project/Route/DashBoard.php',
            this.getListMoneyXML(contenido.fecha_ini, contenido.fecha_fin),{
                headers:{
                    'Content-Type': 'text/xml',
                    'Accept': 'text/xml',
                }
            }).then((res)=>{
                let jsonObj = X2JS.xml2js(res.data);
                let dataTable = []
                if(!contenido.accessModule(jsonObj)){
                    return; 
                }
                if(jsonObj.Envelope.Body.__callResponse.return["_SOAP-ENC:arrayType"] == "xsd:ur-type[0]"){
                }else if(Array.isArray(jsonObj.Envelope.Body.__callResponse.return.item)){
                    for (let row of jsonObj.Envelope.Body.__callResponse.return.item){
                        let rowTable = [];
                        for (let colum of row.item){
                            rowTable[colum.key.toString()] = ""
                            if([].includes(colum.key.toString())){
                                rowTable[colum.key.toString()] = parseInt(colum.value.toString()) 
                            }else if(["x"].includes(colum.key.toString())){
                                rowTable[colum.key.toString()] = colum.value.toString(); 
                            }else if(["y"].includes(colum.key.toString())){
                                rowTable[colum.key.toString()] = parseFloat(colum.value.toString()) 
                            }else if([].includes(colum.key.toString())){
                                rowTable[colum.key.toString()] = contenido.getFormatDataTime(colum.value.date.toString())
                            }
                        }       
                        dataTable.push(rowTable);
                    }
                }else{
                    let row = jsonObj.Envelope.Body.__callResponse.return.item
                    let rowTable = [];
                    for (let colum of row.item){
                        rowTable[colum.key.toString()] = ""
                        if(["x"].includes(colum.key.toString())){
                            rowTable[colum.key.toString()] = parseInt(colum.value.toString()) 
                        }else if([].includes(colum.key.toString())){
                            rowTable[colum.key.toString()] = colum.value.toString(); 
                        }else if(["y"].includes(colum.key.toString())){
                            rowTable[colum.key.toString()] = parseFloat(colum.value.toString()) 
                        }else if([].includes(colum.key.toString())){
                            rowTable[colum.key.toString()] = contenido.getFormatDataTime(colum.value.date.toString())
                        }
                    }
                    dataTable.push(rowTable);
                }
                setTimeout(function(){
                    contenido.list = dataTable
                    contenido.paintData()
                    contenido.paintCicle()()
                },500)
            }).catch((err)=>{
                console.log(err)
            }
        );
      },
      paintData(){
          document.getElementById('myChart').innerhtml = ""
          let colores = this
          let ctx = document.getElementById('myChart').getContext('2d');
          let myChart = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: this.list.map(function(item){console.log(item.x);return item.x}),
                  datasets: [{
                      label: 'Ventas dentros del intervalos seleccionado',
                      data: this.list.map(function(item){return item.y}),
                      backgroundColor: this.list.map(function(item){return 'rgba(255, 99, 132, 0)'}),
                      borderColor: this.list.map(function(item){return colores.random_bg_color()}),
                      borderWidth: 1
                  }]
              },
              options: {
              }
          });
      }, random_bg_color() {
        let x = 150+Math.floor(Math.random() * 106);
        let y = 50+Math.floor(Math.random() * 206);
        let z = 150+Math.floor(Math.random() * 106);
        return "rgb(" + x + "," + y + "," + z + ")";
      },
      paintCicle(){
        document.getElementById('myChart1').innerhtml = ""
        let ctx = document.getElementById('myChart1').getContext('2d');
        let colores = this
        let myChart = new Chart(ctx, {
          type: 'pie',
          data: {
              datasets: [{
                data: this.list.map(function(item){return item.y}),
                backgroundColor: this.list.map(function(item){return colores.random_bg_color()}),
                borderColor: this.list.map(function(item){return colores.random_bg_color()}),
              }],
              labels: this.list.map(function(item){console.log(item.x);return item.x}),
          }
        })
      } 
      ,getFormatMoney(numeros){
                let partes = numeros.toFixed(2).split(".");
                return partes[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (partes[1] ? "." + partes[1] : "");
      }    
    },created(){
      
    },
    mounted(){
      let date = new Date()
      this.fecha_ini = date.getFullYear()+"-01-01"
      this.fecha_fin = date.getFullYear()+"-"+(""+(date.getMonth()+ 1)).padStart(2,"0")+"-"+(date.getDate()+"").padStart(2,"0")
      this.getListMoney()
      
    }
  }
</script>