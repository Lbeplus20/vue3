<template>
    <div>
        <!--流式布局-->
        <!-- :span是每个元素所占此row比例，一行是24
            :gutter是该row内元素之间的间隙，也就是col占6，gutter占6中的20px-->
        <el-row :gutter="10" style="margin-bottom: 20px">
            <el-col :span="6">
                <el-card style="color:#409EFF;">
                    <div ><i class="el-icon-user-solid" />用户总数</div>
                    <div style="padding: 10px 0;text-align: center;font-weight: bold">
                        <el-tag type="primary" style="font-size: 20px">100</el-tag>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6" >
                <el-card style="color:#F56C6C;">
                    <div ><i class="el-icon-money" />销售总量</div>
                    <div style="padding: 10px 0;text-align: center;font-weight: bold">100000￥</div>

                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card  style="color:#E6A23C;">
                <div ><i class="el-icon-bank-card" />收益额</div>
                <div style="padding: 10px 0;text-align: center;font-weight: bold">300000￥</div>

            </el-card> </el-col>
            <el-col :span="6" >
                <el-card style="color:#909399;">
                <div ><i class="el-icon-s-shop" />门店总数</div>
                <div style="padding: 10px 0;text-align: center;font-weight: bold">100</div>
            </el-card> </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <div id="main" style="width: 500px;height: 400px"></div>
            </el-col>

            <el-col :span="12">
                <div id="pie" style="width: 500px;height: 400px"></div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import * as echarts from 'echarts';


    export default {
        name: "Home",
        data(){
            return{
            }
        },
        mounted() { //页面元素渲染之后在触发
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);

            var option;
            option = {
                title: {
                    text: '各个季度会员数量统计',
                    subtext: '趋势图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                //显示具体的名字
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                xAxis: {
                    /*横轴*/
                    type: 'category',
                    data: ["第一季度","第二季度","第三季度","第四季度"]
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    //纵轴
                    {
                        name:'ly',
                        data: [],
                        type: 'line'
                    },
                    {
                        name:'lb',
                        data: [],
                        type: 'bar'
                    }
                ]
            };
            this.request.get("/echarts/members").then(res=>{
                //填空
                // option.xAxis.data=res.data.x
                option.series[0].data=res.data
                option.series[1].data=res.data
                //在数据准备完毕之后在set
                myChart.setOption(option);
            })


            //饼图
           var pieOption = {
                title: {
                    text: '各个季度会员数量统计',
                    subtext: '比例图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '50%',
                        //比例
                        label:{
                            normal:{
                                show:true,
                                position:'inner',//标签的位置,
                                textStyle:{
                                    fontWeight:300,
                                    fontSize:14,
                                    color:'#fff'
                                },
                                formatter:'{c}/{d}%'
                            }
                        },
                        data: [],//填空
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            var pieDom = document.getElementById('pie');
            var pieChart = echarts.init(pieDom);

            this.request.get("/echarts/members").then(res=> {
                pieOption.series[0].data = [
                    {name: '第一季度', value: res.data[0]},
                    {name: '第二季度', value: res.data[1]},
                    {name: '第三季度', value: res.data[2]},
                    {name: '第四季度', value: res.data[3]}
                ]
                pieChart.setOption(pieOption)
            })

        }
    }
</script>

<style scoped>

</style>