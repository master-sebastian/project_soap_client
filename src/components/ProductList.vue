<template>
    <div>
        <div class="card">
            <div class="card-header bg-dark text-white">
                {{ $data['title'] }}
            </div>
            <div class="card-body">
                <form>
                    <div class="form-row">
                        <div class="form-group col-md-11">
                            <label >Buscar</label>
                            <input type="text" class="form-control" v-model="articulo">
                        </div>
                        <div class="form-group col-md-1">
                            &nbsp;<br>
                            <button type="buttom" class="btn btn-primary" @click="getListProducts()" style="margin-top: 8px">Buscar</button>                
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <product-create text="Agregar" @click="eventoAlCrear"></product-create>
                        </div>
                    </div>
                </form>
                <hr>
                <div class="table-responsive" style="height: 400px;overflow-y: auto;">
                    <table class="table">
                        <thead>
                            <tr style="display: block;">
                                <th scope="col">Nombre</th>
                                <th scope="col" >Descripción</th>
                                <th scope="col">Imagen</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Fecha y hora</th>
                                <th scope="col">Costo(COP)</th>
                                <th scope="col">Iva (%)</th>
                                <th scope="col">Ganancia (COP)</th>
                                <th scope="col">Precio (COP)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="list.length == 0" class="text-center">
                                <th colspan="8" > {{ responseText }}</th>
                            </tr>
                            <tr v-for="(producto, index) in list" :key="index">
                                <td>{{ producto.nombre }}</td>
                                <td>{{ producto.descripcion }}</td>
                                <td><img :src="producto.url_img" width="100px" /></td>
                                <td v-if="producto.estado == 1">
                                    Activo
                                </td>
                                <td v-if="producto.estado == 2">
                                    Inactivo
                                </td>
                                <td>{{ producto.fecha_y_hora }}</td>
                                <td>{{ getFormatMoney(producto.costo) }}</td>
                                <td>{{ producto.iva }}</td>
                                <td>{{ getFormatMoney(producto.ganancia) }}</td>
                                <td>{{ getFormatMoney(producto.precio) }}</td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <br>
        <br>
    </div>
</template>

<script>
    import x2js from 'x2js';
    import axios from 'axios';
    import ProductCreate from "./ProductCreate.vue";
    export default {
        name: 'product-list',
        components: {
            ProductCreate
        },
        data() {
            return {
                list: [],
                articulo: "",
                title: "Listado de productos",
                responseText:""
            };
        },
        methods: {
            getListProductsXML: function(filtro){
                    return '\
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                    <__call>\
                        <method_name>getListProduct</method_name>\
                        <arguments>\
                            <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">15hyhy</authentication>\
                            <filter xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+filtro+'</filter>\
                        </arguments>\
                    </__call>\
                    </soapenv:Body>\
                </soapenv:Envelope>';
            },
            getFormatDataTime(date){
                 const meses = [
                        "Enero", 
                        "Febrero", 
                        "Marzo", 
                        "Abril", 
                        "Mayo", 
                        "Junio",
                        "Julio", 
                        "Agosto", 
                        "Septiembre", 
                        "Octubre", 
                        "Noviembre", 
                        "Diciembre"
                    ];
                let fecha_y_hora = new Date();
                let mes = meses[fecha_y_hora.getMonth()];
                let dia = String(fecha_y_hora.getDate()).padStart(2, '0');
                let year = fecha_y_hora.getFullYear();
                let horas = String(fecha_y_hora.getHours()).padStart(2,'0');
                let minutos = String(fecha_y_hora.getMinutes()).padStart(2,'0');
                let segundos = String(fecha_y_hora.getSeconds()).padStart(2,'0');
                return dia +"-"+mes+"-"+year +" "+ horas+":"+minutos+":"+segundos;
            },
            getFormatMoney(numeros){
                let partes = numeros.toFixed(2).split(".");
                return partes[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (partes[1] ? "." + partes[1] : "");
            },
            getListProducts: function (){
                let X2JS = new x2js()
                
                let filtro = ""
                if(this.articulo == ""){
                    filtro = "@"
                }else{
                    filtro = this.articulo
                }
                this.responseText = "Cargando...";
                let contenido = this
                this.list = []
                axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                axios.post('http://localhost/projects/soap_project/Route/Product.php',
                    this.getListProductsXML(filtro),{
                        headers:{
                            'Content-Type': 'text/xml',
                            'Accept': 'text/xml',
                        }
                    }).then((res)=>{
                        let jsonObj = X2JS.xml2js(res.data);

                        let dataTable = []

                        if(jsonObj.Envelope.Body.__callResponse.return["_SOAP-ENC:arrayType"] == "xsd:ur-type[0]"){
                            contenido.responseText = "No hay resultados en la busqueda";
                        }else if(Array.isArray(jsonObj.Envelope.Body.__callResponse.return.item)){
                            for (let row of jsonObj.Envelope.Body.__callResponse.return.item){
                                let rowTable = [];
                                for (let colum of row.item){
                                    rowTable[colum.key.toString()] = ""
                                    if(["id", "estado"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = parseInt(colum.value.toString()) 
                                    }else if(["nombre", "descripcion","url_img"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = colum.value.toString(); 
                                    }else if(["costo", "iva", "ganancia"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = parseFloat(colum.value.toString()) 
                                    }else if(["fecha_y_hora"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = contenido.getFormatDataTime(colum.value.date.toString())
                                    }
                                }       
                                rowTable['precio'] = rowTable['ganancia'] + rowTable['costo'] * (1 + rowTable['iva'])
                                dataTable.push(rowTable);
                            }
                        }else{
                            let row = jsonObj.Envelope.Body.__callResponse.return.item
                            let rowTable = [];
                            for (let colum of row.item){
                                rowTable[colum.key.toString()] = ""
                                if(["id", "estado"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = parseInt(colum.value.toString()) 
                                }else if(["nombre", "descripcion","url_img"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = colum.value.toString(); 
                                }else if(["costo", "iva", "ganancia"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = parseFloat(colum.value.toString()) 
                                }else if(["fecha_y_hora"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = contenido.getFormatDataTime(colum.value.date.toString())
                                }
                            }
                            rowTable['precio'] = rowTable['ganancia'] + rowTable['costo'] * (1 + rowTable['iva'])
                            dataTable.push(rowTable);
                        }
                        setTimeout(function(){
                            contenido.list = dataTable
                        },500)
                    }).catch((err)=>{
                        console.log(err)
                    }
                );
            },
            eventoAlCrear(resultado){
                if(resultado == "refresh"){
                    this.getListProducts()
                }
            }
        },created(){
            this.getListProducts()
        }
    }
</script>

<style>
    table td 
    {
        table-layout:fixed;
        width:50px;
        overflow:hidden;
        word-wrap:break-word;
    }
</style>