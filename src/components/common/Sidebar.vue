<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">
                  {{ subItem.title }}
                </template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index"
                >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
  mounted() {
    //console.log("加载动态菜单");
    this.items = [
      {
        icon: "el-icon-s-home",
        index: "dashboard",
        title: "首页",
      },
      {
        icon: "el-icon-star-on",
        index: "nft-free-mint",
        title: "NFT MINT",
      },
      //,
      // {
      // 	icon: 'el-icon-warning',
      // 	index: 'nft-mint-warning',
      // 	title: 'NFT MINT 警告'
      // }
      {
        icon: "el-icon-s-flag",
        index: "blue-chip-mint",
        title: "蓝筹MINT动态",
      },
      {
        icon: "el-icon-s-goods",
        index: "user-profit",
        title: "NFT 收益统计",
      },
      {
        icon: "el-icon-s-order",
        index: "user-profit-detail",
        title: "NFT 收益明细",
      },
    ];
    var self = this;
    var strRouter = localStorage.getItem("changfei-admin-router");
    if (strRouter != null && strRouter != "" && strRouter != "undefined") {
      var plusRouter = JSON.parse(strRouter);
      var index = 0;
      plusRouter.forEach(function (fstlvl) {
        var fstlvlMenu = {};
        index++;
        fstlvlMenu.icon = "el-icon-lx-" + fstlvl.icon;
        fstlvlMenu.index = index.toString();
        fstlvlMenu.title = fstlvl.title;
        fstlvlMenu.subs = [];
        fstlvl.children.forEach(function (item) {
          var obj = {
            title: item.title,
            index: item.path,
          };
          fstlvlMenu.subs.push(obj);
        });
        self.items.push(fstlvlMenu);
      });
    }
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
