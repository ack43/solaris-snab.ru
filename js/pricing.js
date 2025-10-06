(function() {
  let firstLoad = true;
  let pricingFetched = false;
  const oilAnim = document.getElementById("oilWaveRise");

  function fetchPricing(isButtonClick = false) {
    if(isButtonClick) resetTankAnimation();

    const section = document.getElementById("pricing");
    if (!section) return console.error("No pricing section found");

    const sheetUrl = section.getAttribute("data-sheet-url");
    if (!sheetUrl) return console.error("No sheet URL found in #pricing");

    const pricingUpdateBlock = section.querySelector("#pricing-update-ts");
    const priceUpdater = section.querySelector("#priceUpdater");
    const h2 = section.querySelector('h2');
    const pricingTable = section.querySelector("#pricing-table");
    const loaderSVG = section.querySelector(".loader-svg");

    if (loaderSVG) {
      if (h2) h2.classList.add('hidden');
      loaderSVG.classList.remove('hidden');
    }

    if (!pricingTable) return console.error("No pricing table found");
    pricingTable.style.visibility = 'hidden';
    pricingTable.classList.add('hidden');
    if (pricingUpdateBlock) pricingUpdateBlock.classList.add('hidden');
    if (priceUpdater) priceUpdater.classList.add('hidden');

    function showPricingTable(csv) {
      if (loaderSVG) {
        if (h2) h2.classList.remove('hidden');
        loaderSVG.classList.add('hidden');
      }

      pricingTable.classList.remove("loading-error");
      const rows = parseCSV(csv.trim());

      if (pricingUpdateBlock) {
        pricingUpdateBlock.classList.remove('hidden');
        const dateText = rows[0][1]; 
        pricingUpdateBlock.innerHTML = `на ${dateText}`;
      }
      
      const header = rows[1];
      let html = `
        <article class="card pricing-row pricing-header">
          <div class="oil-brand">${header[1]}</div>
          <div class="oil-type">${header[0]}</div>
          <div class="price">
            <div class="price-volume">${header[3]}</div>
            <div class="price-weight">${header[4]}</div>
          </div>
        </article>
        <hr>`;

        rows.slice(2).forEach((rowData) => {
          if (!rowData || rowData.length < 2) return;

          let oilFullName = `${rowData[0]} (${rowData[1]})`;
          let oilPrice = `${rowData[3]} / ${rowData[4]}`;

          // Escape single quotes and backslashes
          const escapeForJs = str => str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
          oilFullName = escapeForJs(oilFullName);
          oilPrice = escapeForJs(oilPrice);

          let logo = rowData[2] || '';
          let logoBlock = `<div class="oil-brand-logo">
            ${logo ? `<img class='company-logo' src="${logo}" alt="${rowData[1]}" title="${rowData[1]}" />` : ''}
          </div>`;
          let companyNameBlock = logo ? '' : `<div class="oil-brand-name">${rowData[1] || ''}</div>`;

          html += `
            <article class="card pricing-row pricing-data">
              <div class="oil-brand">
                ${companyNameBlock}
                ${logoBlock}
              </div>
              <div class="oil-type">${rowData[0] || ''}</div>
              <div class="price">
                <div class="price-volume" title='${header[3]}'>${rowData[3] || ''}</div>
                <div class="price-weight" title='${header[4]}'>${rowData[4] || ''}</div>
              </div>
              <div class="request">
                <button onclick="requestOffer('${oilFullName}', '${oilPrice}', this)">Заказать</button>
              </div>
            </article>`;
        });


      html += `<hr>`;
      pricingTable.innerHTML = html;
      pricingTable.style.visibility = '';
      pricingTable.classList.remove('hidden');
      if (priceUpdater) priceUpdater.classList.remove('hidden');
    }

    const doFetch = () => {
      // Start SVG animation from 0 each fetch
      resetTankAnimation();

      fetch(sheetUrl)
        .then(res => res.text())
        .then(csv => {
          firstLoad = false;

          // visually finish tank quickly
          finishTankAnimation();

          // show table after short delay (0.4s)
          setTimeout(() => showPricingTable(csv), 400);
        })
        .catch(err => {
          pricingTable.classList.add("loading-error");
          pricingTable.textContent = "Не удалось загрузить данные по ценам";
          pricingTable.style.display = '';
          pricingTable.classList.remove('hidden');
          console.error(err);
        });
    };

    if (firstLoad) {
      const delay = 20 + Math.random() * 10;
      // const delay = 2000 + Math.random() * 1000;
      setTimeout(doFetch, delay);
    } else {
      doFetch();
    }
  }

  // IntersectionObserver for scroll-trigger
  const pricingSection = document.getElementById("pricing");
  if (pricingSection) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !pricingFetched) {
          fetchPricing();
          pricingFetched = true;
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(pricingSection);
  }

  window.fetchPricing = fetchPricing;

  // ====== SVG Utils ======
  function finishTankAnimation() {
    if (!oilAnim) return;
    oilAnim.setCurrentTime(5); // jump to full tank
    setTimeout(() => oilAnim.unpauseAnimations(), 500); // resume animation for next fetch
  }

  function resetTankAnimation() {
    if (!oilAnim) return;
    oilAnim.setCurrentTime(0); // reset to empty
    oilAnim.unpauseAnimations();   // allow new animation
  }
  
  // CSV parser
  function parseCSV(text) {
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for (let i=0;i<text.length;i++) {
      const char = text[i], next = text[i+1];
      if (char === '"') {
        if (inQuotes && next === '"') { field += '"'; i++; } 
        else { inQuotes = !inQuotes; }
      } else if (char === ',' && !inQuotes) {
        row.push(field); field = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') i++;
        row.push(field); rows.push(row); row=[]; field='';
      } else { field += char; }
    }
    if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
    return rows;
  }
  ///
  ///
  ///
  ///
  const footerIframe = document.querySelector('[name=ya-form-68d39c0b02848f8d056657e8]');
  footerIframe.onload = () => {
    if (footerIframe.dataset.originalHeight) return;

    const checkInterval = setInterval(() => {
      const currentHeight = footerIframe.style.height;

      if (currentHeight && currentHeight !== '0px') {
        clearInterval(checkInterval);

        const height = parseInt(currentHeight);
        footerIframe.dataset.originalHeight = currentHeight;
        footerIframe.style.height = `${height - 60}px`;

        // console.log('Adjusted iframe height:', footerIframe.style.height);
      }
    }, 100); // checks every 100ms
  };

})();

///
///
///
function requestOffer(name, price, button) {
  const iframe = document.getElementById('ya-form-68c5a3c0068ff00016a6033a');
  const iframeMobile = document.getElementById('ya-form-68c5a3c0068ff00016a6033a-mobile');

  const baseUrl = "https://forms.yandex.ru/cloud/68c5a3c0068ff00016a6033a";
  const params = new URLSearchParams({
    iframe: "1",
    answer_short_text_9008958568882614: name,
    answer_short_text_9008958568902556: price,
  });
  const url = `${baseUrl}?${params.toString()}`;

  window.sendYMGoal('selectOil', {name, price});
  window.sendYMGoal(`selectOil.${}`);

  // Remove old handlers
  iframe.onload = iframeMobile.onload = null;

  // Store original button text
  const originalText = button.innerText;

  // Disable button and start loading animation
  button.disabled = true;

  function startLoadingAnimation(button) {
    const dots = ['\u2022', '\u25AA', '\u25CF']; // small, bigger, biggest
    const steps = [
      [0, 0, 0],
      [1, 0, 0],
      [2, 1, 0],
      [1, 2, 1],
      [0, 1, 2],
      [0, 0, 1],
      [0, 0, 0],
    ];

    let stepIndex = 0;

    return setInterval(() => {
      const current = steps[stepIndex];
      button.innerText = current.map(i => dots[i]).join(' ');
      stepIndex = (stepIndex + 1) % steps.length;
    }, 100); // smaller interval = smoother
  }

  const loadingInterval = startLoadingAnimation(button);


  // On iframe load, scroll and restore button
  const onIframeLoaded = () => {
    clearInterval(loadingInterval);
    button.innerText = originalText;
    button.disabled = false;

    $('html, body').stop().animate({
      scrollTop: $('#contact').offset().top
    }, 500, 'easeInOutExpo');
  };

  iframe.onload = onIframeLoaded;
  iframeMobile.onload = onIframeLoaded;

  // Set src AFTER binding events
  iframe.src = iframeMobile.src = url;
}


