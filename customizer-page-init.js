// Zakeke Customizer Page Initialization (per official Zakeke docs)
// Add this script to your /customizer page in Webflow (Page Settings > Custom Code > Footer Code)

(function () {
  'use strict';

  const ZAKEKE_CONFIG = {
    tenantId: '320250',
    apiKey: '-XEU886tqcMb-hIjG8P0WTsf4WsgaoEMl1fAcVNOumI.',
    apiUrl: 'https://api.zakeke.com'
  };

  const CUSTOMIZER_SCRIPT_SRC = 'https://portal.zakeke.com/scripts/integration/apiV2/customizer.js';
  const CONTAINER_ID = 'zakeke-container';

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productid');
  const variantId = urlParams.get('variantid');
  const quantity = parseInt(urlParams.get('quantity') || '1', 10);
  const productNameParam = urlParams.get('productname');
  const productName = productNameParam ? decodeURIComponent(productNameParam) : 'Custom Product';
  let selectedAttributes = {};
  let productAttributesPayload = null;
  let cachedProductInfo = null;
  const attributesParam = urlParams.get('attributes');
  if (attributesParam) {
    try {
      const parsedAttributes = JSON.parse(decodeURIComponent(attributesParam));
      if (isProductAttributePayload(parsedAttributes)) {
        productAttributesPayload = parsedAttributes;
        selectedAttributes = extractSelectedAttributeLabels(parsedAttributes);
      } else {
        selectedAttributes = parsedAttributes;
        productAttributesPayload = buildProductAttributePayloadFromMap(selectedAttributes);
      }
    } catch (error) {
      console.warn('Zakeke Customizer: Failed to parse attributes param', error);
    }
  }
  const productAttributes = productAttributesPayload || buildProductAttributePayloadFromMap(selectedAttributes);

  console.log('Zakeke Customizer (UI API):', {
    productId,
    variantId,
    quantity,
    productName,
    selectedAttributes,
    productAttributes
  });

  if (!productId) {
    renderMessage('Product ID Required', 'Please provide a product ID in the URL: ?productid=YOUR_PRODUCT_ID');
    return;
  }

  ensureContainer();

  loadScript(CUSTOMIZER_SCRIPT_SRC)
    .then(() => {
      if (typeof ZakekeDesigner === 'undefined') {
        throw new Error('ZakekeDesigner not available after script load');
      }
      initCustomizer();
    })
    .catch((error) => {
      console.error('Zakeke Customizer: Failed to load official script', error);
      renderMessage('Customizer Script Error', 'Unable to load Zakeke customizer resources. Please try again later.');
    });

  function ensureContainer() {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';

    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = CONTAINER_ID;
      document.body.appendChild(container);
    }

    container.style.minHeight = '100vh';
    container.style.width = '100%';
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  function renderMessage(title, message) {
    document.body.innerHTML = `
      <div style="padding:40px;text-align:center;font-family:Arial,sans-serif;">
        <h2>${title}</h2>
        <p>${message}</p>
      </div>
    `;
  }

  async function initCustomizer() {
    console.log('Zakeke Customizer: Initializing via ZakekeDesigner UI API');

    const customizer = new ZakekeDesigner();
    const config = buildConfig(customizer);

    try {
      customizer.createIframe(config, CONTAINER_ID);
      console.log('Zakeke Customizer: Iframe created with official UI API');
    } catch (error) {
      console.error('Zakeke Customizer: createIframe failed', error);
      renderMessage('Customizer Error', 'Unable to initialize the Zakeke customizer. Please verify your configuration.');
    }
  }

  function buildConfig(customizerInstance) {
    return {
      tokenOauth: ZAKEKE_CONFIG.apiKey, // TODO: replace with proper OAuth token from your backend
      productId,
      productName,
      quantity,
      selectedAttributes,
      cartButtonText: 'Add to Cart',
      culture: 'en-US',
      currency: 'USD',
      getProductInfo: fetchProductInfoWithFallback,
      getProductPrice: async () => {
        const info = await fetchProductInfoWithFallback();
        return {
          price: normalizePrice(info?.price),
          currency: normalizeCurrency(info?.currency)
        };
      },
      getProductAttribute: () => productAttributes,
      addToCart: async (zakekeData) => {
        console.log('Zakeke Customizer: addToCart callback received', zakekeData);
        const result = await handleAddToCart(zakekeData);
        if (result?.success) {
          return { success: true, cartUrl: '/cart' };
        }
        throw new Error(result?.error || 'Failed to add to cart');
      },
      editAddToCart: async (zakekeData) => {
        console.log('Zakeke Customizer: editAddToCart callback received', zakekeData);
        if (!zakekeData?.cartItemId) {
          throw new Error('Missing cartItemId for editAddToCart');
        }
        const result = await editAddToCart(zakekeData.cartItemId, zakekeData);
        if (result?.success) {
          return { success: true };
        }
        throw new Error(result?.error || 'Failed to update cart item');
      },
      onBackClicked: () => {
        console.log('Zakeke Customizer: onBackClicked');
        window.history.back();
      }
    };
  }

  async function handleAddToCart(zakekeData) {
    if (typeof addToCart !== 'function') {
      throw new Error('addToCart callback is not available. Ensure zakeke-config.js is loaded.');
    }

    const mappedData = {
      productId: zakekeData?.productId || productId,
      variantId: zakekeData?.variantId || variantId,
      quantity: zakekeData?.quantity || quantity,
      price: zakekeData?.price || 0,
      previewImage: zakekeData?.previewImage || '',
      customizationData: zakekeData?.customizationData || zakekeData,
      customizationId: zakekeData?.customizationId || zakekeData?.zakekeCustomizationId
    };

    return await addToCart(mappedData);
  }

  async function fetchProductInfoWithFallback() {
    if (cachedProductInfo) {
      return cachedProductInfo;
    }

    try {
      cachedProductInfo = await getProductInfo(productId, variantId);
      return cachedProductInfo;
    } catch (error) {
      console.warn('Zakeke Customizer: getProductInfo failed, returning fallback data', error);
      cachedProductInfo = buildFallbackProductInfo();
      return cachedProductInfo;
    }
  }

  function buildFallbackProductInfo() {
    return {
      id: productId,
      name: productName,
      price: 0,
      currency: 'USD',
      image: '',
      variants: []
    };
  }

  function normalizePrice(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function normalizeCurrency(value) {
    return typeof value === 'string' && value.trim() ? value : 'USD';
  }

  function isProductAttributePayload(payload) {
    return Boolean(payload && Array.isArray(payload.attributes) && Array.isArray(payload.variants));
  }

  function extractSelectedAttributeLabels(payload) {
    if (!isProductAttributePayload(payload)) {
      return {};
    }

    const labelMap = {};
    const variantAttributes = Array.isArray(payload.variants?.[0]) ? payload.variants[0] : [];

    variantAttributes.forEach((variantEntry) => {
      if (!variantEntry?.code) {
        return;
      }

      const attributeDefinition = payload.attributes.find((attr) => attr.code === variantEntry.code);
      if (!attributeDefinition) {
        return;
      }

      const selectedCode = variantEntry.value?.code;
      if (!selectedCode) {
        return;
      }

      const valueDefinition = attributeDefinition.values?.find((value) => value.code === selectedCode);
      const labelKey = attributeDefinition.label || attributeDefinition.code;
      const labelValue = valueDefinition?.label || valueDefinition?.code;

      if (labelKey && labelValue) {
        labelMap[labelKey] = labelValue;
      }
    });

    return labelMap;
  }

  function buildProductAttributePayloadFromMap(attrMap) {
    if (!attrMap || typeof attrMap !== 'object') {
      return null;
    }

    const entries = Object.entries(attrMap).filter(([, value]) => Boolean(value));
    if (!entries.length) {
      return null;
    }

    const attributes = entries.map(([label, rawValue], index) => {
      const attrCode = (index + 1).toString();
      const normalizedValue = normalizeAttributeValue(rawValue, index);
      return {
        code: attrCode,
        label,
        values: [normalizedValue]
      };
    });

    const variants = [
      attributes.map((attr) => ({
        code: attr.code,
        value: { code: attr.values[0].code }
      }))
    ];

    return { attributes, variants };
  }

  function normalizeAttributeValue(rawValue, index) {
    if (rawValue && typeof rawValue === 'object') {
      const valueCode = rawValue.code || slugify(rawValue.label || rawValue.value || `value-${index + 1}`);
      const valueLabel = rawValue.label || rawValue.code || rawValue.value || `Value ${index + 1}`;
      return { code: valueCode, label: valueLabel };
    }

    const baseValue = String(rawValue || '').trim();
    const label = baseValue || `Value ${index + 1}`;
    const code = slugify(baseValue) || `val-${index + 1}`;
    return { code, label };
  }

  function slugify(value) {
    if (!value) {
      return '';
    }

    return value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
})();

