<template>
    <div>
        <div class="card">
            <div class="card-header bg-dark text-white">
                Que mas a todos {{ message }}
            </div>
            <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
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
                message: 'Que mas a todos las personas',
            };
        },
        methods: {
            getXML: function(a, b){
                    return '\
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                    <__call>\
                        <method_name>suma</method_name>\
                        <arguments>\
                            <a xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:int">\
                                '+a+'\
                            </a>\
                            <b xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:int">\
                                '+b+'\
                            </b>\
                        </arguments>\
                        <authentication>\
                            <token>\
                            </token>\
                        </authentication>\
                    </__call>\
                    </soapenv:Body>\
                </soapenv:Envelope>';
            },
            send: function (){
                let X2JS = new x2js()
                axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                axios.post('http://localhost/projects/soap_project/Route/Test/Test.php',
                    this.getXML(20, 40),{
                        headers:{
                            'Content-Type': 'text/xml',
                            'Accept': 'text/xml',
                        }
                    }).then((res)=>{
                        let jsonObj = X2JS.xml2js(res.data);
                        window.test=jsonObj
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