function BackToTop(targetUrl = '') {
	// 如果传入了目标 URL，使用传入的 URL
	if (targetUrl) {
		window.location.href = targetUrl;
	} else {
		// 如果没有传入目标 URL，获取当前网页 URL
		let currentUrl = window.location.pathname;

		// 分割当前 URL
		let parts = currentUrl.split('/');

		// 返回到上一个目录（即去掉最后一个路径段）
		if (currentUrl.endsWith('/') && currentUrl.length > 1) {
			parts.pop();
			parts.pop();
		}
		else
		{
			parts.pop();
		}

		let finalURL = parts.join('/') || '/';

		console.log(finalURL);

		// 重新设置 URL，跳转到上一个目录
		window.location.href = finalURL; // 如果为空，则跳转到根目录
	}
}