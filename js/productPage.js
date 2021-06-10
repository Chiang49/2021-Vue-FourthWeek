

let productModal = "";
let delProductModal = "";

const productPage = Vue.createApp({

    data(){
        return{
            products:[],
            is_New: true,
            temProduct:{
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
                console.log(res);
                if(res.data.success){
                    document.cookie = `sixToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/-2021-Vue-ThirdWeek;`;
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
        getProductData(){
            axios.get(`${url}api/${path}/admin/products`)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    this.products = res.data.products;
                    // console.log(this.products);
                    // console.log(this.temProduct.data);
                }
            })
            .catch((res) => {
                console.log(res);
            })
        },

        //刪除商品
        deleteProduct(id){

            axios.delete(`${url}api/${path}/admin/product/${id}`)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    alert("產品刪除成功");
                    delProductModal.hide();
                    this.temProduct.data = {};
                    this.getProductData();
                }else{
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //建立新產品
        newProduct(){

            axios.post(`${url}api/${path}/admin/product`,this.temProduct)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    alert("產品新增成功");
                    this.getProductData();
                    this.temProduct.data = {
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
            
            axios.put(`${url}api/${path}/admin/product/${id}`,this.temProduct)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    alert(res.data.message);
                    this.getProductData();
                    productModal.hide();
                    this.temProduct.data = {};
                }else{
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })

        },

        //上傳圖片
        updataPhoto(){
            
            if(this.temProduct.imagesUrlNum === 0){
                this.temProduct.data.imagesUrl = [];
                this.temProduct.data.imagesUrl.push(this.temProduct.data.imageUrl);
                this.temProduct.imagesUrlNum = this.temProduct.data.imagesUrl.length;
            }else{
                this.temProduct.data.imagesUrl.push(this.temProduct.data.imageUrl);
                this.temProduct.imagesUrlNum = this.temProduct.data.imagesUrl.length;
            }

            if(this.temProduct.imagesUrlNum === this.temProduct.data.imagesUrl.length){
                alert("圖片新增成功");
            }
    
        },

        //刪除圖片
        deletePhoto(){

            if(this.temProduct.imagesUrlNum === 0){
                alert("目前沒有圖片");
            }else{
                this.temProduct.data.imageUrl = "";
                this.temProduct.data.imagesUrl = [];
                this.temProduct.imagesUrlNum = 0;
                if(this.temProduct.imagesUrlNum === this.temProduct.data.imagesUrl.length){
                    alert("圖片刪除成功");
                }
            }
        
        },

        //送出資料判斷
        submitData(productId){

            if(this.is_New){
                this.newProduct();
            }else{
                this.editProduct(productId);
            }

        },

        //modal開啟
        openModal(status,item){

            if(status === 'isNew'){
                productModal.show();
                this.is_New = true;
            }else if(status === 'edit'){
                this.temProduct.data = {...item};
                this.is_New = false;
                productModal.show();
            }else if(status === 'delete'){
                this.temProduct.data = {...item};
                delProductModal.show();
            }
            
        },

        closeModal(){
            this.temProduct.data={
                imagesUrl: []
            }
        }
    },

    mounted(){

        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
        
        //確認是否登入
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)sixToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        axios.post(`${url}api/user/check`)
        .then((res) => {
            // console.log(res);
            if(res.data.success){
                this.getProductData();
            }else{
                alert("已被登出");
                document.cookie = `sixToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/-2021-Vue-ThirdWeek;`;
                window.location="index.html";
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

}).mount('#productPage');


