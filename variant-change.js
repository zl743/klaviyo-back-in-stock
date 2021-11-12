import {customBIS} from 'https://cdn.shopify.com/s/files/1/0580/9379/7582/t/18/assets/product-back-in-stock.js';

new Shopify.OptionSelectors(window.klaviyoBIS.bisConfig.variantSelectId, {
    product: window.klaviyoBIS.productJSON,
    onVariantSelected: selectCallback,
    enableHistoryState: true
});

function selectCallback(variant) {
	customBIS.checkIfBIS(variant);
}