<template>
    <q-layout view="hHh lpR fFf">
      <q-page-container>
          <q-page class="flex flex-center text-center">

            <div class="container" style="width: 100%; height: 100%;">
              <img src="statics/bg7.jpg" width="100%" height="60%" align="right"/>
              <div class="absolute-full text-subtitle2 flex flex-center" style="font-size: 70px;font-weight: 800; margin-left: -800px; margin-top: -160px;">
                JOPSIS
              </div>
              <div class="absolute-full text-subtitle2 flex flex-center" style="font-size: 20px;font-weight: 100; margin-left: -650px; margin-top: -50px;">
                Job Order Processing Scheduling and Inventory System
              </div>

            </div>
          </q-page>
          <router-view/>
      </q-page-container>
    </q-layout>
  </template>

<style>
.bg-primary{
  padding:30px;
  width: 280px;
}
</style>
