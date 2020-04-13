import Vue from 'vue';
import Vuex from 'vuex';
import chunk from 'lodash/chunk';

import { getProducts, deleteProducts } from '../../request.js'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        products: []
    },
    actions: {
        loadProducts({ commit }) {
            // метод для загрузки данных
            return getProducts()
                .then(response => {
                    let products = [];

                    response.forEach(product => {
                        product.isMarkToDelete = false; // добавляем элементам массива новое поле для информации об удалении
                        products.push(product);
                    });
                    commit('setProducts' , products); // устанавливаем значение products в state
                })
        },
        deleteProduct({ commit }, id) {
            // метод для удаления данных
            return deleteProducts()
                .then(() => {
                    if (id) {
                        // если есть id, то удаляем только 1 элемент по id
                        commit('deleteProduct', id)
                    } else {
                        // или удаляем все элементы, которые были отмечены к удалению
                        commit('deleteProducts')
                    }
                });
        }
    },
    mutations: {
        setProducts(state, data) {
            // метод для установки значения в state
            state.products = data;
        },
        toggleProductToDelete(state, id) {
            // метод для переключения значения об удалении у элемента по id
            const index = state.products.findIndex(product => product.id === id);
            const product = state.products[index];

            product.isMarkToDelete = !product.isMarkToDelete;
        },
        toggleProductsListToDelete(state, payload) {
            // метод для переключения значений об удалении у списка элементов
            const { products, prop } = payload;

            products.forEach(product => {
              const index = state.products.findIndex(item => item.id === product.id);
              const currentProduct = state.products[index];

              currentProduct.isMarkToDelete = prop;
            });
        },
        deleteProducts(state) {
            // метод для удаления всех отмеченных продуктов из state
            state.products = state.products.filter(product => !product.isMarkToDelete);
        },
        deleteProduct(state, id) {
            // метод для удаления только 1 продкута из state
            state.products = state.products.filter(product => product.id !== id);
        }
    },
    getters: {
        getProductsLength(state) {
            // метод для получения длинны всего массива
            return state.products.length
        },
        getCountProductsToDelete(state) {
            // меотод для получения длинны массива элементов отмеченных на удаление
            return state.products.filter(product => product.isMarkToDelete).length;
        },
        getSortedChunkedProducts: (state) => (pageSize, sortType, isReverse) => {
            // метод для получения отсортированного массива и разбитого на подмассивы в соответствии с количеством элементов на странице
            const sortedProducts = [...state.products].sort((a, b) => {
                if (a[sortType] > b[sortType]) {
                    return 1;
                }
                if (a[sortType] < b[sortType]) {
                    return -1;
                }
                return 0;
            });

            if (isReverse) {
                // если есть флаг, что обратная сортировка, то возвращаем развернутый массив
                return chunk(sortedProducts.reverse(), pageSize);
            }
            return chunk(sortedProducts, pageSize);
        }
    },
    strict: process.env.NODE_ENV !== 'production'
});
