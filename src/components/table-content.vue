<template>
    <table class="table-content">
        <thead>
            <TableContentHead
                :isAllCheckhed="isAllCheckhed"
                :tableHeadersBySort="tableHeadersBySort"
                :sortType="sortType"
                :isSortingReverse="isSortingReverse"
                @toggleAllProductsToDelete="$emit('toggleAllProductsToDelete')"
                @toggleReverseSorting="toggleReverseSorting"
            />
        </thead>

        <tbody class="table-content__body">
            <TableContentRow
                class="table-content__row"
                v-for="item in currentPageData"
                :key="item.id"
                :item="item"
                :tableHeadersBySort="tableHeadersBySort"
                @markToDelete="$emit('markToDelete', item.id)"
                @click="$emit('markToDelete', item.id)"
                @deletionConfirmationClickHandler="$emit('deletionConfirmationClickHandler', item.id)"
            />
        </tbody>
    </table>
</template>

<script>
import TableContentHead from './table-content-head';
import TableContentRow from './table-content-row';

export default {
    components: {
        TableContentHead,
        TableContentRow
    },
    props: [
        'isAllCheckhed',
        'tableHeadersBySort',
        'sortType',
        'isSortingReverse',
        'currentPageData'
    ],
    methods: {
        toggleReverseSorting(header) {
            // метод для разворота сортировки
            this.$emit('toggleReverseSorting', header);
        }
    }
}
</script>

<style lang="scss">
@import '../style/style.scss';

.table-content {
    width: 100%;
    border-collapse: collapse;

    &__row-head {
        border-bottom: solid 1px $separator-line-color;
    }

    &__header {
        position: relative;
        text-align: left;
        background-color: $table-head-color;
    }

    &__header--active {
        color: $active-column-head-color;
        cursor: pointer;
        transition: 0.3s;
    }

    &__header-icon {
        position: absolute;
        top: 18px;
        width: 8px;
        height: 12px;
        margin-left: 10px;
        transition: 0.3s;
    }

    &__header-icon--reverse {
        transform: rotate(-180deg);
        transition: 0.3s;
    }

    &__row {
        background-color: $odd-table-row-color;
        cursor: pointer;

        &:nth-child(even) {
            background-color: $even-table-row-color;
        }

        &:hover {
            background-color: $table-row-hover-color;
            transition: 0.3s;
        }

        &:hover .table-content__data:nth-child(2) {
            text-shadow: 0.25px 0.1px 0px $base-font-color, -0.25px -0.1px 0px $base-font-color;
            transition: 0.3s;
        }

        &:hover .table-content__row-button {
            display: flex;
        }
    }

    &__row-wrapper {
        position: relative;
        width: 70px;
        height: 20px;
    }

    &__row-button {
        display: none;
        justify-content: space-between;
        width: 100%;
        padding: 5px;
        color: $table-row-button-color;
        border: none;
        background-color: transparent;
        cursor: pointer;
    }

    &__row-button-icon {
        display: block;
        width: 16px;
        height: 16px;
        fill: $table-row-button-color;
    }

    &__header,
    &__data {
        padding: 12px 10px;
        box-sizing: border-box;
    }

    &__header:first-child,
    &__data:first-child {
        width: 80px;
    }

    .checkbox__label {
        justify-content: center;
        padding: 0;
    }

    .checkbox__input + .checkbox__label::before {
        margin-right: 0;
    }

    .checkbox__input:checked + .checkbox__label::after {
        top: 4px;
        left: 25px;
    }
}

.checkbox {
    width: 100%;

    &__label {
      position: relative;
      display: flex;
      align-items: center;
      padding: 7px 17px;
      cursor: pointer;
    }

    &__input + .checkbox__label::before {
        display: inline-block;
        vertical-align: middle;

        width: 14px;
        height: 14px;
        content: "";
        margin-right: 10px;
        border: solid 1px $checkbox-border-color;
        border-radius: 2px;
        box-sizing: border-box;
        cursor: pointer;
    }

    &__input:checked + .checkbox__label::before {
        border: none;
        background-color: $checkbox-bg-color;
    }

    &__input:checked + .checkbox__label::after {
        position: absolute;
        top: 16px;
        left: 20px;
        width: 9px;
        height: 6px;
        content: "";

        background-image: url("../images/checkbox-mark.svg");
        background-repeat: no-repeat;
        background-position: 0 0;
    }

    &__input:disabled + .checkbox__label,
    &__input:disabled + .checkbox__label::before {
        cursor: default;
    }
}
</style>
