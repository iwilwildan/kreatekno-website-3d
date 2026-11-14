// IDs and order are stable across locales; English labels are draft.
export const INDUSTRI = [
  {
    id: "retail",
    label: {
      id: "Retail & F&B",
      en: "Retail & food service",
    },
    icon: "Storefront",
  },
  {
    id: "klinik",
    label: {
      id: "Klinik",
      en: "Clinics",
    },
    icon: "FirstAid",
  },
  {
    id: "properti",
    label: {
      id: "Properti",
      en: "Property",
    },
    icon: "Buildings",
  },
  {
    id: "logistik",
    label: {
      id: "Logistik",
      en: "Logistics",
    },
    icon: "Truck",
  },
  {
    id: "jasa",
    label: {
      id: "Jasa",
      en: "Services",
    },
    icon: "Handshake",
  },
  {
    id: "perjalanan",
    label: {
      id: "Perjalanan",
      en: "Travel",
    },
    icon: "GlobeSimple",
  },
] as const;
export const TIM = [
  {
    id: "marketing",
    label: {
      id: "Marketing",
      en: "Marketing",
    },
    color: "#DC96C4",
  },
  {
    id: "penjualan",
    label: {
      id: "Penjualan",
      en: "Sales",
    },
    color: "#C894DB",
  },
  {
    id: "cs",
    label: {
      id: "Layanan pelanggan",
      en: "Customer service",
    },
    color: "#AD96DD",
  },
  {
    id: "operasional",
    label: {
      id: "Operasional",
      en: "Operations",
    },
    color: "#87CFD7",
  },
  {
    id: "keuangan",
    label: {
      id: "Keuangan & admin",
      en: "Finance & admin",
    },
    color: "#90CCB7",
  },
  {
    id: "manajemen",
    label: {
      id: "Manajemen",
      en: "Management",
    },
    color: "#94A2D9",
  },
  {
    id: "sdm",
    label: {
      id: "SDM",
      en: "Human resources",
    },
    color: "#DF9DAE",
  },
] as const;
// color: the app's own hue for the shelf-box glyph, dark enough for 3:1 on the white circle (13 Nov v1).
export const APPS = [
  {
    id: "whatsapp",
    label: {
      id: "WhatsApp",
      en: "WhatsApp",
    },
    icon: "WhatsappLogo",
    color: "#128C7E",
  },
  {
    id: "sheets",
    label: {
      id: "Google Sheets",
      en: "Google Sheets",
    },
    icon: "Table",
    color: "#1E8E3E",
  },
  {
    id: "instagram",
    label: {
      id: "Instagram",
      en: "Instagram",
    },
    icon: "InstagramLogo",
    color: "#C2307A",
  },
  {
    id: "gmail",
    label: {
      id: "Gmail",
      en: "Gmail",
    },
    icon: "Envelope",
    color: "#D93025",
  },
  {
    id: "calendar",
    label: {
      id: "Google Calendar",
      en: "Google Calendar",
    },
    icon: "CalendarDots",
    color: "#1A73E8",
  },
  {
    id: "drive",
    label: {
      id: "Google Drive",
      en: "Google Drive",
    },
    icon: "Folder",
    color: "#A86F00",
  },
] as const;
export const STATUS = {
  jalan: { id: "Sudah berjalan", en: "In use" },
  ide: { id: "Siap dibuat", en: "Ready to build" },
} as const;
