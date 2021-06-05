// 載入CDN
import {
  createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// 生成元件
createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/',
      user: {
        'username': '',
        'password': '',
      },
    }
  },
  methods: {
    login() {
      const api = `${this.apiUrl}admin/signin`;

      axios.post(api, this.user)
        .then((response) => {
          console.log(response);

          if (response.data.success) {
            alert(response.data.message);
            // success 取 token 存入 cookie
            const {
              token,
              expired
            } = response.data;
            console.log(token, expired);
            // 寫入cookie 紀錄期限
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
            // 轉至產品頁
            window.location = `index.html`;
          } else {
            alert(response.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
    },
  }
}).mount('#app') // 掛載完就會觸發 mounted() 函式