const Notification = ({ message, success }) => {
	if (!message) return null;

	return success ? (
		<div className="notification">{message}</div>
	) : (
		<div className="error">{message}</div>
	);
};

export default Notification