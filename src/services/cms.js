// ========================================
// CMS SERVICE
// ========================================

// Available CMS platforms
export const CMS_TYPES = {
  DIRECTUS: "directus",
  STRAPI: "strapi",
  PAYLOAD: "payload",
};


// ========================================
// CURRENT CMS
// ========================================

export function getCurrentCMS() {
  return (
    localStorage.getItem("selectedCMS") ||
    CMS_TYPES.DIRECTUS
  );
}


// ========================================
// SET CURRENT CMS
// ========================================

export function setCurrentCMS(cms) {
  if (!Object.values(CMS_TYPES).includes(cms)) {
    throw new Error(`Invalid CMS: ${cms}`);
  }

  localStorage.setItem(
    "selectedCMS",
    cms
  );
}


// ========================================
// CMS NAME
// ========================================

export function getCMSName(cms = getCurrentCMS()) {
  switch (cms) {
    case CMS_TYPES.DIRECTUS:
      return "Directus";

    case CMS_TYPES.STRAPI:
      return "Strapi";

    case CMS_TYPES.PAYLOAD:
      return "Payload";

    default:
      return "Directus";
  }
}