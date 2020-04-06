<template>
    <div>
        <div class="card">
            <div class="card-header bg-dark text-white">
                Prueba
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label>Operar</label>
                        <input type="text" class="form-control" v-model="a">
                        <input type="text" class="form-control" v-model="b">
                        <input type="text" class="form-control" v-model="operacion">
                    </div>
                    <button type="button" class="btn btn-primary" @click="send()">Agregar</button>
                    <input type="text" class="form-control" v-model="resultado">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import x2js from 'x2js';
    import axios from 'axios';
    export default {
        name: 'login',
        data() {
            return {
                a: 0,
                b: 0,
                operacion:'',
                resultado:""
            };
        },
        methods: {
            getXML: function(a, b, operacion){
                    return '\
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                    <__call>\
                        <method_name>'+operacion+'</method_name>\
                        <arguments>\
                            <authentication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">15hyhy</authentication>\
                            <a xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:int">\
                                '+a+'\
                            </a>\
                            <b xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:int">\
                                '+b+'\
                            </b>\
                        </arguments>\
                    </__call>\
                    </soapenv:Body>\
                </soapenv:Envelope>';
            },
            send: function (){
                let X2JS = new x2js()
                let a = this.a
                let b = this.b
                let operacion = this.operacion
                let contenido = this
                contenido.resultado = ""
                axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                axios.post('http://localhost/projects/soap_project/Route/Test/Test.php',
                    this.getXML(a, b, operacion),{
                        headers:{
                            'Content-Type': 'text/xml',
                            'Accept': 'text/xml',
                        }
                    }).then((res)=>{
                        let jsonObj = X2JS.xml2js(res.data);
                        window.test=jsonObj
                        if(jsonObj.Envelope.Body.__callResponse.return['_xsi:type'] == "xsd:int"){
                            contenido.resultado = parseInt(jsonObj.Envelope.Body.__callResponse.return.__text)
                        }else if(jsonObj.Envelope.Body.__callResponse.return['_xsi:type'] == "xsd:float"){
                            contenido.resultado = parseFloat(jsonObj.Envelope.Body.__callResponse.return.__text)
                        }else{
                            contenido.resultado = ""
                        }
                        
                    }).catch((err)=>{
                        console.log(err)
                    }
                );
            }
            
        },created(){
            this.send()
        }
    };
</script>

<style>

</style>