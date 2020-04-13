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
            return getProducts()
                .then(response => {
                    let products = [];
                    response.forEach(product => {
                        product.isMarkToDelete = false;
                        products.push(product);
                    });
                    commit('setProducts' , products);
                })
        },
        deleteProduct({ commit }, id) {
            return deleteProducts()
                .then(() => {
                    if (id) {
                      commit('deleteProduct', id)
                    } else {
                        commit('deleteProducts')
                    }
                });
        }
    },
    mutations: {
        setProducts(state, data) {
            state.products = data;
        },
        toggleProductToDelete(state, id) {
            const index = state.products.findIndex(product => product.id === id);
            const product = state.products[index];

            product.isMarkToDelete = !product.isMarkToDelete;
        },
        toggleProductsListToDelete(state, payload) {
            const { data, prop } = payload;

            data.forEach(product => {
              const index = state.products.findIndex(item => item.id === product.id);
              const currentProduct = state.products[index];

              currentProduct.isMarkToDelete = prop;
            });
        },
        deleteProducts(state) {
          state.products = state.products.filter(product => !product.isMarkToDelete);
        },
        deleteProduct(state, id) {
            state.products = state.products.filter(product => product.id !== id);
        }
    },
    getters: {
        getProductsLength(state) {
            return state.products.length
        },
        getCountProductsToDelete(state) {
            return state.products.filter(product => product.isMarkToDelete).length;
        },
        getSortedChunkedProducts: (state) => (pageSize, sortType, isReverse) => {
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
                return chunk(sortedProducts.reverse(), pageSize);
            }
            return chunk(sortedProducts, pageSize);
        }
    },
    strict: process.env.NODE_ENV !== 'production'
});
