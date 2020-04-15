<template>
    <tr class="table-content__row-head">
        <th class="table-content__header">
            <div class="checkbox">
                <input
                    class="checkbox__input visually-hidden"
                    type="checkbox"
                    id="check-all"
                    :checked="isAllCheckhed"
                    @change="$emit('toggleAllProductsToDelete')"
                />
                <label
                    class="checkbox__label"
                    for="check-all"
                ></label>
            </div>
        </th>
        <th
            v-for="tableHeader in tableHeadersBySort"
            :key="tableHeader.field"
            class="table-content__header"
            :class="{
                'table-content__header--active':
                    tableHeader.field === sortType
            }"
            @click="$emit('toggleReverseSorting', tableHeader.field)"
        >
            {{ tableHeader.name }}
            <svg
                class="table-content__header-icon"
                :class="{
                    'table-content__header-icon--reverse': isSortingReverse
                }"
                v-if="tableHeader.field === sortType"
            >
                <use xlink:href="./src/images/sprites.svg#icon-arrow-long" />
            </svg>
        </th>
        <th class="table-content__header">
        </th>
    </tr>
</template>

<script>
export default {
    props: [
        'isAllCheckhed',
        'tableHeadersBySort',
        'sortType',
        'isSortingReverse'
    ]
}
</script>
