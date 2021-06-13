
let productModal = "";
let delProductModal = "";

//外層元件
const productPage = Vue.createApp({

    data(){
        return{
            pagination:{},
            products:[],
            isNew: true,
            tempProduct:{
                imagesUrlNum: 0,
                data:{
                    imagesUrl: []
                }
            }
        }
    },

    methods:{

        //登出
        signOut(){
            axios.post(`${url}logout`)
            .then((res) => {
                if(res.data.success){
                    document.cookie = `sixToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    alert(res.data.message);
                    window.location = "index.html";
                }else{
                    alert("登出失敗");
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //取得商品列表
        getProductData(page = 1){
            axios.get(`${url}api/${path}/admin/products?page=${page}`)
            .then((res) => {
                if(res.data.success){
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                }
            })
            .catch((res) => {
                console.log(res);
            })
        },

        //modal開啟
        openModal(status,item){
            
            if(status === 'isNew'){
                this.isNew = true;
                productModal.show();
            }else if(status === 'edit'){
                this.isNew = false;
                this.tempProduct.data = {...item};
                productModal.show();
            }else if(status === 'delete'){
                this.tempProduct.data = {...item};
                delProductModal.show();
            }
            
        },

    },

    mounted() {
        //確認是否登入
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)sixToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        axios.post(`${url}api/user/check`)
        .then((res) => {
            if(res.data.success){
                this.getProductData();
            }else{
                alert("已被登出");
                document.cookie = `sixToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                window.location="index.html";
            }
        })
        .catch((err) => {
            console.log(err);
        })

    },
})

//page 元件
productPage.component('pagination',{
    template:'#x-pagination',
    props:{
        pagination:{
            type: Object,
            default(){
                return{

                }
            }
        }
    },
    methods:{
        pageAction(item){
            this.$emit('page',item);
        }
    }
})

//product Modal 元件
productPage.component('productModal',{
    template:'#x-productModal',
    props:{
        isNew:{
            type: Boolean,
            default: true
        },
        tempProduct:{
            type: Object,
            default(){
                return{
                    imagesUrlNum: 0,
                    data:{
                        imagesUrl: []
                    }
                }
            }
        }
    },
    data(){
        return{
            model: null
        }
    },
    methods:{
        //建立新產品
        newProduct(){

            axios.post(`${url}api/${path}/admin/product`,this.tempProduct)
            .then((res) => {
                if(res.data.success){
                    alert("產品新增成功");
                    this.$emit('getProduct');   //$emit 與外層傳遞事件
                    this.tempProduct.data = {
                        imagesUrl: []
                    };
                    productModal.hide();
                }else{
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })

        },

        //修改商品
        editProduct(id){
            
            axios.put(`${url}api/${path}/admin/product/${id}`,this.tempProduct)
            .then((res) => {
                if(res.data.success){
                    alert(res.data.message);
                    this.$emit('get-product');
                    productModal.hide();
                    this.tempProduct.data = {};
                }else{
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })

        },

        //送出資料判斷
        submitData(productId){

            if(this.isNew){
                this.newProduct();
            }else{
                this.editProduct(productId);
            }

        },

        //上傳圖片
        updataPhoto(){
            
            if(this.tempProduct.imagesUrlNum === 0){
                this.tempProduct.data.imagesUrl = [];
                this.tempProduct.data.imagesUrl.push(this.tempProduct.data.imageUrl);
                this.tempProduct.imagesUrlNum = this.tempProduct.data.imagesUrl.length;
            }else{
                this.tempProduct.data.imagesUrl.push(this.tempProduct.data.imageUrl);
                this.tempProduct.imagesUrlNum = this.tempProduct.data.imagesUrl.length;
            }

            if(this.tempProduct.imagesUrlNum === this.tempProduct.data.imagesUrl.length){
                alert("圖片新增成功");
            }
    
        },

        //刪除圖片
        deletePhoto(){

            if(this.tempProduct.imagesUrlNum === 0){
                alert("目前沒有圖片");
            }else{
                this.tempProduct.data.imageUrl = "";
                this.tempProduct.data.imagesUrl = [];
                this.tempProduct.imagesUrlNum = 0;
                if(this.tempProduct.imagesUrlNum === this.tempProduct.data.imagesUrl.length){
                    alert("圖片刪除成功");
                }
            }
        
        },

        //modla 關閉
        closeModal(){
            this.tempProduct.data={
                imagesUrl: []
            }
        }

    },
    mounted(){
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
    }
})

//delete Modal 元件
productPage.component('deleteProduct',{
    template:'#x-delProductModal',
    props:{
        tempProduct:{
            type:Object,
            default(){
                return{
                    imagesUrlNum: 0,
                    data:{
                        imagesUrl: []
                    }
                }
            }
        }
    },
    data(){
        return{
            modal:null,
        }
    },
    methods:{
        //刪除商品
        deleteProduct(id){

            axios.delete(`${url}api/${path}/admin/product/${id}`)
            .then((res) => {
                if(res.data.success){
                    alert("產品刪除成功");
                    delProductModal.hide();
                    this.tempProduct.data = {};
                    this.$emit('get-product');
                }else{
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
    },
    mounted(){

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    
    }
})



productPage.mount('#productPage');


