import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 配置项目中没有涉及权限的公共路由
export const constantRoutes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '*',
        redirect: '/404'
    },
    {
        path: '/login',
        component: () => import('../components/page/Login.vue'),
        meta: { title: '登录' },
        hidden: true
    },
    {
        path: '/404',
        component: () => import('../components/page/404.vue'),
        meta: { title: '404' },
        hidden: true
    },
    {
        path: '/',
        component: () => import('../components/common/Home.vue'),
        meta: { title: '母版页', mark: "mother-page" },
        children: [
            {
                path: '/dashboard',
                component: () => import('../components/page/Dashboard.vue'),
                meta: { title: '首页' },
            },
			{
				path: '/nft-free-mint',
				component: () => import('../components/page/NftFreeMint.vue'),
				meta: { title: 'NFT FREE MINT' }
			},
            {
				path: '/user-profit',
				component: () => import('../components/page/UserProfit.vue'),
				meta: { title: 'NFT 收益统计' }
			},
            {
				path: '/user-profit-detail',
				component: () => import('../components/page/UserProfitDetail.vue'),
				meta: { title: 'NFT 收益明细' }
			},
			// {
			// 	path: '/nft-mint-warning',
			// 	component: () => import('../components/page/NftMintWarning.vue'),
			// 	meta: { title: 'NFT MINT 警告' }
			// },
            {
				path: '/blue-chip-mint',
				component: () => import('../components/page/BlueChipMint.vue'),
				meta: { title: '蓝筹MINT动态' }
			},
			// {
			// 	path: '/caseMgr',
			// 	component: () => import('../components/page/CaseMgr.vue'),
			// 	meta: { title: '案例管理' }
			// }
        ]
    },
]

const createRouter = () => new Router({
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    routes: initRouter(constantRoutes)
})
const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}
function initRouter(constantRoutes) {
    return constantRoutes;
}
export default router
