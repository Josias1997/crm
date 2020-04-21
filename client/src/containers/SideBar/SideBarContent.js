import React from 'react';
import CustomScrollbars from 'util/CustomScrollbars';
import Navigation from "../../components/Navigation";

const SideBarContent = () => {
  const navigationMenus = [
    {
      name: 'sidebar.main',
      type: 'section',
      children: [
        {
          name: 'Clients',
          icon: 'view-dashboard',
          type: 'item',
          link: '/app/clients'
        }
      ]
    }
  ];

  return (
    <CustomScrollbars className=" scrollbar">
      <Navigation menuItems={navigationMenus}/>
    </CustomScrollbars>
  );
};

export default SideBarContent;
