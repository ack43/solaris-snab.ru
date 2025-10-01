(function() {
  let firstLoad = true;
  let pricingFetched = false; // make sure we fetch only once

  function fetchPricing(isButtonClick = false) {
    if(isButtonClick) { resetTankAnimation(); }

    const section = document.getElementById("pricing");
    if (!section) {
      console.error("No pricing section found");
      return;
    }

    const sheetUrl = section.getAttribute("data-sheet-url");
    if (!sheetUrl) {
      console.error("No sheet URL found in #pricing data attribute");
      return;
    }

    const pricingUpdateBlock = section.querySelector("#pricing-update-ts");
    if (pricingUpdateBlock) pricingUpdateBlock.classList.add('hidden');
    const priceUpdater = section.querySelector("#priceUpdater");
    if (priceUpdater) priceUpdater.classList.add('hidden');
    
    const h2 = section.querySelector('h2');
    const pricingTable = section.querySelector("#pricing-table");
    const loaderSVG = section.querySelector(".loader-svg");

    if (loaderSVG) {            
      if (h2) h2.classList.add('hidden');
      loaderSVG.classList.remove('hidden');
    }

    if (!pricingTable) {
      console.error("No pricing table found");
      return;
    }

    pricingTable.style.visibility = 'hidden';
    pricingTable.classList.add('hidden');

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

      let html = `
        <article class="card pricing-row pricing-header">
          <div class="oil-type">Тип топлива</div>
          <div class="oil-brand">Поставщик</div>
          <div class="price-volume">Цена / объем</div>
          <div class="price-weight">Цена / тонна</div>
        </article>
        <hr>`;

      for (let i = 0; i < rows.length; i++) {
        const rowData = rows[i];
        if (!rowData || rowData.length < 2) continue;

        html += `
          <article class="card pricing-row">
            <div class="oil-type">${rowData[0] || ''}</div>
            <div class="oil-brand">${rowData[1] || ''}</div>
            <div class="price-volume">${rowData[2] || ''}</div>
            <div class="price-weight">${rowData[3] || ''}</div>
          </article>
        `;
      }

      html += `<hr>`;
      pricingTable.innerHTML = html;

      pricingTable.style.visibility = '';
      pricingTable.classList.remove('hidden');

      if (priceUpdater) priceUpdater.classList.remove('hidden');
    }

    const doFetch = () => {
      fetch(sheetUrl)
        .then(response => response.text())
        .then(csv => {
          firstLoad = false;
          finishTankAnimation();

          setTimeout(() => {
            showPricingTable(csv);
          }, 400); 
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
      const delay = 2000 + Math.random() * 1000;
      setTimeout(doFetch, delay);
    } else {
      doFetch();
    }
  }

  // IntersectionObserver to trigger fetchPricing when pricing block enters viewport
  const pricingSection = document.getElementById("pricing");
  if (pricingSection) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !pricingFetched) {
          fetchPricing();
          pricingFetched = true;
          obs.unobserve(entry.target); // stop observing after first fetch
        }
      });
    }, { threshold: 0.3 }); // trigger when 30% visible

    observer.observe(pricingSection);
  }

  // expose to global for button click
  window.fetchPricing = fetchPricing;

  /* UTILS */
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(field);
        field = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }
    if (field !== '' || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  const oilAnim = document.getElementById("oilWaveRise");

  function finishTankAnimation() {
    if (!oilAnim) return;
    oilAnim.setCurrentTime(5);
    oilAnim.pauseAnimations();
  }

  function resetTankAnimation() {
    if (!oilAnim) return;
    oilAnim.setCurrentTime(0);
  }
})();
