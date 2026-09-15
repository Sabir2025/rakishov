// Public configuration ONLY. Never place service_role keys or passwords here.
const defaults = {
  supabaseUrl: '',
  supabasePublishableKey: '',
  turnstileSiteKey: '',
  whatsapp: '77022950040',
  budgets: ['$500–$1000', '$1000–$3000', '$3000+', 'discuss'],
};

export const config = Object.assign(defaults, typeof window !== "undefined" ? window.SR_CONFIG || {} : {});
