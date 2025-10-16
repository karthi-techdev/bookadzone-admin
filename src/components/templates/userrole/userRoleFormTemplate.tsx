import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Checkbox from "../../atoms/BAZ-Checkbox";
import { useUserRoleStore } from "../../stores/UserRoleStore";
import FormHeader from "../../molecules/FormHeader";

type PermissionType = {
  slug: string;
  menuGroupId: string;
};

type SubmenuType = {
  id: string;
  name: string;
  slug?: string;
  permissions: PermissionType[];
};

type MenuType = {
  name: string;
  submenus: SubmenuType[];
};

type PrivilegeTableType = Record<string, MenuType>;

type RoleFormData = {
  role: string;
  menuPermissions?: Record<
    string,
    {
      permissions: string[];
      all: boolean;
    }
  >;
};

interface IRole {
  _id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  rolePrivileges?: { menuGroupId: string; status: boolean }[];
}

const UserRoleFormTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { privilegeTable, error, fetchPrivilegeTable, fetchRoleById, createRole, updateRole, loading } = useUserRoleStore();


  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const methods = useForm<RoleFormData>({
    defaultValues: {
      role: "",
      menuPermissions: {},
    },
    mode: "onSubmit",
  });

  const { control, setValue, getValues, handleSubmit, reset } = methods;

  useEffect(() => {
    fetchPrivilegeTable().catch(() => {
      toast.error("Failed to fetch privilege table");
    });
  }, [fetchPrivilegeTable]);

useEffect(() => {

  if (!id || !Object.keys(privilegeTable).length) return;
  const loadRole = async () => {
    try {
      const role = await fetchRoleById(id);
      if (!role) {
        toast.error("Role not found");
        navigate("/userrole");
        return;
      }
      const initialPermissions: Record<
        string,
        { permissions: string[]; all: boolean }
      > = {};

      Object.values(privilegeTable).forEach((menu) => {
        menu.submenus.forEach((submenu) => {
          const permissions: string[] = submenu.permissions
            .filter((perm) =>
              role.rolePrivileges?.some(
                (p) => p.menuGroupId === perm.menuGroupId && p.status
              )
            )
            .map((perm) => perm.slug);

          const allChecked =
            permissions.length === submenu.permissions.length &&
            permissions.length > 0;

          initialPermissions[submenu.id] = { permissions, all: allChecked };
        });
      });


      setValue("role", role.name, { shouldDirty: true });
      setValue("menuPermissions", initialPermissions, { shouldDirty: true });
    } catch (error) {
      console.error("Failed to fetch role data:", error);
      toast.error("Failed to fetch role data");
      navigate("/userrole");
    }
  };

  loadRole();
}, [id, privilegeTable, fetchRoleById, setValue, navigate]);




  useEffect(() => {
    if (!id && Object.keys(privilegeTable).length > 0 && !Object.keys(getValues("menuPermissions") ?? {}).length) {
      const initialPermissions: Record<string, { permissions: string[]; all: boolean }> = {};
      Object.values(privilegeTable).forEach((menu) => {
        menu.submenus.forEach((submenu) => {
          initialPermissions[submenu.id] = { permissions: [], all: false };
        });
      });
      setValue("menuPermissions", initialPermissions);
    }
  }, [id, privilegeTable, getValues, setValue]);

  const selectedMenus = useMemo(() => Object.keys(privilegeTable), [privilegeTable]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };


  const submenuPermissionMap = useMemo(() => {
    const permissionMap: Record<string, string[]> = {};
    Object.values(privilegeTable).forEach((menu) => {
      menu.submenus.forEach((submenu) => {
        const slug = submenu.slug || submenu.name.toLowerCase().replace(/\s+/g, "-");
        permissionMap[slug] = submenu.permissions.map((perm) => perm.slug);
      });
    });
    return permissionMap;
  }, [privilegeTable]);

  const allUsedPermissions = useMemo(() => {
    const all = new Set<string>();
    Object.values(submenuPermissionMap).forEach((perms) => perms.forEach((p) => all.add(p)));
    return all;
  }, [submenuPermissionMap]);

  const handlePermissionChange = (submenuId: string, action: string, checked: boolean) => {
    const currentPermissions = getValues(`menuPermissions.${submenuId}.permissions`) || [];
    const updatedPermissions = checked
      ? [...new Set([...currentPermissions, action])]
      : currentPermissions.filter((perm) => perm !== action);
    setValue(`menuPermissions.${submenuId}.permissions`, updatedPermissions);

    const submenu = Object.values(privilegeTable)
      .flatMap((menu) => menu.submenus)
      .find((sub) => sub.id === submenuId);
    const submenuSlug = submenu?.slug || submenu?.name.toLowerCase().replace(/\s+/g, "-") || "";
    const allowedPermissions = submenuPermissionMap[submenuSlug] || [];

    const allChecked =
      allowedPermissions.length > 0 && allowedPermissions.every((perm) => updatedPermissions.includes(perm));
    setValue(`menuPermissions.${submenuId}.all`, allChecked);
  };

  const handleAllPermissionChange = (submenuId: string, checked: boolean) => {
    const submenu = Object.values(privilegeTable)
      .flatMap((menu) => menu.submenus)
      .find((sub) => sub.id === submenuId);
    const submenuSlug = submenu?.slug || submenu?.name.toLowerCase().replace(/\s+/g, "-") || "";
    const allowedPermissions = submenuPermissionMap[submenuSlug] || [];

    setValue(`menuPermissions.${submenuId}.permissions`, checked ? allowedPermissions : []);
    setValue(`menuPermissions.${submenuId}.all`, checked);
  };

  const onSubmit: SubmitHandler<RoleFormData> = async (data, event) => {
    event?.preventDefault?.();
    try {
      if (!data.menuPermissions || Object.keys(data.menuPermissions).length === 0) {
        toast.error("At least one permission must be selected");
        return;
      }

      const rolePrivileges: { menuGroupId: string; status: boolean }[] = [];
      Object.entries(data.menuPermissions).forEach(([submenuId, permData]) => {
        const submenu = Object.values(privilegeTable)
          .flatMap((menu) => menu.submenus)
          .find((sub) => sub.id === submenuId);

        if (submenu && permData.permissions?.length > 0) {
          permData.permissions.forEach((selectedPerm) => {
            const perm = submenu.permissions.find((p) => p.slug === selectedPerm);
            if (perm) {
              rolePrivileges.push({ menuGroupId: perm.menuGroupId, status: true });
            }
          });
        }
      });

      if (rolePrivileges.length === 0) {
        toast.error("At least one valid permission must be selected");
        return;
      }

      const roleData: IRole & { rolePrivileges: { menuGroupId: string; status: boolean }[] } = {
        _id: id || "",
        name: data.role,
        slug: data.role.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        status: "active",
        isDeleted: false,
        rolePrivileges,
      };

      if (id) {
        await updateRole(id, roleData);
        toast.success("Role updated successfully");
        navigate("/userrole");
      } else {
        const createData = { name: data.role, rolePrivileges };
        await createRole(createData);
        toast.success("Role created successfully");
        reset();
        navigate("/userrole");

      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save role");
    }
  };

  return (
    <div className="p-6 bg-[var(--light-dark-color)] min-h-screen">
      {/* Dynamic Breadcrumb Header */}
      <FormHeader
        managementName="User Role"
        addButtonLink="/userrole"
        type={id ? "Edit" : "Add"}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && (
        <div className="text-center py-10 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm">
          <div className="text-[var(--light-grey-color)]">Loading privileges...</div>
        </div>
      )}
      {error && (
        <div className="text-red-400 text-center py-10 bg-[var(--dark-color)] border border-red-400/20 rounded-xl shadow-sm">
          {error}
        </div>
      )}
      {!loading && !error && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-[var(--white-color)] mb-4">Role Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6 col-span-12">
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role name is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <label className="block text-sm font-medium text-[var(--white-color)] mb-2">Role</label>
                      <input
                        type="text"
                        {...field}
                        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                        className={`w-full p-2 bg-[var(--dark-color)] border ${error ? "border-red-400" : "border-[var(--light-blur-grey-color)]"
                          } text-[var(--white-color)] rounded`}
                        placeholder="Enter role name (e.g., Admin)"
                      />
                      {error && <p className="text-red-400 text-sm mt-1">{error.message}</p>}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          {selectedMenus.length > 0 ? (
            <div className="space-y-4">
              {selectedMenus.map((menuId) => {
                const menuData = privilegeTable[menuId];
                if (!menuData) return null;
                const { name, submenus } = menuData;
                const isExpanded = expandedMenus[menuId];
                return (
                  <div
                    key={menuId}
                    className="bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleMenu(menuId)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-[var(--purple-color)]/20 to-[var(--purple-color)]/10 hover:from-[var(--purple-color)]/30 hover:to-[var(--purple-color)]/20 transition-all duration-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`transform transition-transform duration-200 ${isExpanded ? "rotate-90" : "rotate-0"}`}>▶</span>
                        <h3 className="text-lg font-semibold text-[var(--white-color)]">
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </h3>
                      </div>
                      <span className="text-sm text-[var(--light-grey-color)]">
                        {submenus.length} submenu{submenus.length !== 1 ? "s" : ""}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-[var(--light-blur-grey-color)]">
                        <div className="px-6 py-3 bg-[var(--dark-color)] border-b border-[var(--light-blur-grey-color)]">
                          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-[var(--white-color)]">
                            <div className="col-span-4">Menu Name</div>
                            <div className="col-span-2 text-center">All</div>
                            {["add", "edit", "view", "delete"].map(
                              (action) =>
                                allUsedPermissions.has(action) && (
                                  <div key={action} className="col-span-1 text-center">
                                    {action.charAt(0).toUpperCase() + action.slice(1)}
                                  </div>
                                )
                            )}
                          </div>
                        </div>
                        <div className="divide-y divide-[var(--light-blur-grey-color)]">
                          {submenus.map((submenu) => {
                            const submenuId = submenu.id;
                            const submenuSlug = submenu.slug || submenu.name.toLowerCase().replace(/\s+/g, "-");
                            const allowedPermissions = submenuPermissionMap[submenuSlug] || [];
                            const currentPerms = getValues(`menuPermissions.${submenuId}.permissions`) || [];
                            const allChecked = getValues(`menuPermissions.${submenuId}.all`) || false;
                            return (
                              <div
                                key={submenuId}
                                className="px-6 py-4 hover:bg-[var(--purple-color)]/10 rounded-lg transition-colors"
                              >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                  <div className="col-span-4">
                                    <span className="text-sm font-medium text-[var(--white-color)] pl-4">
                                      {submenu.name.charAt(0).toUpperCase() + submenu.name.slice(1)}
                                    </span>
                                  </div>
                                  <div className="col-span-2 flex justify-center">
                                    <Controller
                                      name={`menuPermissions.${submenuId}.all`}
                                      control={control}
                                      defaultValue={false}
                                      render={({ field }) => (
                                        <Checkbox
                                          id={`menuPermissions.${submenuId}.all`}
                                          name={`menuPermissions.${submenuId}.all`}
                                          checked={!!field.value}
                                          onChange={(e) => {
                                            field.onChange(e.target.checked);
                                            handleAllPermissionChange(submenuId, e.target.checked);
                                          }}
                                          disabled={allowedPermissions.length === 0}
                                          className="checkbox-white"
                                        />
                                      )}
                                    />
                                  </div>
                                  {["add", "edit", "view", "delete"].map(
                                    (action) =>
                                      allUsedPermissions.has(action) && (
                                        <div key={action} className="col-span-1 flex justify-center">
                                          {allowedPermissions.includes(action) ? (
                                            <Controller
                                              name={`menuPermissions.${submenuId}.permissions`}
                                              control={control}
                                              defaultValue={[]}
                                              render={({ field }) => (
                                                <Checkbox
                                                  id={`menuPermissions.${submenuId}.${action}`}
                                                  name={`menuPermissions.${submenuId}.${action}`}
                                                  checked={field.value?.includes(action) || false}
                                                  onChange={(e) =>
                                                    handlePermissionChange(submenuId, action, e.target.checked)
                                                  }
                                                  disabled={allChecked}
                                                  className="checkbox-white"
                                                />
                                              )}
                                            />
                                          ) : (
                                            <span className="text-[var(--light-grey-color)] text-sm">-</span>
                                          )}
                                        </div>
                                      )
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm">
              <div className="text-[var(--light-grey-color)]">No permissions available.</div>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--purple-color)] text-[var(--white-color)] rounded hover:bg-[var(--purple-color)]/80 transition-colors"
            >
              {id ? "Update Role" : "Save Role"}
            </button>
            {id && (
              <button
                type="button"
                onClick={() => navigate("/userrole")}
                className="ml-4 px-6 py-2 bg-[var(--light-blur-grey-color)] text-[var(--white-color)] rounded hover:bg-[var(--light-blur-grey-color)]/80 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default UserRoleFormTemplate;