
const login = {

    data(){
        return{
            apiUrl:'https://vue3-course-api.hexschool.io/',
            user:{
                username: "",
                password: ""
              }
        }
    },

    methods:{
        
        login(){

            const api = `${this.apiUrl}admin/signin`;
            
            if(this.user.username === "" || this.user.password === ""){

                alert("帳號密碼未填寫");

            }else{

                axios.post(api, this.user)
                .then((res) => {
                    if(res.data.success){
                        const {expired,token} = res.data;
                        document.cookie = `sixToken=${token}; expires=${new Date(expired)}`;

                        alert("登入成功");
                        window.location = "product.html";
                    }else{
                        alert("帳號密碼錯誤，登入失敗");
                        this.user.username = "";
                        this.user.password = "";
                    }
                    
                })
                .catch((err) => {
                    console.log(err);
                })

            }
        }
    }
}

Vue.createApp(login).mount('#login');