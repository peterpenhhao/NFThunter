import request from '../utils/adminRequest';

export default {
	getFreeMintList: function () {
		return request({
			url: 'nft-mint/freemint',
			method: 'get',
		})
	},
	getMintList: function () {
		return request({
			url: 'nft-mint/mint',
			method: 'get',
		})
	},
	getAbi: function (contract) {
		return request({
			url: 'https://api.etherscan.io/api?module=contract&action=getabi&apikey=A8797M1NMHKIV3M7ZF5472ZYRHYZRRRI4G&address=' + contract,
			method: 'get',
		})
	},
	getMintMethod: function(parm) {
		return request({
			url: 'nft-mint/mint-method',
			method: 'post',
			data: parm
		})
	},
	getMintList: function(parm) {
		return request({
			url: 'nft-mint/get-mint-list',
			method: 'post',
			data: parm
		})
	},
	getSampleMint: function(parm) {
		return request({
			url: 'nft-mint/get-mint-sample',
			method: 'post',
			data: parm
		})
	},
};
