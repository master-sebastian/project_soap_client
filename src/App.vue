<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-dark navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Bar basico</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-between" id="navbarText">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home<span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item dropdown ml-auto">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Yo
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <a class="dropdown-item" href="#">Cerrar sesion</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <br>
      <router-view></router-view>
    </div>
  </div>
</template>


<style>
  body {
    background-color: #556;
    background-size: 100px 140px;
    background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
    background-image: -webkit-linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -webkit-linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -webkit-linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -webkit-linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -webkit-linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a), -webkit-linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a);
    background-image: -moz-linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -moz-linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -moz-linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -moz-linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -moz-linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a), -moz-linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a);
    background-image: -ms-linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -ms-linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -ms-linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -ms-linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -ms-linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a), -ms-linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a);
    background-image: -o-linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -o-linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -o-linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -o-linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), -o-linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a), -o-linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a);
    background-image: linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), linear-gradient(45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), linear-gradient(-45deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445), linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a), linear-gradient(30deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a);
  }
 
</style>