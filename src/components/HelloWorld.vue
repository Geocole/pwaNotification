<template>
  <div class="hello">
    <h1>{{ msg }} version 2</h1>
    <button @click="requestPermission">Enable notification</button>
  
    <button @click="disableNotification">Disable Notification</button>
    <br><br>
    <button @click="sendNotification">Send notification</button>
    <div>
   <input type="file" @change="uploadFiles"/>
    <p v-if="offline">You are offline, file will be synced once you have a connection.</p>
    </div>
  </div>
</template>

<script>
import messaging from '../firebase-messaging';
import axios from 'axios';
import AXIOS from '../plugins/axios';
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
      token:""
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
    async uploadFiles(event) {
      const files = event.target.files;
      if (!this.offline) {
        try {
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            console.log(i);
            formData.append(files[i].name, files[i]);

          }
          const response = await AXIOS.post('https://pitrack-dev.pilote.immo/clients/scripts/upload/_ajax/upload.php', formData);
          console.log(response);
        } catch (error) {
          console.error(error);
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
            console.log(localStorage.getItem(fileName, fileContent));
          }

          reader.readAsDataURL(file);
        }
      }
    },

    async disableNotification() {
      try {
        await messaging.deleteToken();
        console.log('Notification disabled');
        this.notificationDisabled = true;
        this.notificationEnabled = false;
      } catch (err) {
        console.log('Unable to disable notification.', err);
      }
    },
    async syncFiles() {
      const keys = Object.keys(localStorage);
      const formData = new FormData();
      for (let i = 0; i < keys.length; i++) {// console.log('Synchronisation', files, filesToUpload, JSON.stringify([...currentFiles, ...filesToUpload]), JSON.parse(localStorage.getItem('filesToUpload')) );
      
        const key = keys[i];
        const fileContent = localStorage.getItem(key);
        formData.append(keys[i], fileContent );
        const response = await AXIOS.post('https://pitrack-dev.pilote.immo/clients/scripts/upload/_ajax/upload.php', formData);
        console.log(response);
        // Remove file from local storage
        localStorage.removeItem(key);

          }
          

    },
      sendNotification() {
      messaging.getToken().then(async (currentToken) => {
        console.log(currentToken);
        if (currentToken) {
          try {
        const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
          to: currentToken,
          priority: "high",
          notification: {
            title: 'New Notification',
            body: 'Hello, this is a test notification11111111111111111111111111.'
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAWbC2thA:APA91bGG_by2uabF8szRAEBaZyG4DZZf3T92r_C2leVBEe9azh5rL-rzIk3hE0vzoGfx-I--icEkyssG3xS9k7B-2J8pCPLRPtWhJssbiJTSb2rF7K1hOd4UAuTgubxmC-a77Raeade9'
          }
        })
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
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