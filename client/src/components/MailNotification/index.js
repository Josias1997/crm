import React, {useState, useEffect, useRef} from 'react';
import NotificationItem from './NotificationItem';
import CustomScrollbars from 'util/CustomScrollbars';
import Typography from '@material-ui/core/Typography';
import axios from './../../util/instanceAxios';

const MailNotification = () => {
	const [notifications, setNotifications] = useState([]);
	const interval = useRef(null);
	useEffect(() => {
		interval.current = setInterval(() => {
			axios.get('/api/notifications/')
			.then(({data}) => {
				setNotifications(JSON.parse(data.notifications))
			}).catch(error => {
				console.log(error);
			})
		}, 1000)
		return () => {
			window.clearInterval(interval.current);
		}
	}, [])
	return (
	    <CustomScrollbars className="messages-list scrollbar" style={{height: 280}}>
	      <ul className="list-unstyled">
	        { notifications.length !== 0 ? notifications.map((notification, index) => <NotificationItem key={index}
	                                                                      notification={notification}/>) : <Typography>Aucune notification</Typography>}
	      </ul>
	    </CustomScrollbars>
  )
};

export default MailNotification;

