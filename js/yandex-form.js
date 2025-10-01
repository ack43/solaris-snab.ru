(function() {
  document.querySelector('#ya-form-68c5a3c0068ff00016a6033a').addEventListener('load', function() {
    const iframeDoc = this.contentDocument || this.contentWindow?.document;
    console.log(iframeDoc)
    const field = iframeDoc.querySelector('#answer_short_text_71478');
    if (field) field.value = "123465789124867486468468468484834384"
    const footer = iframeDoc.querySelector('.Footer_iframe');
    if (footer) footer.style.display = 'none';
  });
  document.querySelector('#ya-form-68c5a3c0068ff00016a6033a-mobile').addEventListener('load', function() {
    const iframeDoc = this.contentDocument || this.contentWindow?.document;
    const footer = iframeDoc.querySelector('.Footer_iframe');
    if (footer) footer.style.display = 'none';
  });
})();
