/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
function resolve(dir) {
	return path.join(__dirname, dir)
  }
const config = {
	devServer: {
		/* 自动打开浏览器 */
		open: true
	},
	lintOnSave: false,
	chainWebpack: config => {
		config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
		config.module
		  .rule('svg-sprite-loader')
		  .test(/\.svg$/)
		  .include
		  .add(resolve('src/assets/icons')) //处理svg目录（根据你建的文件路径）
		  .end()
		  .use('svg-sprite-loader')
		  .loader('svg-sprite-loader')
		  .options({
			symbolId: 'icon-[name]'
		  })
	  }
}
module.exports = config
