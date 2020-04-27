<template>
    <div>
        <div class="card">
            <div class="card-header bg-dark text-white">
                <a class="btn btn-danger" href="/#/table" style="margin-top: 8px">Regresar</a>
                {{ $data['title'] }}
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-12">
                        <h2>Total a pagar actual </h2> <h3>$ {{ getFormatMoney(valorAPagar) }} COP</h3>
                        <hr>
                        <button type="button" class="btn btn-info" @click="payInvoice()">Pagar cuenta</button>
                        <hr>
                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Imagen del producto</th>
                                <th scope="col">Nombre producto</th>
                                <th scope="col">$ Precio (COP)</th>
                                <th scope="col">Fecha y hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="( producto , indice) in list1" :key="indice">
                                    <th scope="row">{{indice + 1}}</th>
                                    <td><img :src="producto.url_img" height="200px" class="card-img-top"></td>
                                    <td>{{producto.nombre}}</td>
                                    <td>{{ getFormatMoney(producto.precio) }}</td>
                                    <td>{{producto.fecha_y_hora}}</td>
                                </tr>
                            </tbody>
                        </table>
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
        name: 'product-request-admin',
        data() {
            return {
                list: [], //Lista de productos de la empresa
                list1: [], //Lista de productos solicitados en la mesa que esta autenticada
                articulo: "",
                title: "Cuenta de la mesa",
                responseText:"",
                idMesa:"",
                valorAPagar: 0
            };
        },
        methods: {
            calcularValorAPagar: function(){
                this.valorAPagar = 0
                for (let item = 0; item < this.list1.length; item++){
                    this.valorAPagar += this.list1[item].precio
                }
            },
            getPayInvoiceXML: function(){
                    return '\
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                    <__call>\
                        <method_name>payInvoice</method_name>\
                        <arguments>\
                            <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
                            <total xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+this.valorAPagar+'</total>\
                            <idMesa xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+this.idMesa+'</idMesa>\
                        </arguments>\
                    </__call>\
                    </soapenv:Body>\
                </soapenv:Envelope>';
            },
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
                            <nombre xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+product.nombre+'</nombre>\
                            <url_img xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+product.url_img+'</url_img>\
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
            getListProductCommandXML: function(){
                    return '\
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                    <__call>\
                        <method_name>getListProductsCommandAdmin</method_name>\
                        <arguments>\
                            <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
                            <idMesa xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+this.idMesa+'</idMesa>\
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
                let fecha_y_hora = new Date(date);
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
            getListProductCommand: function (){
                let X2JS = new x2js()

                let contenido = this
                
                this.list1 = []
                
                axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                axios.post('http://localhost/projects/soap_project/Route/Table.php',
                    this.getListProductCommandXML(),{
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
                            contenido.responseText = "No ha solitado ningun producto en la mesa";
                        }else if(Array.isArray(jsonObj.Envelope.Body.__callResponse.return.item)){
                            for (let row of jsonObj.Envelope.Body.__callResponse.return.item){
                                let rowTable = [];
                                for (let colum of row.item){
                                    rowTable[colum.key.toString()] = ""
                                    if(["id"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = parseInt(colum.value.toString())
                                    }else if(["nombre","url_img"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = colum.value.toString();
                                    }else if(["precio"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = parseFloat(colum.value.toString())
                                    }else if(["fecha_y_hora"].includes(colum.key.toString())){
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
                                if(["id"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = parseInt(colum.value.toString())
                                }else if(["nombre","url_img"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = colum.value.toString();
                                }else if(["precio"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = parseFloat(colum.value.toString())
                                }else if(["fecha_y_hora"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = contenido.getFormatDataTime(colum.value.date.toString())
                                }
                            }
                            dataTable.push(rowTable);
                        }
                        window.guti = dataTable
                        setTimeout(function(){
                            contenido.list1 = dataTable
                            contenido.calcularValorAPagar()
                        },500)
                    }).catch((err)=>{
                        console.log(err)
                    }
                );
            },
            payInvoice: function (){
                let X2JS = new x2js()

                let contenido = this

                axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                axios.post('http://localhost/projects/soap_project/Route/Table.php',
                    this.getPayInvoiceXML(),{
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
                            if(row.key.toString() == "status" && (row.value.toString() == "success" || row.value.toString() == "warning")){
                                resultado = row.value.toString();
                            }
                            
                            if(resultado == "success" && row.key.toString() == "message"){
                                contenido.getListProductCommand()
                                contenido.calcularValorAPagar()
                                Swal.fire({
                                    title: 'Respuesta por pago!',
                                    text: row.value.toString(),
                                    icon: 'success',
                                    confirmButtonText: 'Cerrar'
                                })
                            }
                            if(resultado == "warning" && row.key.toString() == "message"){
                                contenido.getListProductCommand()
                                contenido.calcularValorAPagar()
                                Swal.fire({
                                    title: 'Respuesta por pago!',
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
            //this.getListProducts()
            this.idMesa = this.$route.params.idTable
            this.getListProductCommand()
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
