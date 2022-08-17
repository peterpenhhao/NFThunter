import request from '../utils/adminRequest';

export default {
	getBlueChipMintList: function () {
		return request({
			url: 'whale/blue-chip-mint',
			method: 'get',
		})
	},
	getBlueChipMintCount: function(parm) {
		return request({
			url: 'whale/get-blue-chip-mint-count',
			method: 'post',
			data: parm
		})
	},
};
