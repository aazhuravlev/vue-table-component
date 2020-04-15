<template>
    <transition name="fade" mode="out-in">
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

                            <transition name="fade">
                                <ConfirmationModal
                                    v-if="isConfirmation"
                                    :quantity="getCountProductsToDelete"
                                    @closeModal="closeModal"
                                    @deletionConfirmationClickHandler="deletionConfirmationClickHandler"
                                />
                            </transition>
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
                            :sortType="sortType"
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
                    :currentPageData="currentPageData"
                    @toggleAllProductsToDelete="toggleAllProductsToDelete"
                    @toggleReverseSorting="toggleReverseSorting"
                    @markToDelete="markToDelete"
                    @deletionConfirmationClickHandler="deletionConfirmationClickHandler"
                />
            </div>
            <transition name="fade" mode="out-in">
                <Spinner v-if="isDataChanging"/>
                <AlertModal v-else-if="isDataChanged">
                    Продукты успешно удалены
                </AlertModal>

                <AlertModal v-else-if="isDataChangeError">
                    При удалении продуктов произошла ошибка, попробуйте еще раз
                </AlertModal>
            </transition>
        </section>
        <AlertModal v-else-if="isLoadingError">
            При загрузке страницы произошла ошибка, пожалуйста, перезагрузите страницу
        </AlertModal>
    </transition>
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
            itemsPerPage: 10,
            currentPage: 0,
            pageSize: [10, 15, 20],
            sortType: 'product',
            tableHeaders: [
              { field: 'product', name: 'Product (100g serving)', isVisible: true },
              { field: 'calories', name: 'Calories', isVisible: true },
              { field: 'fat', name: 'Fat (g)', isVisible: true },
              { field: 'carbs', name: 'Carbs (g)', isVisible: true },
              { field: 'protein', name: 'Protein (g)', isVisible: true },
              { field: 'iron', name: 'Iron (%)', isVisible: true },
            ],
            isPageLoading: true,
            isPageLoaded: false,
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
        this.$store.dispatch('loadProducts') // делаем запрос через экшн в сторе
            .then(() => {
                // в случае успеха убираем лоадер и отображаем страницу
                this.isPageLoading = false;
                this.isPageLoaded = true;
            })
            .catch(() => {
                // в случае ошибки убираем лоадер и отображаем модальное окно с ошибкой
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
            // метод для получения только видимых заголовков
            return this.tableHeaders.filter(header => header.isVisible);
        },
        isAllColumnVisible() {
            // метод для проверки на видимость всех колонок
            return this.visibleTableHeaders.length === this.tableHeaders.length;
        },
        tableHeadersBySort() {
            // метод для установки первого заголовка в соответствии с выбранной сортировкой
            return [
                ...this.visibleTableHeaders.filter(header => header.field === this.sortType),
                ...this.visibleTableHeaders.filter(header => header.field !== this.sortType)
            ]
        },
        chunkedProducts() {
            // метод для получения отсортированного массива и разбитого на подмассивы в соответствии с количеством элементов на странице
            return this.getSortedChunkedProducts(
                this.itemsPerPage, this.sortType, this.isSortingReverse
            );
        },
        currentPageData() {
            // метод для получения данных для текущей страницы таблицы
            return this.chunkedProducts[this.currentPage];
        },
        productsToDeleteOnPage() {
            // метод для подсчета продуктов для удаления на странице
            return this.currentPageData.filter(product => product.isMarkToDelete).length;
        },
        isAllCheckhed() {
            // метод для актуализации чекбокса отметки всех элементов на странице
            return this.productsToDeleteOnPage === this.itemsPerPage;
        }
    },
    methods: {
        ...mapMutations([
            'toggleProductToDelete',
            'toggleProductsListToDelete'
        ]),
        itemsPerPageClickHandler(itemsCount) {
            // обработчик для выбора количества элементов на странице
            this.itemsPerPage = itemsCount;
            this.currentPage = 0;
        },
        sortTypeClickHandler(sortType) {
            // метод для установки типа сортировки
            this.sortType = sortType;
        },
        closeModal(prop) {
            // метод для закрытия модального окна
            this.isConfirmation = prop;
        },
        deletionConfirmationClickHandler(id) {
            // обработчик клика при подтверждении удаления
            this.isConfirmation = false;
            this.isDataChanging = true;

            this.deleteProductHandler('deleteProduct', id);
        },
        deleteProductHandler(actionName, id) {
            // метод для обработки результата загрузки
            this.$store.dispatch(actionName, id)
                .then(() => {
                    // в случае успеха убираем лоадер и показываем сообщение о успешном изменении
                    this.showModalHandler('isDataChanged')
                })
                .catch(() => {
                    // в случае ошибки убираем лоадер и показываем сообщение об ошибке
                    this.showModalHandler('isDataChangeError')
                })
        },
        showModalHandler(modal) {
            // обработчик для показа модальных окон при загрузке
            this.isDataChanging = false;
            this[modal] = true;

            setTimeout(() => {
                this[modal] = false;
            }, this.delay);
        },
        nextPageClickHandler() {
            // обработчик клика по кнопке переключения на следующую страницу
            if (this.currentPage < this.chunkedProducts.length - 1) {
                this.currentPage++;
            }
        },
        previousPageClickHandler() {
            // обработчик клика по кнопке переключения на предыдущую страницу
            if (this.currentPage > 0) {
                this.currentPage--;
            }
        },
        changeHeaderVisibility(index) {
            // метод для изменения видимости заголовка
            const currentHeader = this.tableHeaders[index];
            currentHeader.isVisible = !currentHeader.isVisible;
        },
        toggleReverseSorting(header) {
            // метод для разворота сортировки
            if (header === this.sortType) {
                this.isSortingReverse = !this.isSortingReverse;
            }
        },
        selectAllColumnHandler() {
            // метод, который работает только для отметки всех заголовков в селекте
            this.tableHeaders.forEach(header => header.isVisible = true);
        },
        toggleAllProductsToDelete() {
            // метод для отметки всех продуктов на странице к удалению
                this.toggleProductsListToDelete({ // устанавливаем элементам со страницы метки для удаления
                    products: this.currentPageData,
                    prop: !this.isAllCheckhed
                });
        },
        markToDelete(id) {
            // метод для отметки только одного продукта к удалению
            this.toggleProductToDelete(id);
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
        transition: 0.3s;
    }
}
</style>
