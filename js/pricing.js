(function() {
  let firstLoad = true;
  function fetchPricing(isButtonClick = false) {
    if(isButtonClick) {resetTankAnimation();}

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

    // Hide the pricing table while fetching
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
        const dateText = rows[0][1]; // adjust as needed
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

      for (let i = 0; i < rows.length - 0; i++) {
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

      // Show the pricing table again after data is loaded
      pricingTable.style.visibility = '';
      pricingTable.classList.remove('hidden');

      priceUpdater.classList.remove('hidden');
    }

    const doFetch = () => {
      fetch(sheetUrl)
        .then(response => response.text())
        .then(csv => {
          firstLoad = false;
          // fast finish oil animation
          finishTankAnimation();

          // wait 0.4s to show the text through oil
          setTimeout(() => {
            showPricingTable(csv); // your existing code to reveal table
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

    // Delay fetch only on first load
    if (firstLoad) {
      const delay = 2000 + Math.random() * 1000; // 2–3 seconds
      setTimeout(doFetch, delay);
    } else {
      doFetch();
    }
  }

  document.addEventListener("DOMContentLoaded", fetchPricing);

  // expose to global for button click
  window.fetchPricing = fetchPricing;


  /* UTILS */
  /* ***** */
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

  // Assume SVG is already in DOM
  const oilAnim = document.getElementById("oilWaveRise");

  function finishTankAnimation() {
    if (!oilAnim) return;

    // Stop the animation at the end
    // setCurrentTime works in seconds
    // Since dur="5s", set to 5 to jump to end
    oilAnim.setCurrentTime(5);

    // Freeze the animation
    oilAnim.pauseAnimations(); // freezes all animations in SVG
  }
  function resetTankAnimation() {
    if (!oilAnim) return;

    // Stop the animation at the end
    // setCurrentTime works in seconds
    // Since dur="5s", set to 5 to jump to end
    oilAnim.setCurrentTime(0);
  }
})();
