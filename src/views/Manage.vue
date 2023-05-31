<template>
    <div style="height: 100%">
        <el-container style="min-height: 100%; ">
            <!--    侧边栏-->
            <el-aside :width="sideWidth+'px'"
                      style="background-color: rgb(238, 241, 246);box-shadow: 2px 0 6px rgb(0 21 41) ">
                <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow" />
            </el-aside>

            <el-container>
                <el-header style="border-bottom: 1px solid #cccccc;">
                    <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse" :user="user"/>
                </el-header>

                <el-main>
<!--                    表示当前页面的子路由会在router-view展示-->
                 <router-view @refreshUser="getUser"/>
                </el-main>

            </el-container>
        </el-container>

    </div>
</template>

<script>
    import Aside from '../components/Aside';
    import Header from '../components/Header';

    export default {
        name: 'Manage',
        data() {
            return {
                collapseBtnClass: 'el-icon-s-fold',
                isCollapse: false,
                sideWidth: 200,
                logoTextShow: true,
                user:{}
            }
        },
        components:{
            Aside,
            Header
        },
        created() {
            //从后台获取最新的数据
            this.getUser()
        },
        methods: {
            collapse() {//点击收缩按钮触发
                this.isCollapse = !this.isCollapse
                if (this.isCollapse) {//收缩
                    this.sideWidth = 64
                    this.collapseBtnClass = 'el-icon-s-unfold'
                    this.logoTextShow = false
                } else {//展开
                    this.sideWidth = 200
                    this.collapseBtnClass = 'el-icon-s-fold'
                    this.logoTextShow = true
                }
            },
            //从后台获取数据
            getUser(){
                //从浏览器的缓存里面拿到username
                let username=localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).username:""
                this.request.get("/user/username/"+username).then(res=>{
                    //重新赋值后台的最新user数据
                    this.user=res.data
                })
            }

        }
    }
</script>

