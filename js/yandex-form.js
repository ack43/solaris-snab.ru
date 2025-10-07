// function formatEventData(data) {
//   if (typeof data === "string") {
//     // Try to parse JSON
//     try {
//       return JSON.parse(data);
//     } catch {
//       return data; // not valid JSON, keep as string
//     }
//   } else if (typeof data === "number" || typeof data === "boolean") {
//     return data; // primitive
//   } else if (data instanceof ArrayBuffer) {
//     return "[ArrayBuffer] length: " + data.byteLength;
//   } else if (data instanceof Blob) {
//     return "[Blob] size: " + data.size;
//   } else if (typeof data === "object" && data !== null) {
//     return data; // already object
//   }
//   return String(data); // fallback
// }

// window.addEventListener("message", (event) => {
//   const formatted = formatEventData(event.data);
//   console.log(`Message from iframe ${event.origin}:`, formatted);
//   if(event.origin == 'https://forms.yandex.ru') {

//     if(formatted.name == 'ya-form-68c5a3c0068ff00016a6033a-mobile'){
//       console.log('mobile-event', formatted);
//     }
//     if(formatted.name == 'ya-form-68c5a3c0068ff00016a6033a'){
//       console.log('desktop-event', formatted);
      
//       console.log(event.source)

//       const selectedOilField = document.querySelector('#answer_short_text_9008958568882614');
//       const selectedOilPriceField = document.querySelector('#answer_short_text_9008958568902556');
//       console.log(selectedOilField);
//       console.log(selectedOilPriceField);

//       if (selectedOilField) {
//         selectedOilField.closest('.Question').style.display = 'none';
//         selectedOilField.type = 'hidden';
//         selectedOilField.value = "selected oil";
//       }
//       if (selectedOilPriceField){
//         selectedOilPriceField.closest('.Question').style.display = 'none';
//         selectedOilPriceField.type = 'hidden';
//         selectedOilPriceField.value = "selected oil price";
//       }
//     }
//   }
// });

// (function() {
//   function safelyGetIframeDocument(iframe) {
//     try {
//       return iframe.contentDocument || iframe.contentWindow?.document;
//     } catch (e) {
//       console.warn('Cannot access iframe document due to cross-origin policy:', e);
//       return document;
//     }
//   }

//   const formDesktop = document.querySelector('#ya-form-68c5a3c0068ff00016a6033a');
//   if (formDesktop) {
//     formDesktop.addEventListener('load', function() {
//       const iframeDoc = safelyGetIframeDocument(this);
//       if (!iframeDoc) return;
      
//       console.log(iframeDoc);
//       const selectedOilField = document.querySelector('#answer_short_text_9008958568882614');
//       const selectedOilPriceField = document.querySelector('#answer_short_text_9008958568902556');
//       console.log(selectedOilField);
//       console.log(selectedOilPriceField);

//       if (selectedOilField) {
//         selectedOilField.closest('.Question').style.display = 'none';
//         selectedOilField.type = 'hidden';
//         selectedOilField.value = "selected oil";
//       }
//       if (selectedOilPriceField){
//         selectedOilPriceField.closest('.Question').style.display = 'none';
//         selectedOilPriceField.type = 'hidden';
//         selectedOilPriceField.value = "selected oil price";
//       }

//       const footer = document.querySelector('footer.Footer.Footer_iframe');
//       if (footer) footer.style.display = 'none';
//     });
//   }

//   const formMobile = document.querySelector('#ya-form-68c5a3c0068ff00016a6033a-mobile');
//   if (formMobile) {
//     formMobile.addEventListener('load', function() {
//       const iframeDoc = safelyGetIframeDocument(this);
//       if (!iframeDoc) return;

//       const footer = iframeDoc.querySelector('.Footer_iframe');
//       if (footer) footer.style.display = 'none';
//     });
//   }
// })();
