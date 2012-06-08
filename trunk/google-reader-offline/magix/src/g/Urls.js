with($ns("g")) {
	g.Urls = {
		"reader_api_user_info": $mappath("https://www.$google/reader/api/0/user-info"),
		"reader_api_token": $mappath("https://www.$google/reader/api/0/token"),
		"reader_api_reading_list": $mappath("https://www.$google/reader/api/0/stream/contents/user/-/state/com.google/reading-list"),
		"reader_api_edit_tag": $mappath("https://www.$google/reader/api/0/edit-tag"),
		"reader_api_mark_all_as_read": $mappath("https://www.$google/reader/api/0/mark-all-as-read"),
		"reader_api_subscription_list": $mappath("https://www.$google/reader/api/0/subscription/list?output=json")
	};
}