<template>
    <span
        class="select"
        v-if="!isMultiselect"
        @click="isItemsPerPageList = !isItemsPerPageList"
    >
            {{ itemsPerPage }} Per Page
        <svg class="select__icon">
            <use xlink:href="./src/images/sprites.svg#icon-arrow" />
        </svg>
        <transition name="fade">
            <ul
                class="select__list"
                v-if="isItemsPerPageList"
                @click.stop
            >
                <li
                    class="select__item"
                    v-for="itemsCount in pageSize"
                    :key="itemsCount"
                    @click="itemsPerPageClickHandler(itemsCount)"
                    :class="{
                        'select__item--current': itemsCount === itemsPerPage
                    }"
                >
                    {{ itemsCount }} Per Page
                </li>
            </ul>
        </transition>
    </span>

    <span
        class="multiselect"
        v-else
        @click="isColumnList = !isColumnList"
    >
            {{ visibleTableHeaders.length }} columns selected
        <svg class="multiselect__icon">
            <use xlink:href="./src/images/sprites.svg#icon-arrow" />
        </svg>

        <transition name="fade">
            <ul
                class="multiselect__list"
                v-if="isColumnList"
                @click.stop
            >
                <li class="multiselect__item">
                    <div
                        class="checkbox"
                    >
                        <input
                            class="checkbox__input visually-hidden"
                            ref="checkbox-column"
                            type="checkbox"
                            id="select-all-column"
                            :checked="isAllColumnVisible"
                            :disabled="isAllColumnVisible"
                            @change="$emit('selectAllColumnHandler')"
                        />
                        <label
                            class="checkbox__label"
                            for="select-all-column"
                        >
                            <b>Select All</b>
                        </label>
                    </div>
                </li>
                <li
                    class="multiselect__item"
                    :class="{
                        'multiselect__item--current': tableHeader.field === sortType
                    }"
                    v-for="(tableHeader, index) in tableHeaders"
                    :key="tableHeader.field"
                >
                    <div class="checkbox">
                        <input
                            class="checkbox__input visually-hidden"
                            type="checkbox"
                            :id="tableHeader.field"
                            :checked="tableHeader.isVisible"
                            :disabled="tableHeader.field === sortType"
                            @change="$emit('changeHeaderVisibility', index)"
                        />
                        <label
                            class="checkbox__label"
                            :for="tableHeader.field"
                        >
                            {{ tableHeader.name }}
                        </label>
                    </div>
                </li>
            </ul>
        </transition>
    </span>
</template>

<script>
export default {
    props: [
        'itemsPerPage',
        'pageSize',
        'isMultiselect',
        'tableHeaders',
        'isAllColumnVisible',
        'visibleTableHeaders',
        'sortType'
    ],
    data() {
        return {
            isItemsPerPageList: false,
            isColumnList: false
        }
    },
    methods: {
        itemsPerPageClickHandler(itemsCount) {
            // обработчик для выбора количества элементов на странице
            if (this.itemsPerPage !== itemsCount) {
                // клик срабатывает только если значение отличается от текущего
                this.isItemsPerPageList = false;
                this.$emit('itemsPerPageClickHandler', itemsCount);
            }
        }
    }
}
</script>

<style lang="scss">
@import '../style/style.scss';

.select,
.multiselect {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    min-width: 109px;
    height: 32px;
    padding: 3px 7px;
    border: solid 1px $button-border-color;
    border-radius: 2px;
    box-sizing: border-box;
    cursor: pointer;

    &__icon {
        width: 8px;
        height: 8px;
        margin-left: 5px;
        fill: $arrow-icon-color;
        transform: rotate(270deg);
    }

    &__list {
        position: absolute;
        z-index: 1;
        top: 46px;
        left: 0px;
        width: 100%;
        max-height: 243px;
        margin: 0;
        padding: 5px 0;
        background-color: white;
        list-style: none;
        box-shadow: 0 2px 8px 0 $shadow-color;
        overflow: auto;
        border-radius: 2px;
    }

    &__item {
        display: flex;
        align-items: center;
        padding: 5px 7px;
    }

    &__item--current {
        cursor: default;
    }
}

.multiselect {
    min-width: 158px;

    &__list {
        width: 220px;
        padding: 7px 0;
    }

    &__item {
        padding: 0;
    }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
