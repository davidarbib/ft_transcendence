<template>
    <div id="canvas">
        <!-- <canvas 
            id = 'canvas'
            ref="game"
            width="640" 
            height="480" 
            style="border: 5px solid black;">
        </canvas> -->
    </div>
</template>

<script setup lang="ts">
function draw () 
{
    var canvas = document.getElementById('canvas');
    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d');

        ctx.fillRect(25, 25, 100, 100);
    }
}

draw()
</script>


<style scoped lang="scss">
</style> 