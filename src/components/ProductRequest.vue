<template>
    <div>
        <div class="card">
            <div class="card-header bg-dark text-white">
                {{ $data['title'] }}
            </div>
            <div class="card-body">
                <form v-if="false">
                    <div class="form-row">
                        <div class="form-group col-md-11">
                            <label >Buscar</label>
                            <input type="text" class="form-control" v-model="articulo">
                        </div>
                        <div class="form-group col-md-1">
                            &nbsp;<br>
                            <button type="button" class="btn btn-primary" @click="getListProducts()" style="margin-top: 8px">Buscar</button>
                        </div>
                    </div>
                </form>
                <hr v-if="false">
                <div class="col-lg-4">
                    <div class="card" v-for="(producto, index) in list" :key="index">
                        <div class="card-body text-center">
                            <div class="alert alert-success" role="alert">
                                <h5 class="alert-heading">Nombre: </b>{{ producto.nombre }}</h5>
                            </div>
                            <img :src="producto.url_img" height="200px" class="card-img-top">
                            <div class="alert alert-warning" role="alert">
                                <p><b>Descripcion: </b> {{producto.descripcion}}</p>
                                <hr>
                                <p class="mb-0"><b> Precio: </b>$ {{getFormatMoney(producto.precio) }}</p>
                            </div>
                            <button type="button" class="btn btn-primary" @click="agregarALaCuenta(producto)">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <br>
    </div>
</template>

<script>
    import x2js from 'x2js';
    import Swal from 'sweetalert2';
    import axios from 'axios';
    export default {
        name: 'product-request',
        data() {
            return {
                list: [],
                articulo: "",
                title: "Catalogo de productos",
                responseText:""
            };
        },
        methods: {
            getAddProductsXML: function(product){
                    return '\
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                    <__call>\
                        <method_name>addProduct</method_name>\
                        <arguments>\
                            <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
                            <idProducto xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+product.id+'</idProducto>\
                            <precio xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+product.precio+'</precio>\
                            <iva xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+product.iva+'</iva>\
                        </arguments>\
                    </__call>\
                    </soapenv:Body>\
                </soapenv:Envelope>';
            },
            getListProductsXML: function(filtro){
                    return '\
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                    <__call>\
                        <method_name>getListProduct</method_name>\
                        <arguments>\
                            <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
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
            agregarALaCuenta(item){
                this.sendAddProduct(item)
            },
            sendAddProduct: function (itemSend){
                let X2JS = new x2js()

                let contenido = this

                axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                axios.post('http://localhost/projects/soap_project/Route/Table.php',
                    this.getAddProductsXML(itemSend),{
                        headers:{
                            'Content-Type': 'text/xml',
                            'Accept': 'text/xml',
                        }
                    }).then((res)=>{

                        let jsonObj = X2JS.xml2js(res.data);

                        if(!contenido.accessModule(jsonObj)){
                            return;
                        }

                        let resultado = ''
                        for (let row of jsonObj.Envelope.Body.__callResponse.return.item){
                            if(row.key.toString() == "status" && row.value.toString() == "success"){
                                resultado = row.value.toString();
                            }
                            
                            if(resultado == "success" && row.key.toString() == "message"){
                                Swal.fire({
                                    title: 'Respuesta por solicitud!',
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
                axios.post('http://localhost/projects/soap_project/Route/Table.php',
                    this.getListProductsXML(filtro),{
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
                                rowTable['precio'] = Math.round(100*(1*rowTable['ganancia'] + 1*rowTable['costo']) * (1 + 1*rowTable['iva']/100))/100
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
                            rowTable['precio'] = Math.round(100*(1*rowTable['ganancia'] + 1*rowTable['costo']) * (1 + 1*rowTable['iva']/100))/100
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
