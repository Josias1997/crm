import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

const NotificationItem = ({notification}) => {
  const {content, created_at} = notification.fields;
  return (
    <li className="media">
      <div className="user-avatar">
        <Avatar
          alt={"Notification"}
          src={'https://via.placeholder.com/150x150'}
        />
        <span className="badge badge-danger rounded-circle">{5}</span>
      </div>
      <div className="media-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="text-capitalize user-name mb-0"><span className="jr-link">Logs</span></h5>
          <span className="meta-date"><small>{new Date(created_at).toLocaleDateString('fr-FR', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}</small></span>
        </div>
        <p className="sub-heading">{content}</p>
      </div>
    </li>
  );
};

export default NotificationItem;
