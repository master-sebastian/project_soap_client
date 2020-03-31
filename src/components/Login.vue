<template>
    <div>
        Que mas a todos {{ message }}
    </div>
</template>

<script>
    import x2js from 'x2js';

    export default {
        name: 'login',
        data() {
            return {
                message: 'Que mas a todos las personas',
            };
        },created(){
            const xml = '<?xml version="1.0"?>\
                <soap:Envelope\
                xmlns:soap="http://www.w3.org/2003/05/soap-envelope/"\
                soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">\
                <soap:Header>\
                ...\
                </soap:Header>\
                <soap:Body>\
                    1000\
                <soap:Fault>\
                ...\
                </soap:Fault>\
                </soap:Body>\
                </soap:Envelope>'
            console.log(x2js)
            let codi = new x2js();
            let document = codi.xml2js(xml);
            console.log(document.Envelope.Body.toString())
            //console.log(codi)
        }
    };
</script>

<style>

</style>