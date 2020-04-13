<template>
    <tr>
        <td class="table-content__data">
            <div class="checkbox">
                <input
                    class="checkbox__input visually-hidden"
                    type="checkbox"
                    :id="'check-' + item.id"
                    :checked="item.isMarkToDelete"
                    @change="$emit('markToDelete')"
                />
                <label
                    class="checkbox__label"
                    :for="'check-' + item.id"
                ></label>
            </div>
        </td>

        <td
            class="table-content__data"
            v-for="header in tableHeadersBySort"
            :key="header.field"
        >
            {{ item[header.field] }}
        </td>

        <td class="table-content__data">
            <div class="table-content__row-wrapper">
                <button
                    class="table-content__row-button"
                    @click="isConfirmation = true"
                >
                    <svg class="table-content__row-button-icon">
                        <use xlink:href="./src/images/sprites.svg#icon-basket" />
                    </svg>
                    delete
                </button>
                <ConfirmationModal
                    v-if="isConfirmation"
                    @closeModal="closeModal"
                />
            </div>
        </td>
    </tr>
</template>

<script>
import ConfirmationModal from './confirmation-modal';

export default {
    props: [
        'item',
        'tableHeadersBySort'
    ],
    components: {
        ConfirmationModal
    },
    data() {
        return {
            isConfirmation: false
        }
    },
    methods: {
        closeModal(prop) {
            this.isConfirmation = prop;
        }
    }
}
</script>
