export default {

	install(Vue) {

		Vue.prototype.global = {
			image_url_pfx: 'http://changfei.quxueedu.cn/',
			getImage: function(imageName, scalType, width, height) {
				var url = this.image_url_pfx + imageName;
				if (scalType == null || scalType == "")
					scalType = 1;
				if ((width != null && width != "") || (height != null && height != ""))
					url += "?imageView2/" + scalType;
				if (width != null && width != "")
					url += "/w/" + width;
				if (height != null && height != "")
					url += "/h/" + height;
				return url;
			}
		};

	}

}
