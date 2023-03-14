<template>
  <div class="hello max-w-md">
    <h1>{{ msg }} version 4</h1>
    <button v-if="false" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      @click="requestPermission"
    >
    Enable notification
    </button>
   
    <button v-if="false" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      @click="disableNotification"
    >
    Disable Notification
    </button>

    <br><br>
    
    <button v-if="false" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
      @click="sendNotification"
    >
    Send notification
    </button>
    <div>
      <div v-if="send" class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  <span class="font-medium">Success alert!</span> File uploaded successfully.
</div>
<label class="block my-5 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>   
<input @change="uploadFiles" ref="fileupload" type="file" class="text-sm text-grey-500
            file:mr-5 file:py-3 file:px-10
            file:rounded-full file:border-0
            file:text-md file:font-semibold  file:text-white
            file:bg-gradient-to-r file:from-blue-600 file:to-amber-600
            hover:file:cursor-pointer hover:file:opacity-80
          " />

          <div class="flex flex-wrap mt-4">
      <div v-for="(image, index) in images" :key="index" class="w-1/2 px-2 py-2">
        <img :src="image" class="w-full">
      </div>
    </div>
<div class="max-w-md mx-auto ..." v-if="offline" role="alert">
  <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
    Attention
  </div>
  <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
    <p>You are offline, file will be synced once you have a connection.</p>
  </div>
</div>
    </div>
  </div>
</template>

<script>
import messaging from '../firebase-messaging';
//import axios from 'axios';
//import AXIOS from '../plugins/axios';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      offline: false,
      notificationEnabled: false,
      notificationDisabled: false,
      token:"",
      send:false,
      images:[]
    }
  },
  mounted() {
    this.checkConnection();
    window.addEventListener('online', this.checkConnection);
    window.addEventListener('offline', this.checkConnection);
  },
  
   methods: {

    requestPermission() {
      messaging.getToken().then((currentToken) => {
        if (currentToken) {
          console.log('Token: ', currentToken);
          this.token= currentToken;
          this.permissionToken=true;
          setTimeout(() => {
            this.permissionToken=false;
                     }, 9000);
          this.notificationEnabled = true;
        } else {
          console.log('No Instance ID token available. Request permission to generate one.');
          messaging.requestPermission().then(() => {
            console.log('Notification permission granted.');
            this.notificationEnabled = true;
          }).catch((err) => {
            console.log('Unable to get permission to notify.', err);
          });
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
    },

    checkConnection() {
      this.offline = !navigator.onLine;
      if (!this.offline) {
        this.syncFiles();
        console.log('is connected');
      }
    },
    clearArray() {
      this.$set(this, 'images', []);
    },
    async uploadFiles(event) {

       const files = event.target.files;
      if (!this.offline) {
        try {
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            let rawImg;
         reader.onload = async(e) => {
          this.images.push(e.target.result);
          rawImg =  reader.result;
            
        }
         setTimeout(() => {
          formData.append("fichier", rawImg);
          formData.append("name", files[i].name);
}, "2000");
          
           
        reader.readAsDataURL(files[i]);
           
          
          }
          

setTimeout(() => {
              const url = 'https://pitrack-dev.pilote.immo/clients/scripts/upload/_ajax/upload.php';
const options = {
  method: 'POST',
  headers: {
    //'Content-Type': 'multipart/form-data',
    },
  body: formData
};

fetch(url, options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  })
  .then(data => {
    console.log(data);
    this.$refs.fileupload.value = null;
            this.send=true;
            console.log(11, 'File uploaded successfully. File');
          setTimeout(() => {
            this.send=false;
}, "5000");
setTimeout(() => {
              this.send=false;
              this.images=[];
             // window.location.reload();
                     }, 6000);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);  
  });    
}, "3000");

         
        } catch (error) {
          this.images=[];
          this.$refs.fileupload.value = null;
          console.error(1, error.response);
        }
      } else {

      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();

          reader.onload = () => {
            const fileContent = reader.result;
            const fileName = file.name;

            // Store the file in local storage
            localStorage.setItem(fileName, fileContent);
            //console.log(localStorage.getItem(fileName, fileContent));
          }
         

          reader.readAsDataURL(file);
        }
        this.$refs.fileupload.value = null;
            this.send=true;
            console.log(12, 'File uploaded successfully. File');
          setTimeout(() => {
            this.send=false;
            this.images=[];
}, "5000");
      }
    },

    async disableNotification() {
      try {
        await messaging.deleteToken();
        console.log('Notification disabled');
        this.desableNotif=true;
        this.notificationDisabled = true;
        this.notificationEnabled = false;
        setTimeout(() => {
              this.desableNotif=false;
                     }, 9000);
      } catch (err) {
        console.log('Unable to disable notification.', err);
      }
    },


    async syncFiles() {
      const keys = Object.keys(localStorage);
      if(keys.length != 0){
      const formData = new FormData();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const fileContent = localStorage.getItem(key);
        formData.append("fichier", fileContent);
        formData.append("name", keys[i]);
      
        localStorage.removeItem(key);

          }
          const url = 'https://pitrack-dev.pilote.immo/clients/scripts/upload/_ajax/upload.php';
         
const options = {
  method: 'POST',
  headers: {
   // 'Content-Type': 'multipart/form-data',
    },
  body: formData
};

fetch(url, options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  })
  .then(data => {
    console.log(data);
    this.$refs.fileupload.value = null;
            this.send=true;
            console.log(13, 'File uploaded successfully.');
          setTimeout(() => {
            this.send=false;
}, "5000");
setTimeout(() => {
              this.send=false;
              this.images=[];
             // window.location.reload();
                     }, 6000);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);  
  });

          
    }
    },
      sendNotification() {
      messaging.getToken().then(async (currentToken) => {
        if (currentToken) {
          console.log(currentToken);
      //     try {
      //   const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
      //     to: currentToken,
      //     priority: "high",
      //     notification: {
      //       title: 'New Notification',
      //       body: 'Hello, this is a test notification11111111111111111111111111.'
      //     }
      //   }, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': 'key=AAAAWbC2thA:APA91bGG_by2uabF8szRAEBaZyG4DZZf3T92r_C2leVBEe9azh5rL-rzIk3hE0vzoGfx-I--icEkyssG3xS9k7B-2J8pCPLRPtWhJssbiJTSb2rF7K1hOd4UAuTgubxmC-a77Raeade9'
      //     }
      //   })
      //   console.log(response.data)
      //   this.notif=true;
      //   setTimeout(() => {
      //         this.notif=false;
      //                }, 9000);
      // } catch (error) {
      //   console.error(error)
      // }


      const url = 'https://fcm.googleapis.com/fcm/send';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'key=AAAAWbC2thA:APA91bGG_by2uabF8szRAEBaZyG4DZZf3T92r_C2leVBEe9azh5rL-rzIk3hE0vzoGfx-I--icEkyssG3xS9k7B-2J8pCPLRPtWhJssbiJTSb2rF7K1hOd4UAuTgubxmC-a77Raeade9'
  },
  body: JSON.stringify({
    to: 'e1fdSm2kkcVKTo5RW4ewBo:APA91bE6ueQ3fxXtYKfLM-gzFI7jO97l6cDJ9_CoE6qusBjXRSfvuePkITMWbKL-ceEo4tZBgXhZhTuvNlnm7q7e9XOEueAwm6y1AOHVepcplqV7V07mlAXsIUhOr02hz_pF9hqp31G5',
    priority: 'high',
    notification: {
      title: 'New Notification',
      body: 'Hello, this is a test notification.'
    }
  })
};

fetch(url, options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
       this.notif=true;
        setTimeout(() => {
              this.notif=false;
                     }, 9000);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);  this.notif=true;
        setTimeout(() => {
              this.notif=false;
                     }, 9000);
  });
        } else {
          console.log('No Instance ID token available. Enable your notification.');
            this.notificationEnabled = false;
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
      
    }
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div{
  margin: 5px;
}
</style>