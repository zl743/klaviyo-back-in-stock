window.klaviyoBIS = {};

/********************************

POPUP VARIABLES

-key: 6 character public API key
-variantSelectId: must have attribute of name="id" in select tag. OPTIONAL if variant callback function already exists
-tag: any product tagged with this will show notify me regardless of availability. OPTIONAL
-toggleOnCallback: hide these elements on notify me, show otherwise. OPTIONAL

********************************/
window.klaviyoBIS.bisConfig = {
    key: 'WXeasw', 
    variantSelectId: "product-select",
    tag: 'notify-me', 
    toggleOnCallback: document.querySelector('.shopify-payment-button') 
}
window.klaviyoBIS.productJSON = JSON.parse(document.getElementById("product-json").innerHTML);  

/******************************/
window.klaviyoBIS.bis = {
    sectionContainer: document.querySelector('#notify-me-container'),
    button: document.querySelector('.product-form .product-form__cart-submit'),
    atc: document.querySelector('.product-form .product-form__cart-submit').innerHTML,
    popupContainer: document.querySelector('#notify-me-popup-container'),
    popupText: document.querySelector('.notify-me-text'),
    popupContainerBtn: document.querySelector('#notify-me-popup-container .btn'),
    popupOverlay: document.querySelector('.notify-me-overlay'),
    popupClose: document.querySelector('.notify-me-close'),
    cta: document.querySelector('[data-notify-me-cta]').getAttribute('data-notify-me-cta'),
    success: document.querySelector('[data-notify-me-text-success]').getAttribute('data-notify-me-text-success'),
    error: document.querySelector('[data-notify-me-text-error]').getAttribute('data-notify-me-text-error')
};

/********************************

POPUP FUNCTIONS

-adjustPopupPosition: centers the popup on screen
-checkIfBIS: should run on variant change. checks if current variant is should show a Notify Me Popup
-submitBISForm: sends email, variant id, and product id to klaviyo
-togglePopup: hides/shows popup

*********************************/
const bis = window.klaviyoBIS.bis;
const bisConfig = window.klaviyoBIS.bisConfig;
const productJSON = window.klaviyoBIS.productJSON;
const customBIS = {
  adjustPopupPosition: () => {
    const offsetTop = bis.popupContainer.offsetHeight / 2;
    const offsetLeft = bis.popupContainer.offsetWidth / 2;
    bis.popupContainer.style.top = 'calc(50vh - ' + offsetTop + 'px)';
    bis.popupContainer.style.left = 'calc(50vw - ' + offsetLeft + 'px)';   
  },
  
  togglePopup: (state) => {
      if(state == 'show'){
        bis.sectionContainer.classList.add('active');
        document.querySelector('body').classList.add('notify-me-noscroll');   
      } else if (state == 'hide'){
        bis.sectionContainer.classList.remove('active');
        document.querySelector('body').classList.remove('notify-me-noscroll');   
      }
  },
    
  checkIfBIS: (variant) => {
    bis.popupContainer.setAttribute('data-variant-id', variant.id);
    bis.popupContainer.setAttribute('data-image', variant.featured_image.src);
    async function updateImg(){
      if(bis.popupContainer.querySelector('.notify-me-image')){
        bis.popupContainer.querySelector('.notify-me-image').setAttribute('src', bis.popupContainer.getAttribute('data-image'));
      }
      return true;
    }
    updateImg().then((success) => {
      if(success){
        setTimeout( () => {
           customBIS.adjustPopupPosition();
        }, 100);
      }
    });
    let isTagged = false;
    if(bisConfig.tag){
      for(let tag in productJSON.tags){
        if(productJSON.tags[tag] == bisConfig.tag){
          isTagged = true;
          break;
        }
      }
    }
    if(isTagged || !variant.available){
      bis.button.classList.add("notify-me-bis");
      bis.button.innerHTML = bis.cta;
      if(bisConfig.toggleOnCallback){
      	bisConfig.toggleOnCallback.style.display = 'none';
      }
    } else{
      bis.button.classList.remove("notify-me-bis");
      bis.button.innerHTML = bis.atc;
      if(bisConfig.toggleOnCallback){
      	bisConfig.toggleOnCallback.style.display = 'initial';
      }
    }
  },
    
  submitBISForm: (key, email, variantId, productId) => {
      fetch("https://a.klaviyo.com/onsite/components/back-in-stock/subscribe", {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          a: key,
          email: email,
          platform: "shopify",
          variant: variantId,
          product: productId,
        }),
        method: "POST",
      })
      .then((response) => {
        if(response.status != 200){
          bis.popupText.innerHTML = bis.error;
          return false;
        }else{
          bis.popupText.innerHTML = bis.success;
          return true;
        }
        
      }).then((success) => {
        if(success){
          setTimeout( () => customBIS.togglePopup('hide'), 2000);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    
  }
}

/********************************

EVENT LISTENERS

*********************************/

/*SHOW POPUP ON BUTTON CLICK*/
  document.addEventListener('click', (e) =>{
    if(e.target.classList.contains('notify-me-bis')){
      e.preventDefault();
      customBIS.togglePopup('show');
    }
  });
  
/*TRIGGER FORM SUBMIT*/
  bis.popupContainerBtn.addEventListener('click', () =>{
    const bisEmail = document.querySelector('#notify-me-popup input[type="email"]').value;
    customBIS.submitBISForm(bisConfig.key, bisEmail, bis.popupContainer.getAttribute('data-variant-id'), bis.popupContainer.getAttribute('data-product-id'));                                   
  });
  
/*CLOSE POPUP*/
  bis.popupClose.addEventListener('click', () => {
  	customBIS.togglePopup('hide');
  });
  bis.popupOverlay.addEventListener('click', () => {
    customBIS.togglePopup('hide');                              
  });

/*RECENTER WHEN RESIZED*/
  window.onresize = customBIS.adjustPopupPosition;

/*********************************/
export {customBIS};