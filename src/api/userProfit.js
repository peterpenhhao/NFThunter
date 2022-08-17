import request from '../utils/adminRequest';

export default {
	searchUserProfit: function(parm) {
		return request({
			url: 'user-profit-api/search-user-profit',
			method: 'post',
			data: parm
		})
	},
	searchUserProfitDetail: function(parm) {
		return request({
			url: 'user-profit-api/search-user-profit-detail',
			method: 'post',
			data: parm
		})
	},
};
