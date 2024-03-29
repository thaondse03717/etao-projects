define([], function() {
	window.OPEN_POPUP = !0;
	window.TaskStatus = {
		DELETED: "DELETED",
		UNCHECKED: "UNCHECKED",
		CHECKED: "CHECKED",
		DONE: "DONE"
	};
	window.TaskPriority = {
		Normal: "Normal",
		High: "High"
	};
	window.nextPriority = {
		Normal: "High",
		High: "Normal"
	};
	window.TASK_REPEAT = {
		TASK_REPEAT_OFF: "TASK_REPEAT_OFF",
		TASK_REPEAT_DAY: "TASK_REPEAT_DAY",
		TASK_REPEAT_WEEK: "TASK_REPEAT_WEEK",
		TASK_REPEAT_MONTH: "TASK_REPEAT_MONTH"
	};
	window.TASK_PROPERTY_PRIORITY = "Priority";
	window.TASK_PROPERTY_FOLDER = "Folder";
	window.TASK_PROPERTY_TIME = "Reminder";
	window.TASK_PROPERTY_NOTES = "Notes";
	window.TASK_PROPERTY_SHARE = "Share";
	window.TASK_PROPERTY_LIST = [
		[TASK_PROPERTY_PRIORITY, "icon-set-priority"],
		[TASK_PROPERTY_FOLDER, "icon-set-folder"],
		[TASK_PROPERTY_TIME, "icon-set-alert"],
		[TASK_PROPERTY_NOTES, "icon-set-note"]
		];
	window.DEFAULT_CATEGORIES = ["Personal", "Work"];
	window.DEFAULT_CATEGORY = "Personal";
	window.TOUCH_UI = !1;
	window.SERVER_API_URL = "http://sm-prod.any.do";
	window.LOGIN_URL = SERVER_API_URL + "/j_spring_security_check";
	window.FACEBOOK_URL = SERVER_API_URL + "/fb-login";
	window.USER_URL = SERVER_API_URL + "/user";
	window.FORGOT_URL = SERVER_API_URL + "/send-forgot-password-email";
	window.TASKS_URL = SERVER_API_URL + "/me/tasks";
	window.CATEGORIES_URL = SERVER_API_URL + "/me/categories";
	window.FACEBOOK_LOGIN_SUCCESS_URL = "http://www.any.do/facebook_proxy/login_success";
	window.FACEBOOK_APP_ID = "218307504870310";
	window.FACEBOOK_PERMISSIONS = "email,user_birthday,friends_birthday,user_relationships,read_friendlists,publish_stream,publish_actions,user_checkins,user_interests,user_religion_politics,user_events,friends_events,offline_access";
	window.FACEBOOK_OAUTH_URL = "http://www.facebook.com/dialog/oauth?display=popup&scope=" + FACEBOOK_PERMISSIONS + "&client_id=" + FACEBOOK_APP_ID + "&redirect_uri=" + FACEBOOK_LOGIN_SUCCESS_URL;
	window.ANYDO_SERVICES_JSON_URL = "/config/services.json";
	window.AUTOCOMPLETE_BASE_URL = "http://sm-dev.any.do:8081/auto-complete/ac";
	window.JSON_ITEM_FIELD_NAME = "formatted";
	window.PRIORITIES = [TaskPriority.High, TaskPriority.Normal];
	window.DATE_CATEGORY_TODAY = "today";
	window.DATE_CATEGORY_TOMORROW = "tomorrow";
	window.DATE_CATEGORY_THIS_WEEK = "week";
	window.DATE_CATEGORY_LATER = "later";
	window.DATES = [DATE_CATEGORY_TODAY, DATE_CATEGORY_TOMORROW, DATE_CATEGORY_THIS_WEEK, DATE_CATEGORY_LATER];
	window.DATE_MAP = {
		today: "Today",
		tomorrow: "Tomorrow",
		week: "This Week",
		later: "Later"
	};
	window.PRIORITY_MAP = {
		High: "Urgent",
		Normal: "No Rush",
		Low: "Low"
	};
	window.VIEW_BY_CATEGORY = "category";
	window.VIEW_BY_PRIORITY = "priority";
	window.VIEW_BY_DUE_DATE = "due_date";
	window.DEFAULT_VIEW_BY = VIEW_BY_DUE_DATE;
	window.LIST_POSITION_KEY = {};
	window.LIST_POSITION_KEY[VIEW_BY_CATEGORY] = "listPositionByCategory";
	window.LIST_POSITION_KEY[VIEW_BY_DUE_DATE] = "listPositionByDueDate";
	window.LIST_POSITION_KEY[VIEW_BY_PRIORITY] = "listPositionByPriority";
	window.CONFIG_VIEW_BY = "view";
	window.CONFIG_COLLAPSED_CATEGORIES = "collapsed";
	window.CONFIG_CALENDAR_DAY = "calendar_day";
	window.DRAG_PIXELS_THRESHOLD = 3;
	window.DAY_SECONDS = 864E5;
	return window
});