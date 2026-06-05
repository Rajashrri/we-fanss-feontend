import { create } from "zustand";

export const usePrivilegeStore = create((set, get) => ({
  role: null,
  accessibleModules: [],
  permissions: [],

  setPrivileges: (data) => {
    set({
      role: data.role || null,
      accessibleModules: data.accessibleModules || [],
      permissions: data.permissions || [],
    });
  },

  clearPrivileges: () => {
    set({
      role: null,
      accessibleModules: [],
      permissions: [],
    });
  },

  // Check if module is accessible
  hasModuleAccess: (module) => {
    return get().accessibleModules.includes(module);
  },

hasPermission: (resource, operation) => {
  const permission = get().permissions.find(
    (p) =>
      p.resource?.trim().toLowerCase() ===
      resource?.trim().toLowerCase()
  );

  if (!permission) {
    console.log("❌ RESOURCE NOT FOUND:", resource);
    return false;
  }


  return permission.operations?.[operation] === true;
},
}));