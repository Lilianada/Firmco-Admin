import React from 'react'
import AddNewAdmin from './AdminUsers'
import GeneralSettings from './GeneralSettings'
import ChangeMetaData from './ChangeMeta'
import ChangePassword from './ChangePasswordTab'
import ChangeLogo from './ChangeLogo'

export default function Settings() {
  return (
    <div className="space-y-10 ">
      <AddNewAdmin/>
      <GeneralSettings/>
      <ChangeMetaData/>
      <ChangeLogo/>
      <ChangePassword/>
    </div>
  )
}
