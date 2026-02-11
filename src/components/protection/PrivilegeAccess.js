import { usePrivilegeStore } from "../../config/store/privilegeStore";

export const useResourcePermissions = (resource) => {
  const { permissions } = usePrivilegeStore();
  
  if (!resource || !permissions) {
    return {};
  }
  
  const resourcePermission = permissions.find(p => p.resource === resource);
  
  return resourcePermission?.operations || {};
};

const PrivilegeAccess = ({ 
  resource, 
  action, 
  children, 
  fallback = null,
  requireAll = false 
}) => {
  const { hasPermission } = usePrivilegeStore();

  if (!resource || !action) {
    return fallback;
  }

  let hasAccess = false;

  if (typeof action === 'string') {
    hasAccess = hasPermission(resource, action);
  } 
  else if (Array.isArray(action)) {
    hasAccess = requireAll 
      ? action.every(act => hasPermission(resource, act))
      : action.some(act => hasPermission(resource, act));
  }

  return hasAccess ? children : fallback;
};

export default PrivilegeAccess;