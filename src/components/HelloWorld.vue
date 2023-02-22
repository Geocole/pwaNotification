<template>
  <div class="hello">
    <h1>{{ msg }} version 2</h1>
    <button @click="requestPermission">Enable notification</button>
  
    <button @click="disableNotification">Disable Notification</button>
    <br><br>
    <button @click="sendNotification">Send notification</button>
    <div>
   <input type="file" @change="uploadFile"/>
    <p v-if="offline">You are offline, file will be synced once you have a connection.</p>
    </div>
  </div>
</template>

<script>
import messaging from '../firebase-messaging';
import axios from 'axios';
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
      }
    },
    async uploadFile(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      if (!this.offline) {
        try {
         // const response = await axios.post('/api/files', formData);
          console.log(1);
        } catch (error) {
          console.error(error);
        }
      } else {
        // Save the file to local storage for syncing later
        localStorage.setItem('fileToSync', JSON.stringify(formData));
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
      // Check if there is a file in local storage to sync
      const fileToSync = localStorage.getItem('fileToSync');
      if (fileToSync) {
        try {
          const formData = JSON.parse(fileToSync);
          //const response = await axios.post('/api/files', formData);
          console.log(formData);
          localStorage.removeItem('fileToSync');
        } catch (error) {
          console.error(error);
        }
      }
    },
      sendNotification() {
      messaging.getToken().then(async (currentToken) => {
        console.log(currentToken);
        if (currentToken) {
          try {
        const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
          to: currentToken,
          notification: {
            title: 'New Notification',
            body: 'Hello, this is a test notification.'
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
            //'Authorization':'BBMDwG79kjww-AMiZaBoeUbSwS7A66hImObsSX0WwKsPMsalw62xvtlAn-xZwPSgcVrU0VcWf23DRI5DH131wW0'
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