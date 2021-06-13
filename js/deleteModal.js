
let delProductModal = "";

export default{
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
    
    },
    template:`<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1" aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger"></strong> {{ tempProduct.data.title }}(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteProduct(tempProduct.data.id)">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>`,
}