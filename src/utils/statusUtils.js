export const determineStatus = (links, isDeal = false) => {
  if (isDeal) return "Deal";
  
  const contactedCount = links.filter(link => link.contacted).length;
  
  if (contactedCount === 0) {
    return "Belum Dihubungi";
  } else if (contactedCount < links.length) {
    return "Sedang Dihubungi";
  } else {
    return "Sudah Dihubungi";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Belum Dihubungi":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    case "Sedang Dihubungi":
      return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
    case "Sudah Dihubungi":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    case "Deal":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    default:
      return "bg-slate-100 text-slate-600";
  }
};
