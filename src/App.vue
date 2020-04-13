<template>
    <Spinner v-if="isPageLoading && !isPageLoaded"/>
    <section
        class="page-section"
        v-else-if="isPageLoaded"
    >
        <PageSectionTitle>
            <h1 class="page-section__title">Table UI</h1>
        </PageSectionTitle>

        <div class="page-table">
            <div class="page-table__control">
                <SortingMenu
                    :visibleTableHeaders="visibleTableHeaders"
                    :sortType="sortType"
                    @sortTypeClickHandler="sortTypeClickHandler"
                />

                <div class="page-table__contorl-wrapper">
                    <div class="page-table__contorl-container">
                        <button
                            class="button button--delete"
                            :disabled="getCountProductsToDelete === 0"
                            @click="isConfirmation = true"
                        >
                            Delete
                            <span v-if="getCountProductsToDelete > 0">
                                ({{ getCountProductsToDelete }})
                            </span>
                        </button>

                        <ConfirmationModal
                            v-if="isConfirmation"
                            :quantity="getCountProductsToDelete"
                            @closeModal="closeModal"
                            @deletionConfirmationClickHandler="deletionConfirmationClickHandler"
                        />
                    </div>

                    <Select
                        :itemsPerPage="itemsPerPage"
                        :pageSize="pageSize"
                        :isMultiselect="false"
                        @itemsPerPageClickHandler="itemsPerPageClickHandler"
                    />

                    <Pagination
                        :currentPage="currentPage"
                        :itemsPerPage="itemsPerPage"
                        :chunkedProducts="chunkedProducts"
                        @previousPageClickHandler="previousPageClickHandler"
                        @nextPageClickHandler="nextPageClickHandler"
                    />

                    <Select
                        :tableHeaders="tableHeaders"
                        :isAllColumnVisible="isAllColumnVisible"
                        :visibleTableHeaders="visibleTableHeaders"
                        :isMultiselect="true"
                        @selectAllColumnHandler="selectAllColumnHandler"
                        @changeHeaderVisibility="changeHeaderVisibility"
                    />
                </div>
            </div>

            <TableContent
                :isAllCheckhed="isAllCheckhed"
                :tableHeadersBySort="tableHeadersBySort"
                :sortType="sortType"
                :isSortingReverse="isSortingReverse"
                :tableData="tableData"
                @toggleAllProductsToDelete="toggleAllProductsToDelete"
                @toggleReverseSorting="toggleReverseSorting"
                @markToDelete="markToDelete"
                @deletionConfirmationClickHandler="deletionConfirmationClickHandler"
            />
        </div>

        <Spinner v-if="isDataChanging"/>
        <AlertModal v-else-if="isDataChanged">
            Продукты успешно удалены
        </AlertModal>

        <AlertModal v-else-if="isDataChangeError">
            При удалении продуктов произошла ошибка, попробуйте еще раз
        </AlertModal>
    </section>
    <AlertModal v-else-if="isLoadingError">
        При загрузке страницы произошла ошибка, пожалуйста, перезагрузите страницу
    </AlertModal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import PageSectionTitle from './components/page-section-title';
import SortingMenu from './components/sorting-menu';
import Select from './components/select';
import Pagination from './components/pagination';
import TableContent from './components/table-content';
import ConfirmationModal from './components/confirmation-modal';
import Spinner from './components/spinner';
import AlertModal from './components/alert-modal';

export default {
    name: 'app',
    components: {
        PageSectionTitle,
        SortingMenu,
        Select,
        Pagination,
        TableContent,
        ConfirmationModal,
        Spinner,
        AlertModal
    },
    data () {
        return {
            chunkedProducts: [],
            itemsPerPage: 10,
            currentPage: 0,
            pageSize: [10, 15, 20],
            sortType: 'product',
            tableHeaders: [
              { field: 'product', name: 'Product (100g serving)', visible: true },
              { field: 'calories', name: 'Calories', visible: true },
              { field: 'fat', name: 'Fat (g)', visible: true },
              { field: 'carbs', name: 'Carbs (g)', visible: true },
              { field: 'protein', name: 'Protein (g)', visible: true },
              { field: 'iron', name: 'Iron (%)', visible: true },
            ],
            productsToDeleteOnPage: null,
            isPageLoading: true,
            isPageLoaded: false,
            isAllCheckhed: false,
            isAllColumnVisible: null,
            isSortingReverse: false,
            isConfirmation: false,
            isLoadingError: false,
            isDataChanging: false,
            isDataChanged: false,
            isDataChangeError: false,
            delay: 1500
        }
    },
    created() {
        this.$store.dispatch('loadProducts')
            .then(() => {
                this.isPageLoading = false;
                this.isPageLoaded = true;
            })
            .catch(() => {
                this.isPageLoading = false;
                this.isLoadingError = true;
            });
    },
    computed: {
        ...mapGetters([
            'getSortedChunkedProducts',
            'getCountProductsToDelete'
        ]),
        visibleTableHeaders() {
            const visibleHeaders = this.tableHeaders.filter(header => header.visible);
            this.isAllColumnVisible = visibleHeaders.length === this.tableHeaders.length;
            return visibleHeaders;
        },
        tableHeadersBySort() {
            return [
                ...this.visibleTableHeaders.filter(header => header.field === this.sortType),
                ...this.visibleTableHeaders.filter(header => header.field !== this.sortType)
            ]
        },
        tableData() {
            this.chunkedProducts = this.getSortedChunkedProducts(
                this.itemsPerPage, this.sortType, this.isSortingReverse
            );
            return this.chunkedProducts[this.currentPage];
        },
    },
    methods: {
        ...mapMutations([
            'toggleProductToDelete',
            'toggleProductsListToDelete'
        ]),
        itemsPerPageClickHandler(itemsCount) {
            this.itemsPerPage = itemsCount;
            this.currentPage = 0;

            this.isAllProductsOnPageCheckhed();
        },
        sortTypeClickHandler(sortType) {
            this.sortType = sortType;
        },
        closeModal(prop) {
            this.isConfirmation = prop;
        },
        deletionConfirmationClickHandler(id) {
            this.isConfirmation = false;
            this.isDataChanging = true;

            this.deleteProductHandler('deleteProduct', id);
        },
        deleteProductHandler(actionName, id) {
            this.$store.dispatch(actionName, id)
                .then(() => {
                    this.isDataChanging = false;
                    this.isDataChanged = true;

                    this.isAllProductsOnPageCheckhed();

                    setTimeout(() => {
                        this.isDataChanged = false;
                    }, this.delay);
                })
                .catch(() => {
                    this.isDataChanging = false;
                    this.isDataChangeError = true;

                    this.isAllProductsOnPageCheckhed();

                    setTimeout(() => {
                        this.isDataChangeError = false;
                    }, this.delay);
                })
        },
        nextPageClickHandler() {
            if (this.currentPage < this.chunkedProducts.length - 1) {
                this.currentPage++;

                this.isAllProductsOnPageCheckhed();
            }
        },
        previousPageClickHandler() {
            if (this.currentPage > 0) {
                this.currentPage--;

                this.isAllProductsOnPageCheckhed();
            }
        },
        changeHeaderVisibility(index) {
            const currentHeader = this.tableHeaders[index];
            currentHeader.visible = !currentHeader.visible;
        },
        toggleReverseSorting(header) {
            if (header === this.sortType) {
                this.isSortingReverse = !this.isSortingReverse;

                this.isAllProductsOnPageCheckhed();
            }
        },
        selectAllColumnHandler() {
            this.tableHeaders.forEach(header => header.visible = true);
        },
        toggleAllProductsToDelete() {
            this.isAllProductsOnPageCheckhed();

            if (!this.isAllCheckhed) {
                this.isAllCheckhed = true;

                this.toggleProductsListToDelete({
                    data: this.tableData,
                    prop: true
                });
            } else {
                this.isAllCheckhed = false;

                this.toggleProductsListToDelete({
                    data: this.tableData,
                    prop: false
                });
            }
        },
        markToDelete(id) {
            this.toggleProductToDelete(id);

            this.productsToDeleteOnPage = this.tableData.filter(product => product.isMarkToDelete).length;

            if (!this.isAllCheckhed && (this.productsToDeleteOnPage - 1) === (this.itemsPerPage - 1)) {
                this.isAllCheckhed = true;
            } else {
                this.isAllCheckhed = false;
            }
        },
        isAllProductsOnPageCheckhed() {
            this.isAllCheckhed = this.tableData.filter(product => product.isMarkToDelete).length === this.itemsPerPage;
        }
    }
}
</script>

<style lang="scss">
@import './style/style.scss';

.page-section {
    width: 1140px;
    margin: 0 auto;
    margin-top: 32px;
}

.page-table {
    &__control {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 15px;
    }

    &__contorl-wrapper {
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 550px;
    }

    &__contorl-container {
        position: relative;
    }
}

.button {
    min-height: 32px;
    padding: 3px 8px;
    box-sizing: border-box;
    background-color: $active-sorting-button-color;
    color: $contrast-font-color;
    border: none;
    border-radius: 2px;
    cursor: pointer;

    &:disabled {
        color: $disabled-button-font-color;
        background-color: $disabled-button-bg-color;
        border: 1px solid $disabled-button-border-color;
        opacity: 0.3;
        cursor:default;
    }

    &--delete {
        width: 86px;
    }
}
</style>
