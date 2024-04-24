import React from "react";
import AddNewAdmin from "./AdminUsers";
import GeneralSettings from "./GeneralSettings";
import ChangeMetaData from "./ChangeMeta";
import ChangePassword from "./ChangePasswordTab";
import ChangeLogo from "./ChangeLogo";

export default function Settings() {
  return (
    <div className="space-y-10 bg-gray-50 p-4 sm:p-8">
     <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
          Settings
        </h2>
        </div>
      <AddNewAdmin />
      <GeneralSettings />
      <ChangeMetaData />
      <ChangeLogo />
      <ChangePassword />
    </div>
  );
}
