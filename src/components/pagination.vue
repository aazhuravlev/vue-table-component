<template>
    <div class="pagination">
        <button
            class="pagination__button"
            @click="$emit('previousPageClickHandler')"
            :disabled="currentPage === 0"
        >
            <svg class="pagination__button-icon">
                <use xlink:href="./src/images/sprites.svg#icon-arrow" />
            </svg>
        </button>

        <span class="pagination__label">
            <b>{{ itemsOnPageFrom }}-{{ itemsOnPageTo }}</b> of <b>{{ getProductsLength }}</b>
        </span>

        <button
            class="pagination__button"
            @click="$emit('nextPageClickHandler')"
            :disabled="currentPage === chunkedProducts.length - 1"
        >
            <svg class="pagination__button-icon pagination__button-icon--left">
                <use xlink:href="./src/images/sprites.svg#icon-arrow" />
            </svg>
        </button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: [
        'currentPage',
        'itemsPerPage',
        'chunkedProducts'
    ],
    computed: {
      ...mapGetters([
          'getProductsLength'
      ]),
      itemsOnPageFrom() {
          return this.currentPage * this.itemsPerPage + 1;
      },
      itemsOnPageTo() {
          const currentItems = this.currentPage * this.itemsPerPage + this.itemsPerPage;
          if (currentItems > this.getProductsLength) {
              return this.getProductsLength;
          }
          return currentItems;
      }
    }
}
</script>

<style lang="scss">
@import '../style/style.scss';

.pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 177px;
    height: 32px;

    &__button {
        display: flex;
        justify-content: center;
        align-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid $button-border-color;
        border-radius: 2px;
        cursor: pointer;
    }

    &__button:disabled {
        color: $disabled-button-font-color;
        background-color: $disabled-button-bg-color;
        border: 1px solid $disabled-button-border-color;
        opacity: 0.3;
        cursor:default;
    }

    &__button-icon {
        width: 8px;
        height: 8px;
        fill: $arrow-icon-color;

        &--left {
        transform: rotate(180deg);
        }
    }

    &__label {
        padding: 0 5px;
        color: $pagination-label-color;
    }
}
</style>
