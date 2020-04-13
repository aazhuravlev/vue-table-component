<template>
    <tr @click="$emit('markToDelete')">
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
                    @click.stop="isConfirmation = true"
                >
                    <svg class="table-content__row-button-icon">
                        <use xlink:href="./src/images/sprites.svg#icon-basket" />
                    </svg>
                    delete
                </button>
                <ConfirmationModal
                    v-if="isConfirmation"
                    @closeModal="closeModal"
                    @deletionConfirmationClickHandler="deletionConfirmationClickHandler(item.id)"
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
            // обработчик клика по кнопке отмены
            this.isConfirmation = prop;
        },
        deletionConfirmationClickHandler(id) {
            // обработчик клика при подтверждении удаления
            this.isConfirmation = false;
            this.$emit('deletionConfirmationClickHandler', id);
        }
    }
}
</script>
