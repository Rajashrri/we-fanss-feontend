import React from "react";
import { NavLink } from "react-router-dom";
import SimpleBar from "simplebar-react";
import {
  LayoutDashboard,
  Briefcase,
  Languages,
  HelpCircle,
  Share2,
  Theater,
  Layers,
  LayoutTemplate,
  Star,
  ShieldCheck,
  Users,
} from "lucide-react";
import PrivilegeAccess from "../protection/PrivilegeAccess";
import {
  PRIVILEGE_RESOURCES,
  OPERATIONS,
} from "../../constant/privilegeConstants";
import { useRoleName } from "../../config/store/authStore"; // Import the hook

// SidebarContent Component
const SidebarContent = () => {
  const roleName = useRoleName(); // Get current user's role

  // Common actions to check - if user has ANY of these, show the menu item
  const commonActions = [
    OPERATIONS.VIEW,
    OPERATIONS.ADD,
    OPERATIONS.EDIT,
    OPERATIONS.DELETE,
    OPERATIONS.PUBLISH,
  ];

  console.log(roleName);
  // Check if user is admin or superadmin
  const isAdminOrSuperAdmin =
    roleName?.toLowerCase() === "admin" ||
    roleName?.toLowerCase() === "super admin";

    console.log(isAdminOrSuperAdmin)

  return (
    <div id="sidebar-menu">
      <ul className="metismenu list-unstyled" id="side-menu">
        <li className="menu-title">Menu</li>

        {/* Dashboard - Always visible */}
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Professions */}
       
          <li>
            <NavLink
              to="/dashboard/professional-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Briefcase size={20} />
              <span>Professions</span>
            </NavLink>
          </li>
        

        {/* Languages */}
        <PrivilegeAccess
          resource={PRIVILEGE_RESOURCES.LANGUAGE}
          action={commonActions}
        >
          <li>
            <NavLink
              to="/dashboard/language-master"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Languages size={20} />
              <span>Languages</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        {/* Trivia Types */}
        <PrivilegeAccess
          resource={PRIVILEGE_RESOURCES.TRIVIA_TYPE}
          action={commonActions}
        >
          <li>
            <NavLink
              to="/dashboard/triviaTypes-master"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <HelpCircle size={20} />
              <span>Trivia Types</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        {/* Social Links */}
        <PrivilegeAccess
          resource={PRIVILEGE_RESOURCES.SOCIAL_LINK}
          action={commonActions}
        >
          <li>
            <NavLink
              to="/dashboard/sociallink-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Share2 size={20} />
              <span>Social Links</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        {/* Genres */}
        <PrivilegeAccess
          resource={PRIVILEGE_RESOURCES.GENRE}
          action={commonActions}
        >
          <li>
            <NavLink
              to="/dashboard/genremaster-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Theater size={20} />
              <span>Genres</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        {/* Section Types */}
        <PrivilegeAccess
          resource={PRIVILEGE_RESOURCES.SECTION_TYPE}
          action={commonActions}
        >
          <li>
            <NavLink
              to="/dashboard/sectionmaster-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Layers size={20} />
              <span>Section Types</span>
            </NavLink>
          </li>
        </PrivilegeAccess>

        {/* Templates */}
        <PrivilegeAccess
          resource={PRIVILEGE_RESOURCES.SECTION_TEMPLATE}
          action={commonActions}
        >
          <li>
            <NavLink
              to="/dashboard/sectiontemplate-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <LayoutTemplate size={20} />
              <span>Templates</span>
            </NavLink>
          </li>
        </PrivilegeAccess>
 {isAdminOrSuperAdmin && (
      <li>
            <NavLink
              to="/dashboard/celebrity-list"
              className={({ isActive }) =>
                `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              <Star size={20} />
              <span>Celebrities</span>
            </NavLink>
          </li>
         
        )}

        {/* Roles - Admin & SuperAdmin Only */}
        {isAdminOrSuperAdmin && (
          
            <li>
              <NavLink
                to="/dashboard/role-master"
                className={({ isActive }) =>
                  `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
                }
              >
                <ShieldCheck size={20} />
                <span>Roles</span>
              </NavLink>
            </li>
        
        )}

        {/* Users - Admin & SuperAdmin Only */}
        {isAdminOrSuperAdmin && (
          
            <li>
              <NavLink
                to="/dashboard/employee-list"
                className={({ isActive }) =>
                  `waves-effect d-flex align-items-center gap-2 fs-6 hover:text-white ${isActive ? "text-white" : ""}`
                }
              >
                <Users size={20} />
                <span>Users</span>
              </NavLink>
            </li>
          
        )}
      </ul>
    </div>
  );
};

// Main Sidebar Component
const Sidebar = ({ type }) => {
  return (
    <div className="vertical-menu">
      <div data-simplebar className="h-100 bg-[#252b3b]">
        {type !== "condensed" ? (
          <SimpleBar style={{ maxHeight: "100%" }}>
            <SidebarContent />
          </SimpleBar>
        ) : (
          <SidebarContent />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
