<template>
    <div>
        <div class="card">
            <div class="card-header bg-dark text-white">
                {{ $data['title'] }}
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label>Nombre del producto</label>
                        <input type="text" class="form-control" v-model="articulo">
                    </div>
                    <button type="buttom" class="btn btn-primary" @click="agregar()">Agregar</button>
                </form>
                <hr>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre del producto</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(producto, index) in list" :key="index">
                            <td>{{ producto }}</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Calc',
        data() {
            return {
                list: [],
                articulo: "",
                title: "Listado de productos a comprar"
            };
        },
        methods: {
            agregar(){
                this.list.push(this.articulo)
            }
        }
    }
</script>
