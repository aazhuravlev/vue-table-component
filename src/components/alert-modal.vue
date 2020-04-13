<template>
    <div class="modal">
        <slot></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/style.scss';

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 50px;
    width: 380px;
    font-size: $alert-modal-font-size;
    text-align: center;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px 0 $shadow-color;
    background-color: $modal-bg-color;
    border-radius: 8px;
}
</style>
