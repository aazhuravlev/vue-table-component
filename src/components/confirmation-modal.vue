<template>
    <div
        class="modal"
        @click.stop
    >
        <span
            class="modal__message"
            v-if="quantity > 1"
        >
            Are you sure you want to <b>delete {{ quantity }} items</b>?
        </span>
        <span
            class="modal__message"
            v-else
        >
            Are you sure you want to <b>delete item</b>?
        </span>
        <div class="modal__button-list">
            <button
                class="modal__button modal__button--close button"
                @click="$emit('closeModal', false)"
            >
                Cancel
            </button>
            <button
                class="modal__button button"
                @click="$emit('deletionConfirmationClickHandler')"
            >
                Confirm
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: [
      'quantity'
    ]
}
</script>

<style lang="scss">
@import '../style/style.scss';

.modal {
    position: absolute;
    top: 34px;
    left: -100%;
    z-index: 1;
    width: 281px;
    min-height: 96px;
    padding: 16px 7px;
    text-align: center;
    box-sizing: border-box;
    box-shadow: 0 2px 8px 0 $shadow-color;
    background-color: $modal-bg-color;
    border-radius: 8px;
    cursor: default;

    &__message {
        display: block;
        margin-bottom: 7px;
    }

    &__button-list {
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        width: 175px;
    }

    &__button {
        width: 80px;
        border-radius: 4px;
    }

    &__button--close {
        background-color: white;
        border: 1px solid $modal-cancel-button-border-color;
        color: $modal-cancel-button-font-color;
    }
}
</style>
