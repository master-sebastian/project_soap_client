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
                            <button type="button" class="btn btn-primary" @click="getListTables()" style="margin-top: 8px">Buscar</button>                
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <table-create text="Agregar" @click="eventoAlCrear"></table-create>
                        </div>
                    </div>
                </form>
                <hr>
                <div class="table-responsive" style="height: 400px;overflow-y: auto;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="text-center">Nombre</th>
                                <th class="text-center">Clave de acceso</th>
                                <th colspan="3" class="text-center">Acciones</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="list.length == 0" class="text-center">
                                <th colspan="4" > {{ responseText }}</th>
                            </tr>
                            <tr v-for="(table, index) in list" :key="index">
                                <td class="text-center">{{ table.nombre }}</td>
                                <td class="text-center" v-if="table.tokenCheck">{{ table.token }}</td>
                                <td class="text-center" v-if="!table.tokenCheck">{{ table.tokenNoVisible }}</td>
                                <td v-if="!table.tokenCheck">
                                    <button type="button" class="btn btn-warning" @click="cambiarEstado(table)" style="margin-top: 8px"> {{ 'Ver_clave'}}</button>
                                </td>
                                <td v-if="table.tokenCheck">
                                    <button type="button" class="btn btn-warning" @click="cambiarEstado(table)" style="margin-top: 8px">{{'Ocultar_clave'}}</button>
                                </td>
                                <td class="text-center">
                                    <a class="btn btn-success" v-bind:href="'/#/table/edit/'+table.id" style="margin-top: 8px">Editar</a>
                                </td>                                
                                <td class="text-center">
                                    <a class="btn btn-info" v-bind:href="'/#/product-request-admin/'+table.id" style="margin-top: 8px">Pedidos</a>
                                </td>
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
    import TableCreate from "./TableCreate.vue";
    export default {
        name: 'table-list',
        components: {
            TableCreate
        },
        data() {
            return {
                list: [],
                articulo: "",
                title: "Listado de mesas",
                responseText:""
            };
        },
        methods: {
            cambiarEstado: function(table){
                table.tokenCheck = !table.tokenCheck
                let aux = this.list
                this.list = []
                for(let item of aux){
                    this.list.push(item)
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
            getListTablesXML: function(filtro){
                    return '\
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                    <__call>\
                        <method_name>getListTable</method_name>\
                        <arguments>\
                            <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+localStorage.getItem('token-access-user')+'</authentication>\
                            <filter xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">'+filtro+'</filter>\
                        </arguments>\
                    </__call>\
                    </soapenv:Body>\
                </soapenv:Envelope>';
            },
            getListTables: function (){
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
                    this.getListTablesXML(filtro),{
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
                                    if(["id"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = parseInt(colum.value.toString()) 
                                    }else if(["nombre", "token"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()] = colum.value.toString();
                                        if(["token"].includes(colum.key.toString())){
                                            rowTable[colum.key.toString()+"Check"] = false
                                            rowTable[colum.key.toString()+"NoVisible"] = ""
                                            for(let j = 0; j < colum.value.toString().length; j ++){
                                                rowTable[colum.key.toString()+"NoVisible"] += "*" 
                                            }    
                                        }  
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
                                }else if(["nombre", "token"].includes(colum.key.toString())){
                                    rowTable[colum.key.toString()] = colum.value.toString();
                                    if(["token"].includes(colum.key.toString())){
                                        rowTable[colum.key.toString()+"Check"] = false
                                        rowTable[colum.key.toString()+"NoVisible"] = ""
                                        for(let j = 0; j < colum.value.toString().length; j ++){
                                            rowTable[colum.key.toString()+"NoVisible"] += "*" 
                                        }    
                                    } 
                                }
                            }
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
                    this.getListTables()
                }
            }
        },created(){
            this.getListTables()
        }
    }
</script>
