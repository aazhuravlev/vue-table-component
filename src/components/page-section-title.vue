<template>
    <div>
        <slot></slot>
        <hr>
    </div>
</template>

<style lang="scss">
@import '../style/style.scss';

.page-section__title {
    margin: 0;
    margin-bottom: 16px;
    font-size: 32px;
    line-height: 40px;
    font-weight: 600;
}

hr {
    color: $separator-line-color;
    opacity: 0.3;
    margin: 0;
    margin-bottom: 10px;
}
</style>
