// 載入CDN
import {
  createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// Bootstrap Modal 視窗用
let productModal = '';
let delProductModal = '';


createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/',
      apiPath: 'moitw',
      products: [],
      productCount: 0,
      isNew: false, // 是否新增產品
      tempProduct: { // 暫時拿出來修改或新增的物件
        imagesUrl: [],
      },
    }
  },
  mounted() { // 元件產生時，如init
    // 設定 Modal(新增/編輯)和(刪除)視窗
    productModal = new bootstrap.Modal(document.querySelector("#productModal"), {
      keyboard: false
    });
    delProductModal = new bootstrap.Modal(document.querySelector("#delProductModal"), {
      keyboard: false
    });
    // 取出token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token || token === '') {
      alert('你尚未登入，請重新登入');
      window.location = "login.html";
    }
    axios.defaults.headers.common['Authorization'] = token;
    this.getProduct();
  },
  methods: {
    // 取得產品列表
    getProduct(page = 1) {
      const url = `${this.apiUrl}api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((response) => {
          // console.log(response);
          if (response.data.success) {
            this.products = response.data.products;
            this.productCount = this.products.length;
          } else {
            alert(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // 更新產品
    updateProduct() {
      console.log('更新函式');
      // 新增
      let url = `${this.apiUrl}api/${this.apiPath}/admin/product`;
      let httpMethod = 'post';

      // 編輯
      if (!this.isNew) {
        url = `${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put'
      }
      // 因是變數，所以使用[]取值
      axios[httpMethod](url, {
        data: this.tempProduct
      }).then((response) => {
        console.log("有執行");
        if (response.data.success) {
          alert(response.data.message)
          productModal.hide();
          this.getProduct()
        } else {
          alert(response.data.message)
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    // 刪除產品
    delProduct() {
      console.log('有觸發到 delProduct');
      const url = `${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
          console.log(response.data.message);
          if (response.data.success) {
            alert(response.data.message);
            delProductModal.hide();
            this.getProduct();
            console.log('有刪除到');
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error, response.data.message);
        })
    },
    // 打開 Modal 視窗
    openModal(isNew, item) { // 參數帶(狀態,產品)
      // 狀態是new
      if (isNew === 'new') {
        console.log('openModal - new');
        this.tempProduct = { // 清空
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        console.log('openModal - edit');
        this.tempProduct = {
          // 以解構 淺拷貝一份出來修改，不然會直接修改原資料
          ...item
        };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        console.log('openModal - delete');
        this.tempProduct = {
          ...item
        };
        console.log('Temp: ', this.tempProduct);
        delProductModal.show();
      }
    },

    // 新增圖片暫放
    createImages() {
      console.log('有觸發到 createImages');
      this.tempProduct.imagesUrl = []; // 複數
      this.tempProduct.imagesUrl.push('');
    },
  },

}).mount('#app');