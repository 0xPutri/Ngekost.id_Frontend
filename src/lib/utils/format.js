export function formatRupiah(amount) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function getStatusLabel(status) {
  const map = {
    pending_payment: "Menunggu Pembayaran",
    pending_verification: "Menunggu Verifikasi",
    confirmed: "Dikonfirmasi",
    active: "Aktif",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    rejected: "Ditolak",
    available: "Tersedia",
    booked: "Dipesan",
    occupied: "Terisi",
  };
  return map[status] || status;
}

export function getStatusColor(status) {
  const map = {
    pending_payment: "bg-amber-100 text-amber-800",
    pending_verification: "bg-blue-100 text-blue-800",
    confirmed: "bg-teal-100 text-teal-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
    available: "bg-green-100 text-green-800",
    booked: "bg-amber-100 text-amber-800",
    occupied: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `https://api.ngekost.my.id${path}`;
}
