<template>
    <div>

        <div style="padding: 10px 0">
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search"
                      v-model="username"></el-input>
            <!--                        <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message"-->
            <!--                                  class="ml-5"></el-input>-->
            <!--                        <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position"-->
            <!--                                  class="ml-5"></el-input>-->
            <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
            <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
        </div>
        <div style="margin: 10px 0">
            <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i>
            </el-button>
            <el-popconfirm
                    class="ml-5"
                    confirm-button-text='确定'
                    cancel-button-text='再想想'
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定批量删除吗？"
                    @confirm="delBatch"
            >
                <el-button type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"></i></el-button>
            </el-popconfirm>
            <el-upload :action="'http://' + serverIp + ':8088/user/import'" :show-file-list="false"
                       :on-success="handleExcelSuccess" accept="xlsx" style="display: inline-block">
                <el-button type="primary">导入<i class="el-icon-bottom"></i></el-button>
            </el-upload>
            <el-button type="primary" @click="exp" class="ml-5">导出<i class="el-icon-top"></i></el-button>
        </div>
        <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">>
            <!--                        选项框-->
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="id" label="Id" width="40">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="role" label="角色" width="120">
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" width="120">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="120">
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址" width="120">
            </el-table-column>


            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i>
                    </el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='再想想'
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除吗？"
                            @confirm="del(scope.row.id)"
                    >
                        <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>


        <div style=" padding: 10px 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

        <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
<!--            下拉选择框-->
                <el-form-item label="角色">
                    <el-select clearable v-model="form.role" placeholdr="请选择角色" style="width:100%">
                        <el-option v-for="item in roles" :key="item.name" :label="item.name"
                                   :value="item.flag"></el-option></el-select>
                </el-form-item>


                <el-form-item label="昵称">
                    <el-input v-model="form.nickname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>



            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save" v-show="qd">确 定</el-button>
                <el-button type="primary" @click="update" v-show="xg">修 改</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {serverIp} from "../../public/config";

    export default {
        name: "User",
        data() {
            return {
                tableData: [],
                total: 0,
                pageNum: 1,
                pageSize: 5,
                username: '',
                multipleSelection: [],
                dialogFormVisible: false,
                form: {},
                //确定，修改按钮
                qd: false,
                xg: false,
                roles:[],
                serverIp:serverIp

            }
        },
        created() {
            this.load()
        },
        methods: {
            // 批量删除
            delBatch() {
                let ids = this.multipleSelection.map(v => v.id)  //[{},{}]=>[1,2]
                this.request.delete("/user/del/ids", {data: ids}).then(res => {
                    if (res.code==='200') {
                        this.$message.success("删除成功")
                        this.load()
                    } else {
                        this.$message.success("删除失败")
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            //重置
            reset() {
                this.username = ""
                this.load()
            },
            //新增窗口界面
            handleAdd() {
                this.dialogFormVisible = true
                this.qd = true
                this.form = {}

            },
            //编辑
            handleEdit(row) {
                this.form = row
                this.dialogFormVisible = true
                this.xg = true
            },
            //删除
            del(id) {
                this.request.delete("/user/" + id).then(res => {
                    if (res.code==='200') {
                        this.$message.success("删除成功")
                        this.load()
                    } else {
                        this.$message.success("删除失败")
                    }
                })
            },
            //确定按钮
            save() {
                this.request.post("/user", this.form).then(res => {
                    if (res.code==='200') {
                        this.$message.success("新增成功")
                        this.dialogFormVisible = false
                        this.load()
                    } else {
                        this.$message.success("新增失败")
                    }
                })
            },
            //修改按钮
            update() {
                this.request.put("/user", this.form).then(res => {
                    if (res.code==='200') {
                        this.$message.success("修改成功")
                        this.dialogFormVisible = false
                        this.load()
                    } else {
                        this.$message.success("修改失败")
                    }
                })
            },

            load() {
                this.request.get("/user/page", {
                        params: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            username: this.username
                        }
                    }
                ).then(res => {
                    this.tableData = res.data.records
                    this.total = res.data.total

                })
                this.request.get("/role").then(res=>{
                    this.roles=res.data
                })
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize
                this.load()
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum
                this.load()
            },
            exp() {
                window.open(`http://${serverIp}:8088/user/export`)
            },
            handleExcelSuccess() {
                this.$message.success("文件导入成功！")
                this.load()
            }
        }
    }
</script>

<style scoped>

</style>