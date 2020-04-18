<template>
    <div class="text-center">
        <div class="card text-left">
            <div class="card-header bg-dark text-white">
                {{ $data['title'] }}  
            </div>
            <div class="card-body">
              <div class="alert alert-success" role="alert">
              <h4 class="alert-heading">Le damos la bienvenida al bar basico</h4>
              <p>Este sistemas de información le permitira aportar en sus dia a dia como empresa para la gestion de sus actividades</p>
              <hr>
              <p class="mb-0">¡Que tenga un buen dia utilizando esta herramienta!</p>
            </div>
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
      title: "Bienvenido usuario",
    }),
    methods: {
    
    },created(){      
    }
  }
</script>