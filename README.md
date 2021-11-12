# klaviyo-back-in-stock
Reusable Klaviyo Back in Stock Popup for Shopify Themes 
### Features
- HTML / CSS is fully customizable -- no need to add Back in Stock snippet
- Checks if a variant should show Notify Me popup on variant change
- Shows popup on products with a ```notify-me``` product tag specified. (Product tag name can also be changed)
- Shows variant image on popup, can be toggled on / off through theme customizer
- Can show / hide different elements on page when changing to / from out of stock and in stock variants

### Setup
- Add ```product-back-in-stock-modal.liquid``` to sections folder, then render the section outside your theme.liquid body tags 
``` 
    </body>
  
    {%if template == 'product' %}
    {%section 'product-back-in-stock-modal'%}
    {%endif%}
    </html>
```
- Add ```product-back-in-stock.css``` , ``` product-back-in-stock.js``` to assets folder. You can omit ```variant-change.js``` if there is a JS file with a variant change callback function already in your project
- If you are omitting ```variant-change.js```, be sure to import the customBIS object from ```product-back-in-stock.js``` in your code

```
import {customBIS} from 'your-location-here/product-back-in-stock.js';

//example variant change code
new Shopify.OptionSelectors(window.klaviyoBIS.bisConfig.variantSelectId, {
    product: window.klaviyoBIS.productJSON,
    onVariantSelected: selectCallback,
    enableHistoryState: true
});
//example callback code
function selectCallback(variant) {
	customBIS.checkIfBIS(variant);
}
```
- Configure your site-specific variables in ```product-back-in-stock.js```
```
window.klaviyoBIS.bisConfig = {
    key: 'abcdef', //6 character public api key
    variantSelectId: "product-select", //must have attribute of name="id" in select tag. OPTIONAL if variant callback function already exists
    tag: 'notify-me', //tagged with this will show notify me regardless of availability. OPTIONAL
    toggleOnCallback: document.querySelector('.shopify-payment-button') //hide these elements on notify me, show otherwise. OPTIONAL
}
```

### Documentation 
NOTE: All functions are attached to the customBIS object.
##### adjustPopupPosition()
Centers the popup on the middle of the screen
##### checkIfBIS(variant)
Must be passed a variant object. Checks if variant is unavailable OR tagged with the designated notify-me product tag. Then it will update the variant image in the popup (if checked off in Customizer) and toggle elements specified in the bisConfig object, based on whether the current variant should show as Notify Me
##### submitBISForm(key, email, variantId, productId)
Sends form data to Klaviyo. Takes the public API key, email, variantId, and productId as arguments
##### togglePopup(state)
Shows / hides the back in stock modal. ```state``` can be either ```show``` or ```hide```.
