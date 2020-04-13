<template>
    <div class="sorting">
        <b>Sorting by:</b>

        <div class="sorting__buttons-list">
            <button
                class="sorting__button"
                v-for="header in visibleTableHeaders"
                :key="header.field"
                @click="$emit('sortTypeClickHandler', header.field)"
                type="button"
                :class="{
                    'button': header.field === sortType
                }"
            >
                {{ header.name }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'sortType',
        'visibleTableHeaders'
    ]
}
</script>

<style lang="scss">
@import '../style/style.scss';

.sorting {
    display: flex;
    color: $sorting-color;
    align-items: center;

    &__buttons-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-left: 5px;
    }

    &__button {
        padding: 3px 8px;
        cursor: pointer;
        border: none;
    }
}
</style>
